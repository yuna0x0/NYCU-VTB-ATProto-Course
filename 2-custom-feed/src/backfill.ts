import type { DatabaseSync } from 'node:sqlite';
import { Client, simpleFetchHandler } from '@atcute/client';
import type { Did } from '@atcute/lexicons';
import type {} from '@atcute/bluesky';

// Backfill: fetch existing likes from target DIDs and populate the feed DB
// This runs once at startup so the feed has content before Jetstream catches up
export async function backfillLikes(db: DatabaseSync, targetDids: string[]) {
  const insertStmt = db.prepare(
    'INSERT OR IGNORE INTO posts (uri, cid, indexed_at) VALUES (?, ?, ?)',
  );

  // Use public API (no auth needed for reading public likes)
  const rpc = new Client({
    handler: simpleFetchHandler({ service: 'https://public.api.bsky.app' }),
  });

  for (const did of targetDids) {
    console.log(`Backfilling likes from ${did}...`);

    try {
      let cursor: string | undefined;
      let total = 0;

      // Paginate through the user's likes
      do {
        const result = await rpc.get('app.bsky.feed.getActorLikes', {
          params: { actor: did as Did, limit: 100, cursor },
        });
        if (!result.ok) break;

        for (const item of result.data.feed) {
          insertStmt.run(item.post.uri, item.post.cid, Date.now());
          total++;
        }

        cursor = result.data.cursor;
      } while (cursor);

      console.log(`  → Backfilled ${total} liked posts from ${did}`);
    } catch (err) {
      console.error(`  → Failed to backfill ${did}:`, err);
    }
  }

  console.log('Backfill complete!');
}
