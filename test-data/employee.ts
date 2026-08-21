import { faker } from '@faker-js/faker';

export type Employee = {
  readonly firstName: string;
  readonly lastName: string;
  readonly age: string;
  readonly email: string;
  readonly salary: string;
  readonly department: string;
};

const DEPARTMENTS = ['QA', 'Engineering', 'Insurance', 'Legal', 'Compliance'];

export function createEmployee(overrides: Partial<Employee> = {}): Employee {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    firstName,
    lastName,
    age: String(faker.number.int({ min: 21, max: 64 })),
    email: faker.internet
      .email({ firstName, lastName, provider: 'example.com', allowSpecialCharacters: false })
      .toLowerCase(),
    salary: String(faker.number.int({ min: 1_000, max: 99_999 })),
    department: faker.helpers.arrayElement(DEPARTMENTS),
    ...overrides,
  };
}
