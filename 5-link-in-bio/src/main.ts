import { Client } from '@atcute/client';
import type {} from '@atcute/bluesky';
import type { Did } from '@atcute/lexicons';
import type { ActorIdentifier } from '@atcute/lexicons/syntax';
import 'emoji-picker-element';

import {
  login,
  handleCallback,
  resumeSession,
  logout,
  clearStoredSessions,
  type OAuthUserAgent,
} from './lib/oauth.js';
import { resolveActor, publicClient, appviewClient } from './lib/public.js';
import {
  getProfile,
  putProfile,
  setLinkOrder,
  listLinks,
  addLink,
  deleteLink,
  pdslsUrl,
  PROFILE_NSID,
  LINK_NSID,
  type Profile,
  type Theme,
  type LinkRecord,
} from './linkinbio.js';

// ---- DOM refs ----
const loginSection = document.getElementById('login-section') as HTMLDivElement;
const editorSection = document.getElementById('editor-section') as HTMLDivElement;
const viewSection = document.getElementById('view-section') as HTMLDivElement;
const statusEl = document.getElementById('status') as HTMLDivElement;

// ---- Status helper ----
let statusTimer: number | undefined;
function setStatus(msg: string, isError = false, autoHide = true) {
  // Don't clobber the "session expired" message that forceLogout posts
  // while the reload is pending (1.5s window).
  if (loggingOut) return;
  statusEl.textContent = msg;
  statusEl.className = isError ? 'visible error' : 'visible';
  window.clearTimeout(statusTimer);
  if (autoHide && msg) {
    statusTimer = window.setTimeout(() => { statusEl.className = ''; }, 3000);
  } else if (!msg) {
    statusEl.className = '';
  }
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Recognise errors that mean "this OAuth session is no longer valid":
// expired / revoked access or refresh token, invalid DPoP proof, 401, etc.
// Matches atcute's thrown errors, XRPC `{ok:false, data:{error}}` payloads
// that bubble up via our own throws, plain error objects, and strings.
// Intentionally permissive: a false positive just sends the user through
// OAuth again, which is far better than leaving them stuck with a dead
// session they can't tell is dead.
function isAuthError(err: unknown): boolean {
  if (!err) return false;
  let msg: string;
  if (err instanceof Error) msg = err.message;
  else if (typeof err === 'string') msg = err;
  else if (typeof err === 'object') {
    try { msg = JSON.stringify(err); } catch { msg = String(err); }
  } else msg = String(err);
  return /401|403|unauthori|authentic|token|dpop|expired|revoked|refresh|invalid[_ -]?grant/i.test(msg);
}

// Drop the stored session from IndexedDB and bounce back to the login page
// with an explanation. Used whenever we detect an auth error on any XRPC
// call, since the session is unusable and keeping the user in the editor
// is worse than sending them through OAuth again.
let loggingOut = false;
function forceLogout(reason = 'Your session has expired. Please log in again.'): void {
  if (loggingOut) return;
  loggingOut = true;
  clearStoredSessions();
  // Write the toast directly: setStatus suppresses writes once loggingOut
  // is set, and we need this final message to stick until the reload.
  statusEl.textContent = reason;
  statusEl.className = 'visible error';
  setTimeout(() => window.location.reload(), 1500);
}

// ---- Theme application ----
const DEFAULT_ACCENT = '#f291a5';
function applyTheme(theme: Theme | undefined) {
  const accent = theme?.accent && /^#[0-9a-f]{3,8}$/i.test(theme.accent) ? theme.accent : DEFAULT_ACCENT;
  const mode = theme?.mode === 'dark' ? 'dark' : 'light';
  document.documentElement.style.setProperty('--accent', accent);
  document.documentElement.dataset.mode = mode;
}

// ---- App state ----
let rpc: Client;
let userDid: Did;
let currentTheme: Theme = { accent: DEFAULT_ACCENT, mode: 'light' };
let loginWired = false;

// =====================================================
// Editor mode
// =====================================================

async function initEditor(agent: OAuthUserAgent) {
  rpc = new Client({ handler: agent });
  userDid = agent.sub as Did;

  // Show the editor immediately. The session was server-verified upstream:
  // resumeSession() calls com.atproto.server.getSession before returning
  // 'ok', and the OAuth-callback path has just finalized fresh tokens.
  loginSection.style.display = 'none';
  viewSection.style.display = 'none';
  editorSection.style.display = 'flex';

  document.getElementById('logout-btn')!.addEventListener('click', () => logout(agent));
  wireThemeControls();
  wireSaveProfile();
  wireAddLink();
  wireEmojiPicker();

  // Fill header avatar + handle from the anonymous public appview.
  loadBskyProfile(agent.sub).catch((err) => console.error('bsky profile load:', err));

  // Load profile record (singleton). Auth errors here bounce to login;
  // non-auth errors let the user proceed with an empty form.
  let profile: Profile | null = null;
  try {
    profile = await getProfile(rpc, userDid);
  } catch (err) {
    console.error('linkinbio profile load:', err);
    if (isAuthError(err)) { forceLogout(); return; }
  }
  if (profile?.theme) currentTheme = profile.theme;
  populateProfileForm(profile);
  applyTheme(currentTheme);
  updateProfilePdsls();

  // Load link records (collection listing).
  try {
    await renderLinks();
  } catch (err) {
    console.error('linkinbio links load:', err);
    if (isAuthError(err)) { forceLogout(); return; }
    document.getElementById('links-list')!.innerHTML =
      '<p class="empty-state">Failed to load links. Check the console.</p>';
  }

  // Detect sessions that die while the tab is already open (revoked from
  // another device, long-idle, etc.) without waiting for a user action.
  startSessionHealthCheck();
}

// Periodic "is my session still alive?" probe. Fires on tab focus and every
// 5 minutes while the editor is visible. A single getProfile call is enough:
// atcute auto-refreshes the access token, so this only fails when the
// refresh token itself has expired/been revoked.
let healthCheckInterval: number | undefined;
let healthCheckRunning = false;
async function runSessionHealthCheck() {
  if (healthCheckRunning || loggingOut) return;
  if (!rpc || !userDid) return;
  healthCheckRunning = true;
  try {
    await getProfile(rpc, userDid);
  } catch (err) {
    if (isAuthError(err)) forceLogout();
  } finally {
    healthCheckRunning = false;
  }
}
function startSessionHealthCheck() {
  if (healthCheckInterval !== undefined) return;
  healthCheckInterval = window.setInterval(runSessionHealthCheck, 5 * 60 * 1000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') runSessionHealthCheck();
  });
}

