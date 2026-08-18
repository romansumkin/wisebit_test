import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { Credentials } from '@test-data/user';
import { bearer, CLEANUP_TIMEOUT } from './http';

const BASE = '/Account/v1';

export class AccountApi {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createUser(credentials: Credentials): Promise<APIResponse> {
    return this.request.post(`${BASE}/User`, { data: credentials });
  }

  async generateToken(credentials: Credentials): Promise<APIResponse> {
    return this.request.post(`${BASE}/GenerateToken`, { data: credentials });
  }

  async getUser(userId: string, token: string): Promise<APIResponse> {
    return this.request.get(`${BASE}/User/${userId}`, { headers: bearer(token) });
  }

  async deleteUser(userId: string, token: string): Promise<APIResponse> {
    return this.request.delete(`${BASE}/User/${userId}`, {
      headers: bearer(token),
      timeout: CLEANUP_TIMEOUT,
    });
  }
}
