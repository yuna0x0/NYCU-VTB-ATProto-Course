import { JetstreamSubscription } from '@atcute/jetstream';
import { createClient } from './lib/client.js';
import { generateReply, replyToPost } from './bot.js';

// Load environment variables
// OPENROUTER_API_KEY is read by the AI SDK provider
const {
  BSKY_SERVICE = 'https://bsky.social',
  BSKY_IDENTIFIER,
  BSKY_PASSWORD,
} = process.env;

if (!BSKY_IDENTIFIER || !BSKY_PASSWORD) {
  console.error('Missing BSKY_IDENTIFIER or BSKY_PASSWORD in environment');
  process.exit(1);
}

// Initialize Bluesky client
const { rpc, session } = await createClient(
  BSKY_SERVICE,
  BSKY_IDENTIFIER,
  BSKY_PASSWORD,
);

console.log(`Bot is listening for mentions of @${session.handle}...`);

// Subscribe to Jetstream using @atcute/jetstream
// Auto-reconnects and provides typed events
const jetstream = new JetstreamSubscription({
  url: 'wss://jetstream1.us-east.bsky.network/subscribe',
  wantedCollections: ['app.bsky.feed.post'],
});

// Process events using async iterator
for await (const event of jetstream) {
  // Only process new post creations
  if (event.kind !== 'commit') continue;
  if (event.commit.operation !== 'create') continue;
  if (event.commit.collection !== 'app.bsky.feed.post') continue;

  const record = event.commit.record as {
    text?: string;
    reply?: {
      parent: { uri: string; cid: string };
      root: { uri: string; cid: string };
    };
  };
  if (!record?.text) continue;

  // Check if the post mentions our bot handle
  // A simple text check — production bots should parse facets for mentions
  if (!record.text.includes(`@${session.handle}`)) continue;

  console.log(`Mention from ${event.did}: ${record.text}`);

  try {
    // Generate AI reply using Vercel AI SDK
    const replyText = await generateReply(record.text);
    if (!replyText) continue;

    // Build the reply reference
    // The post we're replying to is the parent
    const parentUri = `at://${event.did}/app.bsky.feed.post/${event.commit.rkey}`;
    const parentCid = event.commit.cid;

    // If the mention is already a reply, use its root; otherwise, it IS the root
    const root = record.reply?.root ?? { uri: parentUri, cid: parentCid };
    const parent = { uri: parentUri, cid: parentCid };

    await replyToPost(rpc, session.did, replyText, parent, root);
  } catch (err) {
    console.error('Failed to reply:', err);
  }
}
