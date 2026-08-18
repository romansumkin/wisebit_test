import { test, expect, type APIResponse } from '@playwright/test';
import type { BookStoreApi } from '@api-clients/book-store.api';
import type { BookList } from '@api-clients/types';
import { expectJson, expectNoContent, expectStatus } from '@asserts/api-response.assert';
import type { RegisteredUser } from '@test-data/user';

export class BookStoreSteps {
  constructor(private readonly bookStoreApi: BookStoreApi) {}

  async catalogIsbns(): Promise<string[]> {
    return test.step('read the book catalog', async () => {
      const response = await this.bookStoreApi.listBooks();
      const { books } = await expectJson<BookList>(response, 200);

      expect(books.length, 'books in the catalog').toBeGreaterThan(1);

      return books.map((book) => book.isbn);
    });
  }

  async addBook(user: RegisteredUser, isbn: string): Promise<void> {
    await test.step(`add book ${isbn} to the collection of ${user.userName}`, async () => {
      const response = await this.bookStoreApi.addBooks(
        { userId: user.userId, isbns: [isbn] },
        user.token,
      );

      await expectStatus(response, 201);
    });
  }

  async attemptAddBookWithoutToken(user: RegisteredUser, isbn: string): Promise<APIResponse> {
    return test.step(`try to add book ${isbn} with no Authorization header`, () =>
      this.bookStoreApi.addBooks({ userId: user.userId, isbns: [isbn] }));
  }

  async deleteBook(user: RegisteredUser, isbn: string): Promise<void> {
    await test.step(`delete book ${isbn} from the collection of ${user.userName}`, async () => {
      const response = await this.bookStoreApi.deleteBook({ userId: user.userId, isbn }, user.token);

      await expectNoContent(response);
    });
  }

  async attemptDeleteBook(user: RegisteredUser, isbn: string): Promise<APIResponse> {
    return test.step(`try to delete book ${isbn} from the collection of ${user.userName}`, () =>
      this.bookStoreApi.deleteBook({ userId: user.userId, isbn }, user.token));
  }
}
