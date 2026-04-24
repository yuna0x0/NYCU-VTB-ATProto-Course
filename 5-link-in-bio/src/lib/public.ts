import { Client, simpleFetchHandler } from '@atcute/client';
import type { ActorIdentifier } from '@atcute/lexicons/syntax';
import type {} from '@atcute/atproto';
import type {} from '@atcute/bluesky';

import { identityResolver } from './oauth.js';

// Resolve any handle or DID to { did, handle, pds } using the shared resolver.
export async function resolveActor(actor: string) {
  return identityResolver.resolve(actor as ActorIdentifier);
}

// Build an unauthenticated XRPC client pointed at a specific PDS.
// Used by the public viewer — no OAuth required for public reads.
export function publicClient(pdsUrl: string | URL): Client {
  return new Client({ handler: simpleFetchHandler({ service: pdsUrl }) });
}

// A pre-built anonymous client pointed at the Bluesky appview, handy for
// reading public profile data (avatar, displayName) of any actor.
export const appviewClient = new Client({
  handler: simpleFetchHandler({ service: 'https://public.api.bsky.app' }),
});
