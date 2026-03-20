import type { Client } from '@atcute/client';
import type { Did } from '@atcute/lexicons';
import type {} from '@atcute/atproto';

// ============================================================
// ASSIGNMENT: Implement saved posts with folders
//
// Use these AT Protocol operations:
//   - com.atproto.repo.createRecord  → create a new record
//   - com.atproto.repo.listRecords   → list records in a collection
//   - com.atproto.repo.deleteRecord  → delete a record by rkey
//
// Collections:
//   - com.example.nekosky.saved.folder → folder records
//   - com.example.nekosky.saved.item   → saved post records
// ============================================================

// Create a new folder
// Hint: use rpc.post('com.atproto.repo.createRecord', { input: { ... } })
export async function createFolder(
  rpc: Client,
  did: Did,
  name: string,
): Promise<{ uri: string; cid: string }> {
  // TODO: Create a folder record in collection 'com.example.nekosky.saved.folder'
  // The record should have: { $type, name, createdAt }
  throw new Error('Not implemented — implement createFolder!');
}

// List all folders
// Hint: use rpc.get('com.atproto.repo.listRecords', { params: { ... } })
export async function listFolders(
  rpc: Client,
  did: Did,
): Promise<Array<{ uri: string; name: string }>> {
  // TODO: List all records in collection 'com.example.nekosky.saved.folder'
  // Return an array of { uri, name } from the records
  throw new Error('Not implemented — implement listFolders!');
}

// Save a post to a folder (or without folder)
// Hint: the record needs a 'subject' (strongRef) pointing to the post
export async function savePost(
  rpc: Client,
  did: Did,
  postUri: string,
  postCid: string,
  folderUri?: string,
): Promise<void> {
  // TODO: Create a record in collection 'com.example.nekosky.saved.item'
  // The record should have: { $type, subject: { uri, cid }, folder?, createdAt }
  throw new Error('Not implemented — implement savePost!');
}

// List saved posts, optionally filtered by folder
// Hint: list all records, then filter client-side by folder URI
export async function listSavedPosts(
  rpc: Client,
  did: Did,
  folderUri?: string,
): Promise<Array<{ uri: string; rkey: string; postUri: string; postCid: string; folderUri?: string }>> {
  // TODO: List all records in collection 'com.example.nekosky.saved.item'
  // If folderUri is provided, filter to only items in that folder
  // Return array of { uri, rkey, postUri, postCid, folderUri }
  throw new Error('Not implemented — implement listSavedPosts!');
}

// Remove a saved post
// Hint: use rpc.post('com.atproto.repo.deleteRecord', { input: { ... } })
export async function removeSavedPost(
  rpc: Client,
  did: Did,
  rkey: string,
): Promise<void> {
  // TODO: Delete the record from collection 'com.example.nekosky.saved.item'
  throw new Error('Not implemented — implement removeSavedPost!');
}

// Delete a folder (and optionally its items)
export async function deleteFolder(
  rpc: Client,
  did: Did,
  rkey: string,
): Promise<void> {
  // TODO: Delete the folder record from collection 'com.example.nekosky.saved.folder'
  throw new Error('Not implemented — implement deleteFolder!');
}
