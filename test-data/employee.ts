import { randomItem, randomNumber, randomString } from './random';

export type Employee = {
  readonly firstName: string;
  readonly lastName: string;
  readonly age: string;
  readonly email: string;
  readonly salary: string;
  readonly department: string;
};

const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
const DEPARTMENTS = ['QA', 'Engineering', 'Insurance', 'Legal', 'Compliance'];

function randomName(): string {
  const name = randomString(LETTERS, randomNumber(4, 8));

  return name[0].toUpperCase() + name.slice(1);
}

export function createEmployee(overrides: Partial<Employee> = {}): Employee {
  const firstName = randomName();
  const lastName = randomName();

  return {
    firstName,
    lastName,
    age: String(randomNumber(21, 64)),
    email: `${firstName}.${lastName}.${randomNumber(1000, 9999)}@example.com`.toLowerCase(),
    salary: String(randomNumber(1_000, 99_999)),
    department: randomItem(DEPARTMENTS),
    ...overrides,
  };
}
