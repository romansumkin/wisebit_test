import { faker } from '@faker-js/faker';

export class BookCatalog {
  constructor(private readonly isbns: readonly string[]) {}

  randomIsbn(): string {
    return faker.helpers.arrayElement(this.isbns);
  }

  randomIsbns(count: number): string[] {
    if (count > this.isbns.length) {
      throw new Error(`cannot pick ${count} distinct isbns out of ${this.isbns.length}`);
    }

    return faker.helpers.arrayElements(this.isbns, count);
  }
}
