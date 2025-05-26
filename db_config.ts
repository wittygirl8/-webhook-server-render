import pkg from 'pg';
import dotenv from 'dotenv';
import { emitSessionStatus } from './socketUtil';

dotenv.config();

const { Pool, Client } = pkg;

interface SessionStatusPayload {
  session_id: string;
  status: string;
  [key: string]: any; // Adjust based on your actual payload
}

// --- Database configuration ---
const config = {
  user: process.env.DB_USER as string,
  host: process.env.DB_HOST as string,
  database: process.env.DB_NAME as string,
  password: process.env.DB_PASSWORD as string,
  port: Number(process.env.DB_PORT),
  ssl: { rejectUnauthorized: false },
};

// --- Create Pool for general queries ---
const pool = new Pool(config);

// --- Handle pool events ---
pool.on('connect', () => {
  console.log('Connection pool established with the database');
});

pool.on('error', (err: Error) => {
  console.error('Connection pool error:', err);
});

// --- Create a dedicated client for LISTEN/NOTIFY ---
const listenerClient = new Client(config);

async function setupListener(): Promise<void> {
  try {
    await listenerClient.connect();
    console.log('Listener client connected to database');

    await listenerClient.query('LISTEN session_id_status_channel');

    listenerClient.on('notification', (msg) => {
      try {
        const payload = JSON.parse(msg.payload ?? '{}') as SessionStatusPayload;
        emitSessionStatus(payload);
      } catch (err) {
        console.error('Failed to parse payload:', err);
      }
    });

    listenerClient.on('error', (err: Error) => {
      console.error('Listener client error:', err);
    });
  } catch (err) {
    console.error('Failed to set up listener:', err);
  }
}

// Initialize listener
setupListener();

// Export pool for use in queries
export default pool;
