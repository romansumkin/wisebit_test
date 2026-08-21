import { test, expect } from '@fixtures/api.fixture';
import type { AccountApi } from '@api-clients/account.api';
import { NOT_AUTHORIZED } from '@api-clients/api-errors';
import type { UserProfile } from '@api-clients/types';
import { expectJson } from '@asserts/api-response.assert';
import type { RegisteredUser } from '@test-data/user';

async function collectionIsbns(accountApi: AccountApi, user: RegisteredUser): Promise<string[]> {
  const response = await accountApi.getUser(user.userId, user.token);
  const profile = await expectJson<UserProfile>(response, 200, 'get user response');

  return profile.books.map((book) => book.isbn);
}

test('a book from the catalog is added to the user collection', async ({
  accountApi,
  bookStoreApi,
  userWithEmptyCollection: user,
  catalog,
}) => {
  const isbn = catalog.randomIsbn();

  await test.step(`add book ${isbn} to the collection`, async () => {
    const response = await bookStoreApi.addBooks({ userId: user.userId, isbns: [isbn] }, user.token);

    await expect(response, 'add book response').toHaveStatus(201);
  });

  expect(await collectionIsbns(accountApi, user), 'isbns in the collection').toContain(isbn);
});

test('adding a book without a token is rejected and changes nothing', async ({
  accountApi,
  bookStoreApi,
  userWithEmptyCollection: user,
  catalog,
}) => {
  const isbn = catalog.randomIsbn();
  const before = await collectionIsbns(accountApi, user);

  const response = await test.step(`try to add book ${isbn} with no Authorization header`, () =>
    bookStoreApi.addBooks({ userId: user.userId, isbns: [isbn] }));

  await expect(response, 'unauthorized add response').toBeApiError(NOT_AUTHORIZED);

  const after = await collectionIsbns(accountApi, user);
  expect([...after].sort(), 'isbns after the rejected add').toEqual([...before].sort());
});
