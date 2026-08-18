import { test, expect } from '@fixtures/api.fixture';
import type { CreateUserResult, MessageModal, TokenViewModel } from '@api-clients/types';
import { createCredentials } from '@test-data/user';

test('a new user is created and can log in', async ({ accountApi, createdUsers }) => {
  const credentials = createCredentials();

  const userId = await test.step('register a user', async () => {
    const response = await accountApi.createUser(credentials);
    expect(response.status()).toBe(201);

    const body: CreateUserResult = await response.json();
    expect(body.username).toBe(credentials.userName);
    expect(body.books).toEqual([]);

    return body.userID;
  });

  await test.step('log in as the new user', async () => {
    const response = await accountApi.generateToken(credentials);
    expect(response.status()).toBe(200);

    const body: TokenViewModel = await response.json();
    expect(body.status).toBe('Success');

    createdUsers.push({ ...credentials, userId, token: body.token });
  });
});

test('registration with an already taken name is rejected', async ({ accountApi, user }) => {
  const response = await accountApi.createUser({
    userName: user.userName,
    password: user.password,
  });

  expect(response.status()).toBe(406);

  const body: MessageModal = await response.json();
  expect(body.code).toBe('1204');
  expect(body.message).toBe('User exists!');
});
