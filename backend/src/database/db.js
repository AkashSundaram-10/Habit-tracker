import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../../habit-tracker.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let db = null;

// Initialize database
export async function initDatabase() {
  const SQL = await initSqlJs();

  try {
    // Try to load existing database
    if (fs.existsSync(DB_PATH)) {
      const buffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(buffer);
      console.log('Database loaded from file');
    } else {
      // Create new database
      db = new SQL.Database();

      // Read and execute schema
      const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
      db.exec(schema);

      // Save to file
      saveDatabase();
      console.log('Database created and initialized');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }

  return db;
}

// Save database to file
export function saveDatabase() {
  if (!db) return;

  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

// Get database instance
export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

// Execute query with parameters
export function query(sql, params = []) {
  const db = getDatabase();
  const stmt = db.prepare(sql);
  stmt.bind(params);

  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();

  saveDatabase(); // Auto-save after each query
  return results;
}

// Execute single query and return one result
export function queryOne(sql, params = []) {
  const results = query(sql, params);
  return results.length > 0 ? results[0] : null;
}

// Execute update/insert/delete
export function execute(sql, params = []) {
  const db = getDatabase();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  stmt.step();
  stmt.free();

  saveDatabase();
}

// Get last insert ID
export function getLastInsertId() {
  const result = queryOne('SELECT last_insert_rowid() as id');
  return result ? result.id : null;
}

export default {
  initDatabase,
  getDatabase,
  saveDatabase,
  query,
  queryOne,
  execute,
  getLastInsertId
};
