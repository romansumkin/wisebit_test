import { test as base, expect } from '@playwright/test';
import { AccountApi } from '@api-clients/account.api';
import { BookStoreApi } from '@api-clients/book-store.api';
import { AccountSteps } from '@steps/account.steps';
import { BookStoreSteps } from '@steps/book-store.steps';
import { UserRegistry } from '@steps/user-registry';
import { BookCatalog } from '@test-data/book-catalog';
import type { RegisteredUser } from '@test-data/user';

type UserWithBook = {
  readonly user: RegisteredUser;
  readonly ownedIsbn: string;
  readonly notOwnedIsbn: string;
};

type ApiFixtures = {
  accountApi: AccountApi;
  bookStoreApi: BookStoreApi;
  userRegistry: UserRegistry;
  accountSteps: AccountSteps;
  bookStoreSteps: BookStoreSteps;
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

  accountSteps: [
    async ({ accountApi, userRegistry }, use) => {
      await use(new AccountSteps(accountApi, userRegistry));
    },
    { box: true },
  ],

  bookStoreSteps: [
    async ({ bookStoreApi }, use) => {
      await use(new BookStoreSteps(bookStoreApi));
    },
    { box: true },
  ],

  catalog: async ({ bookStoreSteps }, use) => {
    await use(new BookCatalog(await bookStoreSteps.catalogIsbns()));
  },

  registeredUser: async ({ accountSteps }, use) => {
    await use(await accountSteps.register());
  },

  userWithEmptyCollection: async ({ accountSteps, registeredUser }, use) => {
    await accountSteps.expectCollectionToBeEmpty(registeredUser);

    await use(registeredUser);
  },

  userWithBook: async ({ bookStoreSteps, userWithEmptyCollection, catalog }, use) => {
    const [ownedIsbn, notOwnedIsbn] = catalog.randomIsbns(2);

    await bookStoreSteps.addBook(userWithEmptyCollection, ownedIsbn);

    await use({ user: userWithEmptyCollection, ownedIsbn, notOwnedIsbn });
  },
});

export { expect };
