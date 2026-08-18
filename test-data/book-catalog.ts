import { randomItem, randomItems } from './random';

export class BookCatalog {
  constructor(private readonly isbns: readonly string[]) {}

  randomIsbn(): string {
    return randomItem(this.isbns);
  }

  randomIsbns(count: number): string[] {
    return randomItems(this.isbns, count);
  }
}
