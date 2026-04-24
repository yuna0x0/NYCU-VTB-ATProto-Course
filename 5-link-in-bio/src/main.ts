import { Client } from '@atcute/client';
import type {} from '@atcute/bluesky';
import type { Did } from '@atcute/lexicons';

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
  const mode = theme?.mode === 'light' ? 'light' : 'dark';
  document.documentElement.style.setProperty('--accent', accent);
  document.documentElement.dataset.mode = mode;
}

// ---- App state ----
let rpc: Client;
let userDid: Did;
let userHandle: string;
let currentTheme: Theme = { accent: DEFAULT_ACCENT, mode: 'dark' };

// =====================================================
// Editor mode
// =====================================================

async function initEditor(agent: OAuthUserAgent) {
  rpc = new Client({ handler: agent });
  userDid = agent.sub as Did;

  // Fetch Bluesky profile (for avatar + handle in header) via the ANONYMOUS
  // public appview — no auth required, no scope required. This is why our
  // OAuth request only asks for `atproto` + two `repo:` scopes: profile
  // display is a public read that atproto already lets anyone do.
  let avatar = '';
  let handle = '';
  try {
    const profileResult = await appviewClient.get('app.bsky.actor.getProfile', {
      params: { actor: agent.sub },
    });
    if (profileResult.ok) {
      avatar = profileResult.data.avatar || '';
      handle = profileResult.data.handle;
    }
  } catch {
    // best-effort — the app works even if the appview call fails
  }
  userHandle = handle;
  (document.getElementById('user-avatar') as HTMLImageElement).src = avatar;
  document.getElementById('user-handle')!.textContent = handle ? `@${handle}` : userDid;

  const viewLink = document.getElementById('view-public-link') as HTMLAnchorElement;
  viewLink.href = handle ? `#/view/${handle}` : `#/view/${userDid}`;

  document.getElementById('logout-btn')!.addEventListener('click', () => logout(agent));

  // Load profile → populate form.
  const profile = await getProfile(rpc, userDid);
  if (profile) {
    currentTheme = profile.theme ?? currentTheme;
    populateProfileForm(profile);
  } else {
    populateProfileForm(null);
  }
  applyTheme(currentTheme);
  updateProfilePdsls();

  // Wire form controls.
  wireThemeControls();
  wireSaveProfile();
  wireAddLink();

  // Load links.
  await renderLinks();

  // Show editor.
  loginSection.style.display = 'none';
  viewSection.style.display = 'none';
  editorSection.style.display = 'flex';
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
  syncModeActive(currentTheme.mode ?? 'dark');
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
      setStatus('Profile saved ✓');
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
      setStatus('Link added ✓');
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
        setStatus('Link deleted ✓');
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

    // Pull avatar + display name from public appview (no auth needed).
    let bskyAvatar = '';
    let bskyDisplayName = '';
    try {
      const r = await appviewClient.get('app.bsky.actor.getProfile', { params: { actor: did } });
      if (r.ok) {
        bskyAvatar = r.data.avatar || '';
        bskyDisplayName = r.data.displayName || '';
      }
    } catch { /* non-fatal */ }

    // Pull the custom Link-in-Bio profile + links from the user's PDS.
    const [profile, links] = await Promise.all([
      getProfile(pdsRpc, did),
      listLinks(pdsRpc, did),
    ]);

    applyTheme(profile?.theme ?? { accent: DEFAULT_ACCENT, mode: 'dark' });
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
// Router + bootstrap
// =====================================================

function parseViewRoute(): string | null {
  const m = window.location.hash.match(/^#\/view\/([^/?#]+)/);
  return m ? decodeURIComponent(m[1]!) : null;
}

async function init() {
  // Route 1: public viewer
  const viewActor = parseViewRoute();
  if (viewActor) {
    await renderPublicView(viewActor);
    return;
  }

  // Route 2: OAuth callback
  const params = new URLSearchParams(window.location.search);
  if (params.has('state')) {
    setStatus('Completing login…', false, false);
    try {
      const agent = await handleCallback();
      window.history.replaceState({}, '', '/');
      await initEditor(agent);
      setStatus('');
    } catch (err) {
      setStatus(`Login failed: ${err instanceof Error ? err.message : err}`, true);
      showLogin();
    }
    return;
  }

  // Route 3: resume session
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

  // Default: login form
  showLogin();
}

function showLogin() {
  loginSection.style.display = 'flex';
  editorSection.style.display = 'none';
  viewSection.style.display = 'none';
  applyTheme({ accent: DEFAULT_ACCENT, mode: 'dark' });

  const btn = document.getElementById('login-btn') as HTMLButtonElement;
  const input = document.getElementById('handle-input') as HTMLInputElement;
  btn.addEventListener('click', async () => {
    const handle = input.value.trim();
    if (!handle) { setStatus('Please enter your handle', true); return; }
    btn.disabled = true;
    setStatus('Redirecting to your PDS…', false, false);
    try { await login(handle); }
    catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : err}`, true);
      btn.disabled = false;
    }
  });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') btn.click(); });
}

window.addEventListener('hashchange', () => {
  const next = parseViewRoute();
  if (next) renderPublicView(next);
  else window.location.reload();
});

init();
