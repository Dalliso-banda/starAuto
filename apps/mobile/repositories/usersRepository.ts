import * as Crypto from 'expo-crypto';
import { db } from '../db/database';
import { hashPassword } from '../utils/hash';

export type User = {
  id: string;
  full_name: string;
  shop_name: string | null;
  email: string;
};

export async function createUser(input: {
  fullName: string;
  shopName: string;
  email: string;
  password: string;
}): Promise<User> {
  const id = Crypto.randomUUID();
  const passwordHash = await hashPassword(input.password);

  await db.runAsync(
    'INSERT INTO users (id, full_name, shop_name, email, password_hash) VALUES (?, ?, ?, ?, ?)',
    [id, input.fullName, input.shopName, input.email, passwordHash]
  );

  return { id, full_name: input.fullName, shop_name: input.shopName, email: input.email };
}

export async function findUserByCredentials(
  email: string,
  password: string
): Promise<User | null> {
  const passwordHash = await hashPassword(password);
  const row = await db.getFirstAsync<User>(
    'SELECT id, full_name, shop_name, email FROM users WHERE email = ? AND password_hash = ?',
    [email, passwordHash]
  );
  return row ?? null;
}

export async function emailExists(email: string): Promise<boolean> {
  const row = await db.getFirstAsync('SELECT id FROM users WHERE email = ?', [email]);
  return row !== null;
}
