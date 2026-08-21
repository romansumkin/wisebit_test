import { test as base, mergeExpects } from '@playwright/test';
import { AccountApi } from '@api-clients/account.api';
import { BookStoreApi } from '@api-clients/book-store.api';
import type { BookList, CreateUserResult, TokenViewModel, UserProfile } from '@api-clients/types';
import { expect as apiExpect, expectJson } from '@asserts/api-response.assert';
import { BookCatalog } from '@test-data/book-catalog';
import { createCredentials, type RegisteredUser } from '@test-data/user';
import { UserRegistry } from './user-registry';

export const expect = mergeExpects(apiExpect);

type UserWithBook = {
  readonly user: RegisteredUser;
  readonly ownedIsbn: string;
  readonly notOwnedIsbn: string;
};

type ApiFixtures = {
  accountApi: AccountApi;
  bookStoreApi: BookStoreApi;
  userRegistry: UserRegistry;
  catalog: BookCatalog;
  registeredUser: RegisteredUser;
  userWithEmptyCollection: RegisteredUser;
  userWithBook: UserWithBook;
};

export const test = base.extend<ApiFixtures>({
  accountApi: [
    async ({ request }, use) => {
      await use(new AccountApi(request));
    },
    { box: true },
  ],

  bookStoreApi: [
    async ({ request }, use) => {
      await use(new BookStoreApi(request));
    },
    { box: true },
  ],

  userRegistry: [
    async ({ accountApi, bookStoreApi }, use) => {
      const registry = new UserRegistry(accountApi, bookStoreApi);

      await use(registry);

      if (registry.size > 0) {
        await test.step(`remove the ${registry.size} user(s) this test created`, () =>
          registry.cleanUp());
      }
    },
    { box: true },
  ],

  catalog: async ({ bookStoreApi }, use) => {
    const isbns = await test.step('read the book catalog', async () => {
      const response = await bookStoreApi.listBooks();
      const { books } = await expectJson<BookList>(response, 200, 'book catalog response');

      expect(books.length, 'books in the catalog').toBeGreaterThan(1);

      return books.map((book) => book.isbn);
    });

    await use(new BookCatalog(isbns));
  },

  registeredUser: async ({ accountApi, userRegistry }, use) => {
    const user = await test.step('register a fresh user', async () => {
      const credentials = createCredentials();

      const response = await accountApi.createUser(credentials);
      const created = await expectJson<CreateUserResult>(response, 201, 'create user response');
      userRegistry.track({ ...credentials, userId: created.userID });

      const authorized = await accountApi.generateToken(credentials);
      const session = await expectJson<TokenViewModel>(authorized, 200, 'login response');

      return { ...credentials, userId: created.userID, token: session.token };
    });

    await use(user);
  },

  userWithEmptyCollection: async ({ accountApi, registeredUser }, use) => {
    await test.step('check the new collection is empty', async () => {
      const response = await accountApi.getUser(registeredUser.userId, registeredUser.token);
      const profile = await expectJson<UserProfile>(response, 200, 'get user response');

      expect(profile.books, 'collection of a brand new user').toEqual([]);
    });

    await use(registeredUser);
  },

  userWithBook: async ({ bookStoreApi, userWithEmptyCollection, catalog }, use) => {
    const [ownedIsbn, notOwnedIsbn] = catalog.randomIsbns(2);

    await test.step(`add book ${ownedIsbn} to the collection`, async () => {
      const response = await bookStoreApi.addBooks(
        { userId: userWithEmptyCollection.userId, isbns: [ownedIsbn] },
        userWithEmptyCollection.token,
      );

      await expect(response, 'add book response').toHaveStatus(201);
    });

    await use({ user: userWithEmptyCollection, ownedIsbn, notOwnedIsbn });
  },
});
