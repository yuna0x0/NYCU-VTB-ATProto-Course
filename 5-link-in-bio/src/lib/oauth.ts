import type { Handle } from '@atcute/lexicons';
import { Client } from '@atcute/client';
import type {} from '@atcute/atproto';
import {
  configureOAuth,
  createAuthorizationUrl,
  deleteStoredSession,
  finalizeAuthorization,
  getSession,
  listStoredSessions,
  OAuthUserAgent,
  type Session,
} from '@atcute/oauth-browser-client';

import {
  LocalActorResolver,
  CompositeDidDocumentResolver,
  PlcDidDocumentResolver,
  WebDidDocumentResolver,
  CompositeHandleResolver,
  WellKnownHandleResolver,
  DohJsonHandleResolver,
} from '@atcute/identity-resolver';

// Fine-grained least-privilege scope: only what this app actually needs.
// Reads from the user's own repo do not require a scope; writes are
// enumerated per collection. We do NOT request any `rpc:` scope because
// Bluesky profile reads go through the anonymous public appview at
// public.api.bsky.app (see src/lib/public.ts), which needs no auth and no
// scope. See https://atproto.com/specs/permission for the full grammar.
export const SCOPE = [
  'atproto',
  'repo:com.example.linkinbio.profile?action=create&action=update&action=delete',
  'repo:com.example.linkinbio.link?action=create&action=update&action=delete',
].join(' ');

// Dev fallback: loopback client_id per atproto.com/specs/oauth §Client ID.
// The literal keyword `localhost` inside client_id is a magic marker; the
// Vite server actually binds to 127.0.0.1 (atproto OAuth forbids a real
// localhost origin).
const DEV_REDIRECT = 'http://127.0.0.1:5175/callback';
const DEV_CLIENT_ID =
  `http://localhost/?redirect_uri=${encodeURIComponent(DEV_REDIRECT)}&scope=${encodeURIComponent(SCOPE)}`;

const CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID || DEV_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_OAUTH_REDIRECT_URI || DEV_REDIRECT;

// Identity resolver: handle → DID and PDS discovery.
export const identityResolver = new LocalActorResolver({
  handleResolver: new CompositeHandleResolver({
    methods: {
      http: new WellKnownHandleResolver(),
      dns: new DohJsonHandleResolver({ dohUrl: 'https://cloudflare-dns.com/dns-query' }),
    },
  }),
  didDocumentResolver: new CompositeDidDocumentResolver({
    methods: {
      plc: new PlcDidDocumentResolver(),
      web: new WebDidDocumentResolver(),
    },
  }),
});

configureOAuth({
  metadata: {
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
  },
  identityResolver,
});

// Start the OAuth login flow. Redirects to the user's PDS for consent.
export async function login(handle: string): Promise<void> {
  const authUrl = await createAuthorizationUrl({
    target: { type: 'account', identifier: handle as Handle },
    scope: SCOPE,
  });
  window.location.assign(authUrl);
}

// Handle the OAuth callback after consent.
export async function handleCallback(): Promise<OAuthUserAgent> {
  const params = new URLSearchParams(window.location.hash.slice(1) || window.location.search);
  const { session } = await finalizeAuthorization(params);
  return new OAuthUserAgent(session);
}

// Try to resume an existing stored session (IndexedDB, managed by atcute).
// Eagerly refreshes tokens via atcute, so an expired session surfaces here
// rather than later when the user tries to save. We clear the dead session
// and return { status: 'expired' } so the UI can tell the user what happened.
export type ResumeResult =
  | { status: 'ok'; agent: OAuthUserAgent }
  | { status: 'expired' }
  | { status: 'none' };

export async function resumeSession(): Promise<ResumeResult> {
  const sessions = listStoredSessions();
  if (sessions.length === 0) return { status: 'none' };

  // Step 1: let atcute reload + refresh the stored session. Throws when
  // the refresh_token itself is gone / revoked / expired.
  let agent: OAuthUserAgent;
  try {
    const session = await getSession(sessions[0]);
    agent = new OAuthUserAgent(session);
  } catch (err) {
    console.warn('session refresh failed, clearing stored sessions:', err);
    clearStoredSessions();
    return { status: 'expired' };
  }

  // Step 2: verify with the server. `getSession()` above only proactively
  // refreshes when the ACCESS token has expired locally, and a session
  // that was revoked server-side can still look locally valid. An
  // authenticated `com.atproto.server.getSession` (atproto's "whoami")
  // call catches both revoked access and refresh tokens deterministically.
  try {
    const probe = await new Client({ handler: agent }).get(
      'com.atproto.server.getSession',
      { params: {} },
    );
    if (probe.ok) return { status: 'ok', agent };
    console.warn('session probe rejected, clearing:', probe.data);
  } catch (err) {
    console.warn('session probe threw, clearing:', err);
  }
  clearStoredSessions();
  return { status: 'expired' };
}

// Log out: revoke tokens, clear storage, reload.
export async function logout(agent: OAuthUserAgent): Promise<void> {
  await agent.signOut();
  window.location.reload();
}

// Drop every stored session from IndexedDB without trying to contact the PDS
// (the PDS call would fail anyway when tokens are already expired/revoked).
// Used when the app detects an auth-related XRPC error and wants to bounce
// the user back to login cleanly.
export function clearStoredSessions(): void {
  for (const did of listStoredSessions()) {
    try { deleteStoredSession(did); } catch { /* best-effort */ }
  }
}

export { OAuthUserAgent };
export type { Session };
