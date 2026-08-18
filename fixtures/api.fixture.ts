import { test as base, expect } from '@playwright/test';
import { AccountApi } from '@api-clients/account.api';
import { BookStoreApi } from '@api-clients/book-store.api';
import type { AllBooksModal, CreateUserResult, TokenViewModel } from '@api-clients/types';
import { createCredentials, type Credentials } from '@test-data/user';

type RegisteredUser = Credentials & {
  userId: string;
  token: string;
};

type UserWithBook = RegisteredUser & {
  isbn: string;
  otherIsbn: string;
};

type ApiFixtures = {
  accountApi: AccountApi;
  bookStoreApi: BookStoreApi;
  createdUsers: RegisteredUser[];
  catalogIsbns: string[];
  user: RegisteredUser;
  userWithBook: UserWithBook;
};

export const test = base.extend<ApiFixtures>({
  accountApi: async ({ request }, use) => {
    await use(new AccountApi(request));
  },

  bookStoreApi: async ({ request }, use) => {
    await use(new BookStoreApi(request));
  },

  createdUsers: async ({ accountApi, bookStoreApi }, use) => {
    const users: RegisteredUser[] = [];

    await use(users);

    for (const { userId, token } of users) {
      await bookStoreApi.deleteAllBooks(userId, token).catch(() => {});
      await accountApi.deleteUser(userId, token).catch(() => {});
    }
  },

  catalogIsbns: async ({ bookStoreApi }, use) => {
    const response = await bookStoreApi.listBooks();
    expect(response.status(), 'GET /BookStore/v1/Books').toBe(200);

    const { books }: AllBooksModal = await response.json();
    await use(books.map((book) => book.isbn));
  },

  user: async ({ accountApi, createdUsers }, use) => {
    const credentials = createCredentials();

    const created = await accountApi.createUser(credentials);
    expect(created.status(), 'POST /Account/v1/User').toBe(201);
    const { userID }: CreateUserResult = await created.json();

    const authorized = await accountApi.generateToken(credentials);
    expect(authorized.status(), 'POST /Account/v1/GenerateToken').toBe(200);
    const { token }: TokenViewModel = await authorized.json();

    const registered = { ...credentials, userId: userID, token };
    createdUsers.push(registered);

    await use(registered);
  },

  userWithBook: async ({ bookStoreApi, user, catalogIsbns }, use) => {
    const [isbn, otherIsbn] = catalogIsbns;

    const added = await bookStoreApi.addBooks({ userId: user.userId, isbns: [isbn] }, user.token);
    expect(added.status(), 'POST /BookStore/v1/Books').toBe(201);

    await use({ ...user, isbn, otherIsbn });
  },
});

export { expect };
