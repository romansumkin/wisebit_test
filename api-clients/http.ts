export const CLEANUP_TIMEOUT = 10_000;

export function bearer(token: string) {
  return { Authorization: `Bearer ${token}` };
}
