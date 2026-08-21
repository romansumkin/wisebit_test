import { test, expect } from '@fixtures/api.fixture';
import { USER_EXISTS } from '@api-clients/api-errors';
import type { CreateUserResult, TokenViewModel } from '@api-clients/types';
import { expectJson } from '@asserts/api-response.assert';
import { createCredentials } from '@test-data/user';

test('a new user is created with an empty collection and can log in', async ({
  accountApi,
  userRegistry,
}) => {
  const credentials = createCredentials();

  const created = await test.step(`create user ${credentials.userName}`, async () => {
    const response = await accountApi.createUser(credentials);
    const body = await expectJson<CreateUserResult>(response, 201, 'create user response');

    userRegistry.track({ ...credentials, userId: body.userID });

    return body;
  });

  expect(created.userID, 'id of the created user').not.toHaveLength(0);
  expect(created.username, 'name of the created user').toBe(credentials.userName);
  expect(created.books, 'collection of a brand new user').toEqual([]);

  await test.step(`log in as ${credentials.userName}`, async () => {
    const response = await accountApi.generateToken(credentials);
    const session = await expectJson<TokenViewModel>(response, 200, 'login response');

    expect(session.status, 'login result').toBe('Success');
    expect(session.token, 'issued token').not.toHaveLength(0);
  });
});

test('registration with an already taken name is rejected', async ({
  accountApi,
  registeredUser,
}) => {
  const response = await test.step(`try to create user ${registeredUser.userName} again`, () =>
    accountApi.createUser(registeredUser));

  await expect(response, 'duplicate registration response').toBeApiError(USER_EXISTS);
});
