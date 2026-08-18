import { test, expect } from '@fixtures/api.fixture';
import type { MessageModal, UserProfile } from '@api-clients/types';

test('a book from the catalog is added to the user collection', async ({
  accountApi,
  bookStoreApi,
  user,
  catalogIsbns,
}) => {
  const [isbn] = catalogIsbns;

  await test.step('add the book to the collection', async () => {
    const response = await bookStoreApi.addBooks({ userId: user.userId, isbns: [isbn] }, user.token);
    expect(response.status()).toBe(201);
  });

  await test.step('check the book is in the user profile', async () => {
    const response = await accountApi.getUser(user.userId, user.token);
    expect(response.status()).toBe(200);

    const body: UserProfile = await response.json();
    expect(body.books.map((book) => book.isbn)).toEqual([isbn]);
  });
});

test('adding a book without a token is rejected', async ({
  accountApi,
  bookStoreApi,
  user,
  catalogIsbns,
}) => {
  const [isbn] = catalogIsbns;

  await test.step('add the book with no Authorization header', async () => {
    const response = await bookStoreApi.addBooks({ userId: user.userId, isbns: [isbn] });
    expect(response.status()).toBe(401);

    const body: MessageModal = await response.json();
    expect(body.code).toBe('1200');
    expect(body.message).toBe('User not authorized!');
  });

  await test.step('check nothing was added to the collection', async () => {
    const response = await accountApi.getUser(user.userId, user.token);
    expect(response.status()).toBe(200);

    const body: UserProfile = await response.json();
    expect(body.books).toEqual([]);
  });
});
