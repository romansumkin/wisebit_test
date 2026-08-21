import { test, expect } from '@fixtures/api.fixture';
import type { AccountApi } from '@api-clients/account.api';
import { ISBN_NOT_IN_COLLECTION } from '@api-clients/api-errors';
import type { UserProfile } from '@api-clients/types';
import { expectJson } from '@asserts/api-response.assert';
import type { RegisteredUser } from '@test-data/user';

async function collectionIsbns(accountApi: AccountApi, user: RegisteredUser): Promise<string[]> {
  const response = await accountApi.getUser(user.userId, user.token);
  const profile = await expectJson<UserProfile>(response, 200, 'get user response');

  return profile.books.map((book) => book.isbn);
}

test('a book is removed from the user collection', async ({
  accountApi,
  bookStoreApi,
  userWithBook,
}) => {
  const { user, ownedIsbn } = userWithBook;

  expect(await collectionIsbns(accountApi, user), 'isbns before the delete').toContain(ownedIsbn);

  await test.step(`delete book ${ownedIsbn} from the collection`, async () => {
    const response = await bookStoreApi.deleteBook({ userId: user.userId, isbn: ownedIsbn }, user.token);

    await expect(response, 'delete book response').toHaveStatus(204);
    expect(await response.text(), 'delete response body').toBe('');
  });

  expect(await collectionIsbns(accountApi, user), 'isbns after the delete').not.toContain(ownedIsbn);
});

test('deleting a book the user does not own is rejected and changes nothing', async ({
  accountApi,
  bookStoreApi,
  userWithBook,
}) => {
  const { user, notOwnedIsbn } = userWithBook;
  const before = await collectionIsbns(accountApi, user);

  const response = await test.step(`try to delete book ${notOwnedIsbn} the user does not own`, () =>
    bookStoreApi.deleteBook({ userId: user.userId, isbn: notOwnedIsbn }, user.token));

  await expect(response, 'delete of a not-owned book response').toBeApiError(ISBN_NOT_IN_COLLECTION);

  const after = await collectionIsbns(accountApi, user);
  expect([...after].sort(), 'isbns after the rejected delete').toEqual([...before].sort());
});