async function loadBskyProfile(actor: Did): Promise<void> {
  const result = await appviewClient.get('app.bsky.actor.getProfile', {
    params: { actor: actor as ActorIdentifier },
  });
  if (!result.ok) return;
  const avatar = result.data.avatar || '';
  const handle = result.data.handle;
  (document.getElementById('user-avatar') as HTMLImageElement).src = avatar;
  document.getElementById('user-handle')!.textContent = `@${handle}`;
  (document.getElementById('view-public-link') as HTMLAnchorElement).href = `#/view/${handle}`;
}

function populateProfileForm(profile: Profile | null) {
  (document.getElementById('profile-display-name') as HTMLInputElement).value =
    profile?.displayName ?? '';
  (document.getElementById('profile-description') as HTMLTextAreaElement).value =
    profile?.description ?? '';
  if (profile?.theme?.accent) {
    (document.getElementById('theme-color-picker') as HTMLInputElement).value =
      normalizeHex(profile.theme.accent);
  }
  syncSwatchActive(currentTheme.accent);
  syncModeActive(currentTheme.mode ?? 'light');
}

function normalizeHex(hex: string): string {
  const s = hex.trim();
  if (/^#[0-9a-f]{3}$/i.test(s)) {
    return '#' + s.slice(1).split('').map((c) => c + c).join('');
  }
  if (/^#[0-9a-f]{6}$/i.test(s)) return s.toLowerCase();
  if (/^#[0-9a-f]{8}$/i.test(s)) return s.slice(0, 7).toLowerCase();
  return DEFAULT_ACCENT;
}

function syncSwatchActive(accent: string | undefined) {
  const norm = accent ? normalizeHex(accent) : DEFAULT_ACCENT;
  document.querySelectorAll<HTMLSpanElement>('.swatch').forEach((el) => {
    el.classList.toggle('active', el.dataset.color?.toLowerCase() === norm);
  });
}

function syncModeActive(mode: 'dark' | 'light') {
  document.querySelectorAll<HTMLButtonElement>('.mode-option').forEach((el) => {
    el.classList.toggle('active', el.dataset.mode === mode);
  });
}

function wireThemeControls() {
  document.querySelectorAll<HTMLSpanElement>('.swatch').forEach((el) => {
    el.addEventListener('click', () => {
      const color = el.dataset.color!;
      currentTheme.accent = color;
      (document.getElementById('theme-color-picker') as HTMLInputElement).value = color;
      syncSwatchActive(color);
      applyTheme(currentTheme);
    });
  });

  const picker = document.getElementById('theme-color-picker') as HTMLInputElement;
  picker.addEventListener('input', () => {
    currentTheme.accent = picker.value;
    syncSwatchActive(picker.value);
    applyTheme(currentTheme);
  });

  document.querySelectorAll<HTMLButtonElement>('.mode-option').forEach((el) => {
    el.addEventListener('click', () => {
      const mode = el.dataset.mode as 'dark' | 'light';
      currentTheme.mode = mode;
      syncModeActive(mode);
      applyTheme(currentTheme);
    });
  });
}

function wireSaveProfile() {
  const btn = document.getElementById('save-profile-btn') as HTMLButtonElement;
  btn.addEventListener('click', async () => {
    const displayName = (document.getElementById('profile-display-name') as HTMLInputElement).value.trim();
    const description = (document.getElementById('profile-description') as HTMLTextAreaElement).value.trim();
    btn.disabled = true;
    setStatus('Saving profile…', false, false);
    try {
      await putProfile(rpc, userDid, {
        displayName: displayName || undefined,
        description: description || undefined,
        theme: {
          accent: currentTheme.accent,
          mode: currentTheme.mode,
        },
      });
      setStatus('Profile saved');
      updateProfilePdsls();
    } catch (err) {
      if (isAuthError(err)) { forceLogout(); return; }
      setStatus(`Save failed: ${err instanceof Error ? err.message : err}`, true);
    } finally {
      btn.disabled = false;
    }
  });
}

function updateProfilePdsls() {
  const el = document.getElementById('profile-pdsls-link') as HTMLAnchorElement;
  el.href = pdslsUrl(userDid, PROFILE_NSID, 'self');
  el.style.display = 'inline-flex';
}

function wireAddLink() {
  const form = document.getElementById('add-link-form') as HTMLFormElement;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emojiInput = document.getElementById('add-link-emoji') as HTMLInputElement;
    const emojiBtn = document.getElementById('add-link-emoji-btn') as HTMLButtonElement;
    const titleInput = document.getElementById('add-link-title') as HTMLInputElement;
    const urlInput = document.getElementById('add-link-url') as HTMLInputElement;
    const url = urlInput.value.trim();
    const title = titleInput.value.trim();
    if (!url || !title) return;

    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    submitBtn.disabled = true;
    setStatus('Adding link…', false, false);
    try {
      const currentLinks = await listLinks(rpc, userDid);
      const newRkey = await addLink(rpc, userDid, {
        url,
        title,
        emoji: emojiInput.value.trim() || undefined,
      });
      // Append new rkey to the profile's linkOrder so the page shows it
      // at the bottom. One putRecord on the singleton profile.
      await setLinkOrder(rpc, userDid, [...currentLinks.map((l) => l.rkey), newRkey]);
      emojiInput.value = '';
      emojiBtn.textContent = '🔗';
      titleInput.value = '';
      urlInput.value = '';
      await renderLinks();
      setStatus('Link added');
    } catch (err) {
      if (isAuthError(err)) { forceLogout(); return; }
      setStatus(`Add failed: ${err instanceof Error ? err.message : err}`, true);
    } finally {
      submitBtn.disabled = false;
    }
  });
}

