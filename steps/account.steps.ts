import { test, expect, type APIResponse } from '@playwright/test';
import type { AccountApi } from '@api-clients/account.api';
import type {
  CreateUserResult,
  Credentials,
  TokenViewModel,
  UserProfile,
} from '@api-clients/types';
import { expectJson } from '@asserts/api-response.assert';
import { createCredentials, type RegisteredUser } from '@test-data/user';
import type { UserRegistry } from './user-registry';

export class AccountSteps {
  constructor(
    private readonly accountApi: AccountApi,
    private readonly registry: UserRegistry,
  ) {}

  async createUser(credentials: Credentials): Promise<CreateUserResult> {
    return test.step(`create user ${credentials.userName}`, async () => {
      const response = await this.accountApi.createUser(credentials);
      const created = await expectJson<CreateUserResult>(response, 201);

      expect(created.userID, 'id of the created user').not.toHaveLength(0);
      this.registry.track({ ...credentials, userId: created.userID });

      return created;
    });
  }

  async attemptCreateUser(credentials: Credentials): Promise<APIResponse> {
    return test.step(`try to create user ${credentials.userName}`, () =>
      this.accountApi.createUser(credentials));
  }

  async logIn(credentials: Credentials): Promise<TokenViewModel> {
    return test.step(`log in as ${credentials.userName}`, async () => {
      const response = await this.accountApi.generateToken(credentials);
      const session = await expectJson<TokenViewModel>(response, 200);

      expect(session.token, 'issued token').not.toHaveLength(0);

      return session;
    });
  }

  async register(credentials: Credentials = createCredentials()): Promise<RegisteredUser> {
    return test.step(`register ${credentials.userName}`, async () => {
      const created = await this.createUser(credentials);
      const { token } = await this.logIn(credentials);

      return { ...credentials, userId: created.userID, token };
    });
  }

  async collectionIsbns(user: RegisteredUser): Promise<string[]> {
    return test.step(`read the collection of ${user.userName}`, async () => {
      const response = await this.accountApi.getUser(user.userId, user.token);
      const profile = await expectJson<UserProfile>(response, 200);

      return profile.books.map((book) => book.isbn);
    });
  }

  async expectCollectionToBeEmpty(user: RegisteredUser): Promise<void> {
    await test.step(`expect the collection of ${user.userName} to be empty`, async () => {
      expect(await this.collectionIsbns(user), 'isbns in the collection').toEqual([]);
    });
  }

  async expectCollectionToContain(user: RegisteredUser, isbn: string): Promise<void> {
    await test.step(`expect the collection of ${user.userName} to contain ${isbn}`, async () => {
      expect(await this.collectionIsbns(user), 'isbns in the collection').toContain(isbn);
    });
  }

  async expectCollectionNotToContain(user: RegisteredUser, isbn: string): Promise<void> {
    await test.step(`expect the collection of ${user.userName} not to contain ${isbn}`, async () => {
      expect(await this.collectionIsbns(user), 'isbns in the collection').not.toContain(isbn);
    });
  }

  async expectCollectionUnchanged(user: RegisteredUser, before: readonly string[]): Promise<void> {
    await test.step(`expect the collection of ${user.userName} to be unchanged`, async () => {
      const after = await this.collectionIsbns(user);

      expect([...after].sort(), 'isbns in the collection').toEqual([...before].sort());
    });
  }
}
