import type { DatabaseSync } from 'node:sqlite';
import { JetstreamSubscription } from '@atcute/jetstream';

// Subscribe to Jetstream and index posts matching our filters
// Supports two modes:
//   1. Keyword filter: index posts containing a keyword
//   2. Like aggregation: index posts liked by specific DIDs
export async function startIndexer(
  db: DatabaseSync,
  keyword: string,
  targetDids: string[],
) {
  const insertStmt = db.prepare(
    'INSERT OR IGNORE INTO posts (uri, cid, indexed_at) VALUES (?, ?, ?)',
  );
  const deleteStmt = db.prepare('DELETE FROM posts WHERE uri = ?');

  const targetDidSet = new Set(targetDids);
  const hasTargetDids = targetDidSet.size > 0;

  console.log(`Indexing posts containing "${keyword}"...`);
  if (hasTargetDids) {
    console.log(`Also indexing posts liked by ${targetDidSet.size} target DIDs`);
  }

  const wantedCollections = ['app.bsky.feed.post'];
  if (hasTargetDids) {
    wantedCollections.push('app.bsky.feed.like');
  }

  const jetstream = new JetstreamSubscription({
    url: 'wss://jetstream1.us-east.bsky.network/subscribe',
    wantedCollections,
  });

  for await (const event of jetstream) {
    if (event.kind !== 'commit') continue;
    const { operation, collection, rkey } = event.commit;

    // --- Keyword-based post indexing ---
    if (collection === 'app.bsky.feed.post') {
      const uri = `at://${event.did}/app.bsky.feed.post/${rkey}`;

      if (operation === 'create') {
        const text = (event.commit.record as { text?: string }).text ?? '';
        if (text.toLowerCase().includes(keyword.toLowerCase())) {
          insertStmt.run(uri, event.commit.cid, Date.now());
          console.log(`Indexed post: ${text.slice(0, 60)}...`);
        }
      }

      if (operation === 'delete') {
        deleteStmt.run(uri);
      }
    }

    // --- Like-based indexing (from target DIDs) ---
    // Jetstream like event structure:
    //   event.commit.record = { subject: { uri, cid }, createdAt }
    //   event.did = the DID of the person who liked
    if (collection === 'app.bsky.feed.like' && hasTargetDids) {
      if (operation === 'create' && targetDidSet.has(event.did)) {
        const record = event.commit.record as {
          subject?: { uri: string; cid: string };
        };
        if (record.subject) {
          insertStmt.run(record.subject.uri, record.subject.cid, Date.now());
          console.log(`Indexed liked post from ${event.did}: ${record.subject.uri}`);
        }
      }
    }
  }
}
