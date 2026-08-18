import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { AddBooksPayload, DeleteBookPayload } from './types';
import { bearer, CLEANUP_TIMEOUT } from './http';

const BASE = '/BookStore/v1';

export class BookStoreApi {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async listBooks(): Promise<APIResponse> {
    return this.request.get(`${BASE}/Books`);
  }

  async addBooks(payload: AddBooksPayload, token?: string): Promise<APIResponse> {
    return this.request.post(`${BASE}/Books`, {
      headers: token ? bearer(token) : undefined,
      data: {
        userId: payload.userId,
        collectionOfIsbns: payload.isbns.map((isbn) => ({ isbn })),
      },
    });
  }

  async deleteBook(payload: DeleteBookPayload, token: string): Promise<APIResponse> {
    return this.request.delete(`${BASE}/Book`, {
      headers: bearer(token),
      data: payload,
    });
  }

  async deleteAllBooks(userId: string, token: string): Promise<APIResponse> {
    return this.request.delete(`${BASE}/Books`, {
      params: { UserId: userId },
      headers: bearer(token),
      timeout: CLEANUP_TIMEOUT,
    });
  }
}
