import { Client, CredentialManager } from '@atcute/client';

// Import type definitions so Client knows about com.atproto.* and app.bsky.* endpoints
import type {} from '@atcute/atproto';
import type {} from '@atcute/bluesky';

// Create an authenticated XRPC client using App Password
// App Passwords can be generated in Bluesky Settings > App Passwords
export async function createClient(
  service: string,
  identifier: string,
  password: string,
) {
  const manager = new CredentialManager({ service });
  const session = await manager.login({ identifier, password });
  const rpc = new Client({ handler: manager });

  console.log(`Logged in as ${session.handle} (${session.did})`);
  return { rpc, session };
}
