import { test } from '@fixtures/api.fixture';
import { NOT_AUTHORIZED } from '@api-clients/api-errors';
import { expectApiError } from '@asserts/api-response.assert';

test('a book from the catalog is added to the user collection', async ({
  accountSteps,
  bookStoreSteps,
  userWithEmptyCollection,
  catalog,
}) => {
  const isbn = catalog.randomIsbn();

  await bookStoreSteps.addBook(userWithEmptyCollection, isbn);

  await accountSteps.expectCollectionToContain(userWithEmptyCollection, isbn);
});

test('adding a book without a token is rejected and changes nothing', async ({
  accountSteps,
  bookStoreSteps,
  userWithEmptyCollection,
  catalog,
}) => {
  const isbn = catalog.randomIsbn();
  const before = await accountSteps.collectionIsbns(userWithEmptyCollection);

  const response = await bookStoreSteps.attemptAddBookWithoutToken(userWithEmptyCollection, isbn);

  await expectApiError(response, NOT_AUTHORIZED);
  await accountSteps.expectCollectionUnchanged(userWithEmptyCollection, before);
});
