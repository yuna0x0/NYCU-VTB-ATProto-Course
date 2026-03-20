import type { Client } from '@atcute/client';
import type {} from '@atcute/bluesky';

// Import generated lexicon types — augments the XRPC type registry
import type {} from './lexicons/types/com/example/nekosky/feed/getTimeline.js';

// Fetch the user's home timeline
// Uses Bluesky's getTimeline API (our custom lexicon defines the schema,
// but we read from Bluesky's actual feed endpoint)
export async function loadTimeline(rpc: Client, cursor?: string) {
  const result = await rpc.get('app.bsky.feed.getTimeline', {
    params: { limit: 20, cursor },
  });
  if (!result.ok) return null;
  return result.data;
}

// Render a single post as HTML
export function renderPost(item: any): string {
  const post = item.post;
  const author = post.author;
  const record = post.record as { text?: string; createdAt?: string };
  const time = record.createdAt ? new Date(record.createdAt).toLocaleString('zh-TW') : '';

  return `
    <div class="post-card">
      <div class="post-header">
        <img src="${author.avatar || ''}" alt="" />
        <div class="post-author">
          <div class="name">${escapeHtml(author.displayName || author.handle)}</div>
          <div class="handle">@${escapeHtml(author.handle)}</div>
        </div>
      </div>
      <div class="post-text">${escapeHtml(record.text || '')}</div>
      <div class="post-time">${time}</div>
    </div>
  `;
}

// Escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
