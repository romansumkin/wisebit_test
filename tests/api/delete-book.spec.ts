import { test } from '@fixtures/api.fixture';
import { ISBN_NOT_IN_COLLECTION } from '@api-clients/api-errors';
import { expectApiError } from '@asserts/api-response.assert';

test('a book is removed from the user collection', async ({
  accountSteps,
  bookStoreSteps,
  userWithBook,
}) => {
  const { user, ownedIsbn } = userWithBook;

  await accountSteps.expectCollectionToContain(user, ownedIsbn);

  await bookStoreSteps.deleteBook(user, ownedIsbn);

  await accountSteps.expectCollectionNotToContain(user, ownedIsbn);
});

test('deleting a book the user does not own is rejected and changes nothing', async ({
  accountSteps,
  bookStoreSteps,
  userWithBook,
}) => {
  const { user, notOwnedIsbn } = userWithBook;
  const before = await accountSteps.collectionIsbns(user);

  const response = await bookStoreSteps.attemptDeleteBook(user, notOwnedIsbn);

  await expectApiError(response, ISBN_NOT_IN_COLLECTION);
  await accountSteps.expectCollectionUnchanged(user, before);
});
