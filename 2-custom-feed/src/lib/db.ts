import { DatabaseSync } from 'node:sqlite';

// Create a SQLite database with a simple posts table for indexing
// Uses Node.js built-in SQLite (v22.5+) — no external dependencies needed
export function createDb(path: string) {
  const db = new DatabaseSync(path);

  // Enable WAL mode for better concurrent read/write performance
  db.exec('PRAGMA journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      uri TEXT PRIMARY KEY,
      cid TEXT NOT NULL,
      indexed_at INTEGER NOT NULL
    )
  `);

  return db;
}

// Query posts for the feed, with cursor-based pagination
// Cursor is the indexed_at timestamp of the last returned post
export function queryPosts(
  db: DatabaseSync,
  limit: number,
  cursor?: string,
) {
  if (cursor) {
    const stmt = db.prepare(
      'SELECT uri, indexed_at FROM posts WHERE indexed_at < ? ORDER BY indexed_at DESC LIMIT ?',
    );
    return stmt.all(Number(cursor), limit) as { uri: string; indexed_at: number }[];
  }

  const stmt = db.prepare(
    'SELECT uri, indexed_at FROM posts ORDER BY indexed_at DESC LIMIT ?',
  );
  return stmt.all(limit) as { uri: string; indexed_at: number }[];
}
