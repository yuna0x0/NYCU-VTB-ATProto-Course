import { Client } from '@atcute/client';
import type {} from '@atcute/bluesky';
import type { Did } from '@atcute/lexicons';
import type { ActorIdentifier } from '@atcute/lexicons/syntax';

import { login, handleCallback, resumeSession, logout, type OAuthUserAgent } from './lib/oauth.js';
import { resolveActor, publicClient, appviewClient } from './lib/public.js';
import {
  getProfile,
  putProfile,
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

  // Show editor IMMEDIATELY. Even if any of the downstream data calls fail,
  // the user should never be stuck looking at the login form after auth.
  loginSection.style.display = 'none';
  viewSection.style.display = 'none';
  editorSection.style.display = 'flex';

  // Wire interactive controls up front so they work even before data loads.
  document.getElementById('logout-btn')!.addEventListener('click', () => logout(agent));
  wireThemeControls();
  wireSaveProfile();
  wireAddLink();

  // Load Bluesky profile (avatar + handle) from the anonymous public appview.
  // Runs in the background; failures are logged but never block the editor.
  loadBskyProfile(agent.sub).catch((err) => console.error('bsky profile load:', err));

  // Load our custom profile record (singleton at rkey "self").
  try {
    const profile = await getProfile(rpc, userDid);
    if (profile?.theme) currentTheme = profile.theme;
    populateProfileForm(profile);
  } catch (err) {
    console.error('linkinbio profile load:', err);
    populateProfileForm(null);
  }
  applyTheme(currentTheme);
  updateProfilePdsls();

  // Load link records (collection listing).
  try {
    await renderLinks();
  } catch (err) {
    console.error('linkinbio links load:', err);
    document.getElementById('links-list')!.innerHTML =
      '<p class="empty-state">Failed to load links — check the console.</p>';
  }
}

async function loadBskyProfile(actor: string): Promise<void> {
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
    const titleInput = document.getElementById('add-link-title') as HTMLInputElement;
    const urlInput = document.getElementById('add-link-url') as HTMLInputElement;
    const url = urlInput.value.trim();
    const title = titleInput.value.trim();
    if (!url || !title) return;

    const submitBtn = form.querySelector('button') as HTMLButtonElement;
    submitBtn.disabled = true;
    setStatus('Adding link…', false, false);
    try {
      const currentLinks = await listLinks(rpc, userDid);
      const nextOrder = currentLinks.length;
      await addLink(rpc, userDid, {
        url,
        title,
        emoji: emojiInput.value.trim() || undefined,
        order: nextOrder,
      });
      emojiInput.value = '';
      titleInput.value = '';
      urlInput.value = '';
      await renderLinks();
      setStatus('Link added');
    } catch (err) {
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
    container.innerHTML = '<p class="empty-state">No links yet — add your first one below!</p>';
    return;
  }
  container.innerHTML = links.map((l) => renderLinkRow(l)).join('');
  container.querySelectorAll<HTMLButtonElement>('.link-delete').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const rkey = btn.dataset.rkey!;
      if (!confirm('Delete this link?')) return;
      setStatus('Deleting…', false, false);
      try {
        await deleteLink(rpc, userDid, rkey);
        await renderLinks();
        setStatus('Link deleted');
      } catch (err) {
        setStatus(`Delete failed: ${err instanceof Error ? err.message : err}`, true);
      }
    });
  });
}

function renderLinkRow(l: LinkRecord): string {
  const pdsls = pdslsUrl(userDid, LINK_NSID, l.rkey);
  return `
    <div class="link-row">
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
    // aborted or network error — ignore silently
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
      setStatus(`Login failed: ${err instanceof Error ? err.message : err}`, true);
      showLogin();
    }
    return;
  }

  const existing = await resumeSession();
  if (existing) {
    setStatus('Resuming session…', false, false);
    try {
      await initEditor(existing);
      setStatus('');
      return;
    } catch (err) {
      console.warn('Session resume failed:', err);
    }
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

init();
