import { test, expect } from '@fixtures/api.fixture';
import { USER_EXISTS } from '@api-clients/api-errors';
import { expectApiError } from '@asserts/api-response.assert';
import { createCredentials } from '@test-data/user';

test('a new user is created with an empty collection and can log in', async ({ accountSteps }) => {
  const credentials = createCredentials();

  const created = await accountSteps.createUser(credentials);
  expect(created.username, 'name of the created user').toBe(credentials.userName);
  expect(created.books, 'collection of a brand new user').toEqual([]);

  const session = await accountSteps.logIn(credentials);
  expect(session.status, 'login result').toBe('Success');
});

test('registration with an already taken name is rejected', async ({
  accountSteps,
  registeredUser,
}) => {
  const response = await accountSteps.attemptCreateUser(registeredUser);

  await expectApiError(response, USER_EXISTS);
});
