import type { Handle } from '@atcute/lexicons';
import {
  configureOAuth,
  createAuthorizationUrl,
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

// Fine-grained least-privilege scope — only what this app actually needs.
// Reads from the user's own repo do not require a scope; writes are
// enumerated per collection. We do NOT request any `rpc:` scope because
// Bluesky profile reads go through the anonymous public appview at
// public.api.bsky.app (see src/lib/public.ts) — no auth needed, no scope
// needed. See https://atproto.com/specs/permission for the full grammar.
export const SCOPE = [
  'atproto',
  'repo:com.example.linkinbio.profile?action=create&action=update&action=delete',
  'repo:com.example.linkinbio.link?action=create&action=update&action=delete',
].join(' ');

// Dev fallback — loopback client_id per atproto.com/specs/oauth §Client ID.
// The literal keyword `localhost` inside client_id is a magic marker; the
// Vite server actually binds to 127.0.0.1 (atproto OAuth forbids a real
// localhost origin).
const DEV_REDIRECT = 'http://127.0.0.1:5175/callback';
const DEV_CLIENT_ID =
  `http://localhost/?redirect_uri=${encodeURIComponent(DEV_REDIRECT)}&scope=${encodeURIComponent(SCOPE)}`;

const CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID || DEV_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_OAUTH_REDIRECT_URI || DEV_REDIRECT;

// Identity resolver — handle → DID and PDS discovery.
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

// Start the OAuth login flow — redirects to the user's PDS for consent.
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
export async function resumeSession(): Promise<OAuthUserAgent | null> {
  try {
    const sessions = listStoredSessions();
    if (sessions.length === 0) return null;
    const session = await getSession(sessions[0]);
    return new OAuthUserAgent(session);
  } catch {
    return null;
  }
}

// Log out — revoke tokens + clear storage, then reload.
export async function logout(agent: OAuthUserAgent): Promise<void> {
  await agent.signOut();
  window.location.reload();
}

export { OAuthUserAgent };
export type { Session };