async function renderLinks() {
  const container = document.getElementById('links-list')!;
  const links = await listLinks(rpc, userDid);
  if (links.length === 0) {
    container.innerHTML = '<p class="empty-state">No links yet. Add your first one below!</p>';
    return;
  }
  container.innerHTML = links.map((l, i) => renderLinkRow(l, i, links.length)).join('');

  container.querySelectorAll<HTMLButtonElement>('.link-up, .link-down').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const rkey = btn.dataset.rkey!;
      const direction = btn.classList.contains('link-up') ? -1 : 1;
      await swapLinkOrder(links, rkey, direction);
    });
  });

  container.querySelectorAll<HTMLButtonElement>('.link-delete').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const rkey = btn.dataset.rkey!;
      if (!confirm('Delete this link?')) return;
      setStatus('Deleting…', false, false);
      try {
        await deleteLink(rpc, userDid, rkey);
        // Drop the rkey from the profile's linkOrder so it stops appearing.
        await setLinkOrder(rpc, userDid, links.filter((l) => l.rkey !== rkey).map((l) => l.rkey));
        await renderLinks();
        setStatus('Link deleted');
      } catch (err) {
        if (isAuthError(err)) { forceLogout(); return; }
        setStatus(`Delete failed: ${err instanceof Error ? err.message : err}`, true);
      }
    });
  });
}

