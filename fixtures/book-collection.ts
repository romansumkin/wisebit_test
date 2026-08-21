import type { AccountApi } from '@api-clients/account.api';
import type { UserProfile } from '@api-clients/types';
import { expectJson } from '@asserts/api-response.assert';
import type { RegisteredUser } from '@test-data/user';

export async function collectionIsbns(
  accountApi: AccountApi,
  user: RegisteredUser,
): Promise<string[]> {
  const response = await accountApi.getUser(user.userId, user.token);
  const profile = await expectJson<UserProfile>(response, 200, 'get user response');

  return profile.books.map((book) => book.isbn);
}
