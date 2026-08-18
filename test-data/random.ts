import { randomInt } from 'node:crypto';

export function randomNumber(min: number, max: number): number {
  return randomInt(min, max + 1);
}

export function randomItem<T>(items: readonly T[]): T {
  if (items.length === 0) {
    throw new Error('cannot pick a random item out of an empty list');
  }

  return items[randomInt(items.length)];
}

export function randomItems<T>(items: readonly T[], count: number): T[] {
  if (count > items.length) {
    throw new Error(`cannot pick ${count} distinct items out of ${items.length}`);
  }

  const pool = [...items];

  return Array.from({ length: count }, () => pool.splice(randomInt(pool.length), 1)[0]);
}

export function randomChar(alphabet: string): string {
  return alphabet[randomInt(alphabet.length)];
}

export function randomString(alphabet: string, length: number): string {
  return Array.from({ length }, () => randomChar(alphabet)).join('');
}

export function shuffle<T>(items: readonly T[]): T[] {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
