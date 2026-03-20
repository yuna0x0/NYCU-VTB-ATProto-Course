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

// Set up identity resolver
const identityResolver = new LocalActorResolver({
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

// Configure OAuth — loopback client for local development
configureOAuth({
  metadata: {
    client_id: `http://localhost?redirect_uri=${encodeURIComponent('http://localhost:5174/callback')}`,
    redirect_uri: 'http://localhost:5174/callback',
  },
  identityResolver,
});

// Start OAuth login flow
export async function login(handle: string): Promise<void> {
  const authUrl = await createAuthorizationUrl({
    target: { type: 'account', identifier: handle as Handle },
    scope: 'atproto transition:generic',
  });
  window.location.assign(authUrl);
}

// Handle OAuth callback
export async function handleCallback(): Promise<OAuthUserAgent> {
  const params = new URLSearchParams(window.location.hash.slice(1) || window.location.search);
  const { session } = await finalizeAuthorization(params);
  return new OAuthUserAgent(session);
}

// Resume existing session
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

// Log out
export async function logout(agent: OAuthUserAgent): Promise<void> {
  await agent.signOut();
  window.location.reload();
}

export { OAuthUserAgent };
export type { Session };
