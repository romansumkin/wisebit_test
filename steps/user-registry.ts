import type { AccountApi } from '@api-clients/account.api';
import type { BookStoreApi } from '@api-clients/book-store.api';
import type { TokenViewModel } from '@api-clients/types';
import type { TrackedUser } from '@test-data/user';

export class UserRegistry {
  private readonly users: TrackedUser[] = [];

  constructor(
    private readonly accountApi: AccountApi,
    private readonly bookStoreApi: BookStoreApi,
  ) {}

  get size(): number {
    return this.users.length;
  }

  track(user: TrackedUser): void {
    this.users.push(user);
  }

  async cleanUp(): Promise<void> {
    for (const user of this.users.splice(0)) {
      await this.remove(user).catch(() => {});
    }
  }

  private async remove(user: TrackedUser): Promise<void> {
    const authorized = await this.accountApi.generateToken(user);

    if (authorized.status() !== 200) {
      return;
    }

    const { token }: TokenViewModel = await authorized.json();

    await this.bookStoreApi.deleteAllBooks(user.userId, token);
    await this.accountApi.deleteUser(user.userId, token);
  }
}