// Swap a link's position with its neighbor (direction: -1 = up, +1 = down).
// One putRecord on the profile, since order is a single source of truth.
async function swapLinkOrder(links: LinkRecord[], rkey: string, direction: -1 | 1) {
  const i = links.findIndex((l) => l.rkey === rkey);
  const j = i + direction;
  if (i < 0 || j < 0 || j >= links.length) return;
  const newOrder = links.map((l) => l.rkey);
  [newOrder[i], newOrder[j]] = [newOrder[j]!, newOrder[i]!];
  setStatus('Reordering…', false, false);
  try {
    await setLinkOrder(rpc, userDid, newOrder);
    await renderLinks();
    setStatus('Reordered');
  } catch (err) {
    if (isAuthError(err)) { forceLogout(); return; }
    setStatus(`Reorder failed: ${err instanceof Error ? err.message : err}`, true);
  }
}

function renderLinkRow(l: LinkRecord, index: number, total: number): string {
  const pdsls = pdslsUrl(userDid, LINK_NSID, l.rkey);
  const upDisabled = index === 0 ? 'disabled' : '';
  const downDisabled = index === total - 1 ? 'disabled' : '';
  return `
    <div class="link-row">
      <div class="link-reorder">
        <button class="icon-btn link-up" data-rkey="${escapeHtml(l.rkey)}" ${upDisabled} title="Move up">▲</button>
        <button class="icon-btn link-down" data-rkey="${escapeHtml(l.rkey)}" ${downDisabled} title="Move down">▼</button>
      </div>
      <div class="link-emoji">${escapeHtml(l.emoji || '🔗')}</div>
      <div class="link-info">
        <div class="link-title">${escapeHtml(l.title)}</div>
        <div class="link-url">${escapeHtml(l.url)}</div>
      </div>
      <div class="link-actions">
        <a class="icon-btn" href="${escapeHtml(pdsls)}" target="_blank" rel="noreferrer">PDSls</a>
        <button class="icon-btn danger link-delete" data-rkey="${escapeHtml(l.rkey)}">Delete</button>
      </div>
    </div>
  `;
}

// ----- Emoji picker (add-link form) -----

function wireEmojiPicker() {
  const btn = document.getElementById('add-link-emoji-btn') as HTMLButtonElement;
  const hidden = document.getElementById('add-link-emoji') as HTMLInputElement;
  const overlay = document.getElementById('emoji-picker-overlay') as HTMLDivElement;
  const picker = overlay.querySelector('emoji-picker')!;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
  });

  picker.addEventListener('emoji-click', (e: Event) => {
    const emoji = (e as CustomEvent<{ unicode: string }>).detail.unicode;
    hidden.value = emoji;
    btn.textContent = emoji;
    overlay.style.display = 'none';
  });

  document.addEventListener('click', (e) => {
    const target = e.target as Element;
    if (!target.closest('#emoji-picker-overlay, #add-link-emoji-btn')) {
      overlay.style.display = 'none';
    }
  });
}

// =====================================================
// Public viewer (no auth)
// =====================================================

