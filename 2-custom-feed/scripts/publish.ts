import { Client, CredentialManager } from '@atcute/client';
import type {} from '@atcute/atproto';
import type {} from '@atcute/bluesky';

// Publish the feed generator record to your PDS
// This makes your feed discoverable and subscribable in Bluesky
//
// Usage: copy .env.example to .env, fill in values, then run:
//   pnpm publish-feed

const {
  BSKY_SERVICE = 'https://bsky.social',
  BSKY_IDENTIFIER,
  BSKY_PASSWORD,
  FEED_HOSTNAME,
  FEED_RKEY = 'my-cool-feed',
  FEED_DISPLAY_NAME = 'My Cool Feed',
  FEED_DESCRIPTION = 'A custom feed',
} = process.env;

if (!BSKY_IDENTIFIER || !BSKY_PASSWORD || !FEED_HOSTNAME) {
  console.error(
    'Missing required env vars: BSKY_IDENTIFIER, BSKY_PASSWORD, FEED_HOSTNAME',
  );
  process.exit(1);
}

// Authenticate with Bluesky
const manager = new CredentialManager({ service: BSKY_SERVICE });
const session = await manager.login({
  identifier: BSKY_IDENTIFIER,
  password: BSKY_PASSWORD,
});
const rpc = new Client({ handler: manager });

console.log(`Logged in as ${session.handle} (${session.did})`);

// Create the feed generator record in your repository
// This tells Bluesky where to find your feed generator service
const result = await rpc.post('com.atproto.repo.putRecord', {
  input: {
    repo: session.did,
    collection: 'app.bsky.feed.generator',
    rkey: FEED_RKEY,
    record: {
      did: `did:web:${FEED_HOSTNAME}`,
      displayName: FEED_DISPLAY_NAME,
      description: FEED_DESCRIPTION,
      createdAt: new Date().toISOString(),
    },
  },
});

if (result.ok) {
  console.log(`Feed published: ${result.data.uri}`);
  console.log(
    `Users can now subscribe to your feed in Bluesky at:`,
  );
  console.log(
    `  https://bsky.app/profile/${session.handle}/feed/${FEED_RKEY}`,
  );
}
