import { faker } from '@faker-js/faker';
import type { Credentials } from '@api-clients/types';

export type RegisteredUser = Credentials & {
  readonly userId: string;
  readonly token: string;
};

export type TrackedUser = Credentials & {
  readonly userId: string;
};

export function createCredentials(): Credentials {
  return {
    userName: `pw-${faker.string.uuid()}`,
    password: `Aa1!${faker.internet.password({ length: 12 })}`,
  };
}
