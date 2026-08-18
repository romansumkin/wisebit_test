import { randomUUID } from 'node:crypto';
import type { Credentials } from '@api-clients/types';
import { randomChar, randomString, shuffle } from './random';

export type RegisteredUser = Credentials & {
  readonly userId: string;
  readonly token: string;
};
 
export type TrackedUser = Credentials & {
  readonly userId: string;
};

const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const LOWER = 'abcdefghijkmnopqrstuvwxyz';
const DIGIT = '23456789';
const SPECIAL = '!@#$%^&*';
const PASSWORD_LENGTH = 12;

function createPassword(): string {
  const required = [randomChar(UPPER), randomChar(LOWER), randomChar(DIGIT), randomChar(SPECIAL)];
  const filler = randomString(UPPER + LOWER + DIGIT + SPECIAL, PASSWORD_LENGTH - required.length);

  return shuffle([...required, ...filler]).join('');
}

export function createCredentials(): Credentials {
  return {
    userName: `pw-${randomUUID()}`,
    password: createPassword(),
  };
}
