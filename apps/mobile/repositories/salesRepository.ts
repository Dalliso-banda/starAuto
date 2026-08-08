import * as Crypto from 'expo-crypto';
import { db } from '../db/database';

export type Sale = {
  id: string;
  part_id: string;
  quantity_sold: number;
  sale_price: number;
  sold_at: string;
};

export async function recordSale(input: {
  partId: string;
  quantitySold: number;
  salePrice: number;
}): Promise<void> {
  const part = await db.getFirstAsync<{ quantity: number }>(
    'SELECT quantity FROM parts WHERE id = ?',
    [input.partId]
  );

  if (!part) throw new Error('Part not found.');
  if (input.quantitySold <= 0) throw new Error('Quantity sold must be greater than zero.');
  if (input.quantitySold > part.quantity) throw new Error('Not enough stock for that sale.');

  const id = Crypto.randomUUID();

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      'INSERT INTO sales (id, part_id, quantity_sold, sale_price) VALUES (?, ?, ?, ?)',
      [id, input.partId, input.quantitySold, input.salePrice]
    );
    await db.runAsync(
      'UPDATE parts SET quantity = quantity - ? WHERE id = ?',
      [input.quantitySold, input.partId]
    );
  });
}

export async function getSalesForPart(partId: string): Promise<Sale[]> {
  return db.getAllAsync<Sale>(
    'SELECT * FROM sales WHERE part_id = ? ORDER BY sold_at DESC',
    [partId]
  );
}

export async function getAllSales(): Promise<Sale[]> {
  return db.getAllAsync<Sale>('SELECT * FROM sales ORDER BY sold_at DESC');
}

export async function getTotalRevenue(): Promise<number> {
  const row = await db.getFirstAsync<{ total: number }>(
    'SELECT SUM(quantity_sold * sale_price) as total FROM sales'
  );
  return row?.total ?? 0;
}
