import { serve } from '@hono/node-server';
import { createDb } from './lib/db.js';
import { startIndexer } from './indexer.js';
import { backfillLikes } from './backfill.js';
import { createServer } from './server.js';

// Load configuration from environment
const {
  BSKY_IDENTIFIER,
  FEED_HOSTNAME = 'localhost',
  FEED_RKEY = 'my-cool-feed',
  FEED_KEYWORD = '#VTuber',
  TARGET_DIDS = '',
  PORT = '3000',
} = process.env;

if (!BSKY_IDENTIFIER) {
  console.error('Missing BSKY_IDENTIFIER in environment');
  process.exit(1);
}

const publisherDid = BSKY_IDENTIFIER;

// Parse target DIDs for like-based indexing (comma-separated)
const targetDids = TARGET_DIDS.split(',')
  .map((d) => d.trim())
  .filter(Boolean);

// Initialize SQLite database for indexing posts
const db = createDb('feed.db');

// Backfill existing likes from target DIDs (if configured)
if (targetDids.length > 0) {
  console.log(`Backfilling likes from ${targetDids.length} target DIDs...`);
  await backfillLikes(db, targetDids);
}

// Start the Jetstream indexer — subscribes to real-time events
// Indexes both keyword-matching posts AND posts liked by target DIDs
startIndexer(db, FEED_KEYWORD, targetDids).catch(console.error);

// Start the HTTP server with feed generator endpoints
const app = createServer(db, publisherDid, FEED_HOSTNAME, FEED_RKEY);

serve({ fetch: app.fetch, port: Number(PORT) }, (info) => {
  console.log(`Feed generator server running on http://localhost:${info.port}`);
  console.log(`Try: http://localhost:${info.port}/xrpc/app.bsky.feed.getFeedSkeleton`);
});
