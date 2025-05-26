import pool from './db_config';

export async function insertTable(
  tableName: string,
  data: Record<string, any>
): Promise<any[] | null> {
  if (!tableName || typeof data !== 'object' || Object.keys(data).length === 0) {
    throw new Error('Invalid table name or data');
  }

  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

  const query = `
    INSERT INTO ${tableName} (${columns.join(', ')})
    VALUES (${placeholders})
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, values);
    console.log('Insert successful');
    return result.rows;
  } catch (err) {
    console.error('Error inserting data:', err);
    return null;
  }
}
