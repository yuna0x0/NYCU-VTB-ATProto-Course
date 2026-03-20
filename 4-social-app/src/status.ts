import type { Client } from '@atcute/client';
import type { Did } from '@atcute/lexicons';
import type {} from '@atcute/atproto';

// ============================================================
// ASSIGNMENT: Implement personal status
//
// The status is a SINGLETON record (key: "self") — there's only
// one status per user. Use putRecord to create/update (upsert).
//
// Collection: com.example.nekosky.actor.status
// Key: "self" (always — this makes it a singleton)
//
// Operations:
//   - com.atproto.repo.putRecord    → create or update (upsert)
//   - com.atproto.repo.getRecord    → read a specific record
//   - com.atproto.repo.deleteRecord → delete a record
// ============================================================

export interface Status {
  text: string;
  emoji?: string;
  createdAt: string;
}

// Set or update your personal status
// Hint: use putRecord (not createRecord!) because the key is always "self"
// putRecord will create the record if it doesn't exist, or update it if it does
export async function setStatus(
  rpc: Client,
  did: Did,
  text: string,
  emoji?: string,
): Promise<void> {
  // TODO: Use rpc.post('com.atproto.repo.putRecord', { input: { ... } })
  // Record: { $type: 'com.example.nekosky.actor.status', text, emoji, createdAt }
  // Key (rkey): 'self'
  throw new Error('Not implemented — implement setStatus!');
}

// Get a user's status (can be anyone's — public data!)
// Hint: use getRecord and handle the case where no status exists
export async function getStatus(
  rpc: Client,
  did: Did,
): Promise<Status | null> {
  // TODO: Use rpc.get('com.atproto.repo.getRecord', { params: { ... } })
  // Collection: 'com.example.nekosky.actor.status', rkey: 'self'
  // Return null if the record doesn't exist (catch the error)
  throw new Error('Not implemented — implement getStatus!');
}

// Clear your personal status
export async function clearStatus(
  rpc: Client,
  did: Did,
): Promise<void> {
  // TODO: Use rpc.post('com.atproto.repo.deleteRecord', { input: { ... } })
  // Collection: 'com.example.nekosky.actor.status', rkey: 'self'
  throw new Error('Not implemented — implement clearStatus!');
}