async function renderPublicView(actorInput: string) {
  loginSection.style.display = 'none';
  editorSection.style.display = 'none';
  viewSection.style.display = 'flex';

  const nameEl = document.getElementById('view-display-name')!;
  const handleEl = document.getElementById('view-handle')!;
  const bioEl = document.getElementById('view-bio')!;
  const linksEl = document.getElementById('view-links')!;
  const avatarEl = document.getElementById('view-avatar') as HTMLImageElement;
  const pdslsEl = document.getElementById('view-pdsls-link') as HTMLAnchorElement;

  nameEl.textContent = 'Loading…';
  handleEl.textContent = '';
  bioEl.textContent = '';
  linksEl.innerHTML = '';
  avatarEl.src = '';

  try {
    const resolved = await resolveActor(actorInput);
    const did = resolved.did as Did;
    const pdsRpc = publicClient(resolved.pds);
    pdslsEl.href = `https://pdsls.dev/at://${did}`;

    let bskyAvatar = '';
    let bskyDisplayName = '';
    try {
      const r = await appviewClient.get('app.bsky.actor.getProfile', { params: { actor: did } });
      if (r.ok) {
        bskyAvatar = r.data.avatar || '';
        bskyDisplayName = r.data.displayName || '';
      }
    } catch { /* non-fatal */ }

    const [profile, links] = await Promise.all([
      getProfile(pdsRpc, did),
      listLinks(pdsRpc, did),
    ]);

    applyTheme(profile?.theme ?? { accent: DEFAULT_ACCENT, mode: 'light' });
    avatarEl.src = bskyAvatar;
    nameEl.textContent = profile?.displayName || bskyDisplayName || resolved.handle;
    handleEl.textContent = `@${resolved.handle}`;
    bioEl.textContent = profile?.description ?? '';

    if (links.length === 0) {
      linksEl.innerHTML = '<p class="empty-state">No links yet.</p>';
      return;
    }
    linksEl.innerHTML = links
      .map(
        (l) => `
        <a class="viewer-link" href="${escapeHtml(l.url)}" target="_blank" rel="noreferrer noopener">
          <span class="link-emoji">${escapeHtml(l.emoji || '🔗')}</span>
          <span>${escapeHtml(l.title)}</span>
        </a>`,
      )
      .join('');
  } catch (err) {
    nameEl.textContent = 'Not found';
    bioEl.textContent = `Could not resolve "${actorInput}". ${err instanceof Error ? err.message : ''}`;
  }
}

// =====================================================
// Handle typeahead (login input autocomplete)
// =====================================================

type TypeaheadActor = {
  did: string;
  handle: string;
  displayName?: string;
  avatar?: string;
};

let typeaheadTimer: number | undefined;
let typeaheadAbort: AbortController | undefined;
let typeaheadActive = -1;
let typeaheadResults: TypeaheadActor[] = [];

function wireHandleTypeahead() {
  const input = document.getElementById('handle-input') as HTMLInputElement;
  const dropdown = document.getElementById('handle-typeahead') as HTMLDivElement;

  input.addEventListener('input', () => {
    const q = input.value.trim();
    window.clearTimeout(typeaheadTimer);
    if (typeaheadAbort) typeaheadAbort.abort();
    if (q.length < 2) { hideTypeahead(); return; }
    typeaheadTimer = window.setTimeout(() => runTypeahead(q), 180);
  });

  input.addEventListener('keydown', (e) => {
    if (dropdown.style.display !== 'block') return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      typeaheadActive = Math.min(typeaheadActive + 1, typeaheadResults.length - 1);
      renderTypeahead();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      typeaheadActive = Math.max(typeaheadActive - 1, -1);
      renderTypeahead();
    } else if (e.key === 'Enter' && typeaheadActive >= 0) {
      e.preventDefault();
      pickTypeahead(typeaheadActive);
    } else if (e.key === 'Escape') {
      hideTypeahead();
    }
  });

  document.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('.handle-field')) hideTypeahead();
  });
}

async function runTypeahead(q: string) {
  try {
    typeaheadAbort = new AbortController();
    const result = await appviewClient.get('app.bsky.actor.searchActorsTypeahead', {
      params: { q, limit: 8 },
      signal: typeaheadAbort.signal,
    });
    if (!result.ok) return;
    typeaheadResults = (result.data.actors as TypeaheadActor[]) ?? [];
    typeaheadActive = -1;
    renderTypeahead();
  } catch {
    // aborted or network error, ignore silently
  }
}

function renderTypeahead() {
  const dropdown = document.getElementById('handle-typeahead') as HTMLDivElement;
  if (typeaheadResults.length === 0) { hideTypeahead(); return; }
  dropdown.innerHTML = typeaheadResults
    .map(
      (a, i) => `
      <div class="typeahead-item${i === typeaheadActive ? ' active' : ''}" data-index="${i}">
        <img src="${escapeHtml(a.avatar || '')}" alt="" />
        <div class="typeahead-text">
          <div class="typeahead-name">${escapeHtml(a.displayName || a.handle)}</div>
          <div class="typeahead-handle">@${escapeHtml(a.handle)}</div>
        </div>
      </div>`,
    )
    .join('');
  dropdown.style.display = 'block';
  dropdown.querySelectorAll<HTMLDivElement>('.typeahead-item').forEach((el) => {
    el.addEventListener('mousedown', (e) => {
      e.preventDefault();
      pickTypeahead(Number(el.dataset.index));
    });
  });
}

