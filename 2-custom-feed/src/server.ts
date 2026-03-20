import { Hono } from 'hono';
import type { DatabaseSync } from 'node:sqlite';
import { queryPosts } from './lib/db.js';

// Create the HTTP server with the two required feed generator endpoints
// These are the XRPC endpoints that Bluesky calls to get your feed
export function createServer(
  db: DatabaseSync,
  publisherDid: string,
  feedHostname: string,
  feedRkey: string,
) {
  const app = new Hono();

  // Health check
  app.get('/', (c) => c.text('Feed generator is running!'));

  // Endpoint 1: Describe what feeds this generator provides
  // Bluesky calls this to discover available feeds
  app.get('/xrpc/app.bsky.feed.describeFeedGenerator', (c) => {
    return c.json({
      did: `did:web:${feedHostname}`,
      feeds: [
        {
          uri: `at://${publisherDid}/app.bsky.feed.generator/${feedRkey}`,
        },
      ],
    });
  });

  // Endpoint 2: Return post URIs matching our algorithm
  // This is the core endpoint — Bluesky calls it to populate the feed
  // You return post URIs, Bluesky hydrates them with full content
  app.get('/xrpc/app.bsky.feed.getFeedSkeleton', (c) => {
    const limit = Math.min(Number(c.req.query('limit') ?? 50), 100);
    const cursor = c.req.query('cursor') ?? undefined;

    const rows = queryPosts(db, limit, cursor);

    const feed = rows.map((r) => ({ post: r.uri }));

    // Cursor for pagination — use the last post's indexed_at timestamp
    const newCursor =
      rows.length > 0 ? String(rows[rows.length - 1].indexed_at) : undefined;

    return c.json({ cursor: newCursor, feed });
  });

  return app;
}
