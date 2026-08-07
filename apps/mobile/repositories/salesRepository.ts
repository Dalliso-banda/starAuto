import * as Crypto from 'expo-crypto';
import { db } from '../db/database';
import { getPartById, adjustPartQuantity } from './partsRepository';

export type Sale = {
  id: string;
  part_id: string;
  quantity_sold: number;
  sale_price: number | null;
  sold_at: string;
  sale_note?: string | null;
};

export async function recordSale(input: {
  partId: string;
  quantitySold: number;
  salePrice?: number | null;
  soldAt?: string; // ISO
  note?: string | null;
}): Promise<Sale> {
  const part = await getPartById(input.partId);
  if (!part) throw new Error('Part not found');
  if (input.quantitySold <= 0) throw new Error('Quantity must be greater than zero');
  if (part.quantity < input.quantitySold) throw new Error('Not enough stock');

  const id = Crypto.randomUUID();
  const soldAt = input.soldAt ?? new Date().toISOString();

  await db.runAsync(
    'INSERT INTO sales (id, part_id, quantity_sold, sale_price, sold_at, sale_note) VALUES (?, ?, ?, ?, ?, ?)',
    [id, input.partId, input.quantitySold, input.salePrice ?? null, soldAt, input.note ?? '']
  );

  // reduce part quantity
  await adjustPartQuantity(input.partId, -Math.abs(input.quantitySold));

  return {
    id,
    part_id: input.partId,
    quantity_sold: input.quantitySold,
    sale_price: input.salePrice ?? null,
    sold_at: soldAt,
    sale_note: input.note ?? null,
  };
}

export async function getSales(): Promise<Sale[]> {
  return db.getAllAsync<Sale>('SELECT * FROM sales ORDER BY sold_at DESC');
}