function pickTypeahead(index: number) {
  const a = typeaheadResults[index];
  if (!a) return;
  const input = document.getElementById('handle-input') as HTMLInputElement;
  input.value = a.handle;
  hideTypeahead();
  (document.getElementById('login-btn') as HTMLButtonElement).focus();
}

function hideTypeahead() {
  typeaheadResults = [];
  typeaheadActive = -1;
  const dropdown = document.getElementById('handle-typeahead') as HTMLDivElement;
  dropdown.style.display = 'none';
  dropdown.innerHTML = '';
}

// =====================================================
// Router + bootstrap
// =====================================================

function parseViewRoute(): string | null {
  const m = window.location.hash.match(/^#\/view\/([^/?#]+)/);
  return m ? decodeURIComponent(m[1]!) : null;
}

function hasOAuthCallback(): boolean {
  const search = new URLSearchParams(window.location.search);
  if (search.has('state') && (search.has('code') || search.has('error'))) return true;
  const hash = window.location.hash.startsWith('#/') ? '' : window.location.hash.slice(1);
  if (hash) {
    const hashParams = new URLSearchParams(hash);
    if (hashParams.has('state') && (hashParams.has('code') || hashParams.has('error'))) return true;
  }
  return false;
}

async function init() {
  const viewActor = parseViewRoute();
  if (viewActor) {
    await renderPublicView(viewActor);
    return;
  }

  if (hasOAuthCallback()) {
    setStatus('Completing login…', false, false);
    try {
      const agent = await handleCallback();
      window.history.replaceState({}, '', '/');
      await initEditor(agent);
      setStatus('');
    } catch (err) {
      console.error('OAuth callback failed:', err);
      clearStoredSessions();
      window.history.replaceState({}, '', '/');
      setStatus(`Login failed: ${err instanceof Error ? err.message : err}`, true);
      showLogin();
    }
    return;
  }

  const resume = await resumeSession();
  if (resume.status === 'ok') {
    setStatus('Resuming session…', false, false);
    try {
      await initEditor(resume.agent);
      setStatus('');
      return;
    } catch (err) {
      console.warn('Session resume failed:', err);
      if (isAuthError(err)) clearStoredSessions();
    }
  } else if (resume.status === 'expired') {
    // resumeSession already cleared the dead session from IndexedDB;
    // tell the user why they're back at the login page.
    setStatus('Your session has expired. Please log in again.', true, false);
  }

  showLogin();
}

function showLogin() {
  loginSection.style.display = 'flex';
  editorSection.style.display = 'none';
  viewSection.style.display = 'none';
  applyTheme({ accent: DEFAULT_ACCENT, mode: 'light' });

  if (loginWired) return;
  loginWired = true;

  const btn = document.getElementById('login-btn') as HTMLButtonElement;
  const input = document.getElementById('handle-input') as HTMLInputElement;

  btn.addEventListener('click', async () => {
    const handle = input.value.trim().replace(/^@/, '');
    if (!handle) { setStatus('Please enter your handle', true); return; }
    btn.disabled = true;
    setStatus('Redirecting to your PDS…', false, false);
    try { await login(handle); }
    catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : err}`, true);
      btn.disabled = false;
    }
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && typeaheadActive < 0) btn.click();
  });

  wireHandleTypeahead();
}

window.addEventListener('hashchange', () => {
  const next = parseViewRoute();
  if (next) renderPublicView(next);
  else window.location.reload();
});

// OAuth DPoP requires WebCrypto (crypto.subtle), which browsers only expose
// in "secure contexts": https://, http://localhost, http://127.0.0.1, etc.
// A bare http:// page on any other hostname (LAN IP, custom domain) will
// leave crypto.subtle undefined, and the first OAuth call crashes deep in
// atcute with "Cannot read properties of undefined (reading 'digest')".
// Catch it up-front with a readable message instead.
if (typeof crypto === 'undefined' || !crypto.subtle) {
  statusEl.textContent =
    'WebCrypto is unavailable. Open this page over https:// or http://127.0.0.1 (not a LAN IP or plain http:// origin).';
  statusEl.className = 'visible error';
} else {
  init();
}
