import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(String(password), salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password, stored) {
  if (!stored || typeof stored !== 'string') return false;

  if (!stored.startsWith('scrypt$')) {
    return stored === password;
  }

  const [, salt, hash] = stored.split('$');
  if (!salt || !hash) return false;

  const actual = scryptSync(String(password), salt, 64);
  const expected = Buffer.from(hash, 'hex');
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}
