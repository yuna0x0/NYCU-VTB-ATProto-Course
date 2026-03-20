import { generateText } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import type { Client } from '@atcute/client';
import type { Did } from '@atcute/lexicons';
import type {} from '@atcute/atproto';
import type {} from '@atcute/bluesky';

// OpenAI-compatible provider — works with OpenRouter, OpenAI, local servers, etc.
// Configure via AI_BASE_URL and AI_API_KEY env vars
const provider = createOpenAICompatible({
  name: 'ai-provider',
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL || 'https://openrouter.ai/api/v1',
});

// Generate a reply using Vercel AI SDK
export async function generateReply(text: string): Promise<string> {
  const result = await generateText({
    model: provider(process.env.AI_MODEL || 'google/gemini-3-flash-preview'),
    system:
      'You are a friendly bot on Bluesky. Reply concisely in the same language as the user. Keep it under 280 characters.',
    prompt: text,
  });

  return result.text;
}

// Create a reply post on Bluesky
// Reply threading requires both `parent` (direct reply target) and `root` (thread start)
export async function replyToPost(
  rpc: Client,
  did: Did,
  text: string,
  parent: { uri: string; cid: string },
  root: { uri: string; cid: string },
) {
  await rpc.post('com.atproto.repo.createRecord', {
    input: {
      repo: did,
      collection: 'app.bsky.feed.post',
      record: {
        $type: 'app.bsky.feed.post',
        text,
        reply: {
          parent: { uri: parent.uri, cid: parent.cid },
          root: { uri: root.uri, cid: root.cid },
        },
        createdAt: new Date().toISOString(),
      },
    },
  });

  console.log(`Replied to ${parent.uri}`);
}
