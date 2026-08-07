import * as Crypto from 'expo-crypto';
import { db } from '../db/database';

export type Part = {
  id: string;
  name: string;
  car_make_model: string | null;
  photo_uri: string | null;
  quantity: number;
  price: number;
  created_at: string;
};

export async function createPart(input: {
  name: string;
  carModel: string;
  photoUri: string | null;
  quantity: number;
  price: number;
}): Promise<Part> {
  const id = Crypto.randomUUID();

  await db.runAsync(
    'INSERT INTO parts (id, name, car_make_model, photo_uri, quantity, price) VALUES (?, ?, ?, ?, ?, ?)',
    [id, input.name, input.carModel, input.photoUri, input.quantity, input.price]
  );

  return {
    id,
    name: input.name,
    car_make_model: input.carModel,
    photo_uri: input.photoUri,
    quantity: input.quantity,
    price: input.price,
    created_at: new Date().toISOString(),
  };
}

export async function getAllParts(): Promise<Part[]> {
  return db.getAllAsync<Part>('SELECT * FROM parts ORDER BY created_at DESC');
}

export async function getPartById(id: string): Promise<Part | null> {
  const row = await db.getFirstAsync<Part>('SELECT * FROM parts WHERE id = ?', [id]);
  return row ?? null;
}
