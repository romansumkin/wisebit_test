import { test, expect } from '@fixtures/api.fixture';
import type { MessageModal, UserProfile } from '@api-clients/types';

test('a book is removed from the user collection', async ({ accountApi, bookStoreApi, userWithBook }) => {
  await test.step('delete the book', async () => {
    const response = await bookStoreApi.deleteBook(
      { userId: userWithBook.userId, isbn: userWithBook.isbn },
      userWithBook.token,
    );
    expect(response.status()).toBe(204);
  });

  await test.step('check the collection is empty', async () => {
    const response = await accountApi.getUser(userWithBook.userId, userWithBook.token);
    expect(response.status()).toBe(200);

    const body: UserProfile = await response.json();
    expect(body.books).toEqual([]);
  });
});

test('deleting a book the user does not own is rejected', async ({
  bookStoreApi,
  userWithBook,
}) => {
  const response = await bookStoreApi.deleteBook(
    { userId: userWithBook.userId, isbn: userWithBook.otherIsbn },
    userWithBook.token,
  );

  expect(response.status()).toBe(400);

  const body: MessageModal = await response.json();
  expect(body.code).toBe('1206');
  expect(body.message).toBe("ISBN supplied is not available in User's Collection!");
});
