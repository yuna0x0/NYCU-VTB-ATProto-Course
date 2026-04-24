import type { Client } from '@atcute/client';
import type { Did } from '@atcute/lexicons';
import type {} from '@atcute/atproto';

// NSIDs for our custom Lexicons.
export const PROFILE_NSID = 'com.example.linkinbio.profile';
export const LINK_NSID = 'com.example.linkinbio.link';

// Shape of our profile record (mirrors lexicons/com/example/linkinbio/profile.json).
export interface Theme {
  accent?: string;
  mode?: 'dark' | 'light';
}
export interface Profile {
  displayName?: string;
  description?: string;
  theme?: Theme;
  createdAt: string;
  updatedAt?: string;
}
export interface LinkRecord {
  uri: string;
  rkey: string;
  url: string;
  title: string;
  emoji?: string;
  order?: number;
  createdAt: string;
}

// Load the user's profile (singleton record at rkey "self").
// Returns null if the record does not yet exist.
export async function getProfile(rpc: Client, did: Did): Promise<Profile | null> {
  const result = await rpc.get('com.atproto.repo.getRecord', {
    params: { repo: did, collection: PROFILE_NSID, rkey: 'self' },
  });
  if (!result.ok) return null;
  return result.data.value as unknown as Profile;
}

// Upsert the profile via putRecord (rkey is always "self" — singleton).
// createdAt is preserved if the record already exists.
export async function putProfile(
  rpc: Client,
  did: Did,
  data: { displayName?: string; description?: string; theme?: Theme },
): Promise<void> {
  const existing = await getProfile(rpc, did);
  const now = new Date().toISOString();
  const record = {
    $type: PROFILE_NSID,
    displayName: data.displayName,
    description: data.description,
    theme: data.theme,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  const result = await rpc.post('com.atproto.repo.putRecord', {
    input: { repo: did, collection: PROFILE_NSID, rkey: 'self', record },
  });
  if (!result.ok) throw new Error(`putProfile failed: ${JSON.stringify(result.data)}`);
}

// List all link records in the user's repo, sorted by `order` (fall back to createdAt).
export async function listLinks(rpc: Client, did: Did): Promise<LinkRecord[]> {
  const result = await rpc.get('com.atproto.repo.listRecords', {
    params: { repo: did, collection: LINK_NSID, limit: 100 },
  });
  if (!result.ok) return [];
  const records = result.data.records as Array<{ uri: string; value: unknown }>;
  return records
    .map((r) => {
      const v = r.value as {
        url: string;
        title: string;
        emoji?: string;
        order?: number;
        createdAt: string;
      };
      return {
        uri: r.uri,
        rkey: r.uri.split('/').pop()!,
        url: v.url,
        title: v.title,
        emoji: v.emoji,
        order: v.order,
        createdAt: v.createdAt,
      };
    })
    .sort((a, b) => {
      if (a.order != null && b.order != null) return a.order - b.order;
      if (a.order != null) return -1;
      if (b.order != null) return 1;
      return a.createdAt.localeCompare(b.createdAt);
    });
}

// Create a new link record via createRecord (server-assigned tid rkey).
export async function addLink(
  rpc: Client,
  did: Did,
  data: { url: string; title: string; emoji?: string; order?: number },
): Promise<{ uri: string; cid: string }> {
  const record = {
    $type: LINK_NSID,
    url: data.url,
    title: data.title,
    emoji: data.emoji,
    order: data.order,
    createdAt: new Date().toISOString(),
  };
  const result = await rpc.post('com.atproto.repo.createRecord', {
    input: { repo: did, collection: LINK_NSID, record },
  });
  if (!result.ok) throw new Error(`addLink failed: ${JSON.stringify(result.data)}`);
  return { uri: result.data.uri, cid: result.data.cid };
}

// Delete a link record by rkey.
export async function deleteLink(rpc: Client, did: Did, rkey: string): Promise<void> {
  const result = await rpc.post('com.atproto.repo.deleteRecord', {
    input: { repo: did, collection: LINK_NSID, rkey },
  });
  if (!result.ok) throw new Error(`deleteLink failed: ${JSON.stringify(result.data)}`);
}

// Build a PDSls URL that points at a specific record in the user's repo.
// Handy for "View on PDSls" debug links in the UI.
export function pdslsUrl(did: Did, collection: string, rkey: string): string {
  return `https://pdsls.dev/at://${did}/${collection}/${rkey}`;
}
