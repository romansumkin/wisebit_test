import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { Credentials } from './types';
import { bearer, CLEANUP_TIMEOUT } from './http';

const BASE = '/Account/v1';

export class AccountApi {
  constructor(private readonly request: APIRequestContext) {}

  async createUser(credentials: Credentials): Promise<APIResponse> {
    return this.request.post(`${BASE}/User`, { data: this.credentialsBody(credentials) });
  }

  async generateToken(credentials: Credentials): Promise<APIResponse> {
    return this.request.post(`${BASE}/GenerateToken`, { data: this.credentialsBody(credentials) });
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

  private credentialsBody(credentials: Credentials) {
    return { userName: credentials.userName, password: credentials.password };
  }
}
