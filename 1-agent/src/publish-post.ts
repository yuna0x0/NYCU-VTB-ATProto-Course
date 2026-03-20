import type {} from '@atcute/atproto';
import type {} from '@atcute/bluesky';
import { createClient } from './lib/client.js';

// A simple script to publish a single post to Bluesky
// Usage: BSKY_IDENTIFIER=... BSKY_PASSWORD=... tsx src/publish-post.ts "Hello world!"

const {
  BSKY_SERVICE = 'https://bsky.social',
  BSKY_IDENTIFIER,
  BSKY_PASSWORD,
} = process.env;

if (!BSKY_IDENTIFIER || !BSKY_PASSWORD) {
  console.error('Missing BSKY_IDENTIFIER or BSKY_PASSWORD in environment');
  process.exit(1);
}

const text = process.argv[2];
if (!text) {
  console.error('Usage: tsx src/publish-post.ts "Your post text here"');
  process.exit(1);
}

const { rpc, session } = await createClient(
  BSKY_SERVICE,
  BSKY_IDENTIFIER,
  BSKY_PASSWORD,
);

// Create a new post using the XRPC API
const result = await rpc.post('com.atproto.repo.createRecord', {
  input: {
    repo: session.did,
    collection: 'app.bsky.feed.post',
    record: {
      $type: 'app.bsky.feed.post',
      text,
      createdAt: new Date().toISOString(),
    },
  },
});

if (result.ok) {
  console.log(`Post published: ${result.data.uri}`);
}
