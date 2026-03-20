import type { Client } from '@atcute/client';
import type { Did } from '@atcute/lexicons';
import type {} from '@atcute/atproto';

// Import generated lexicon types — this augments the XRPC type registry
// so atcute knows about our custom com.example.nekosky.* types
import type {} from './lexicons/types/com/example/nekosky/feed/post.js';

// Create a new post using our custom Nekosky lexicon
export async function createPost(rpc: Client, did: Did, text: string) {
  await rpc.post('com.atproto.repo.createRecord', {
    input: {
      repo: did,
      collection: 'com.example.nekosky.feed.post',
      record: {
        $type: 'com.example.nekosky.feed.post',
        text,
        createdAt: new Date().toISOString(),
      },
    },
  });
}
