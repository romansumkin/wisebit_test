import { randomUUID } from 'node:crypto';

export type Credentials = {
  userName: string;
  password: string;
};

export function createCredentials(): Credentials {
  return {
    userName: `pw-${randomUUID()}`,
    password: 'Wisebit!42aA',
  };
}
