import { Client } from '@atcute/client';
import type {} from '@atcute/bluesky';
import { login, handleCallback, resumeSession, logout, type OAuthUserAgent } from './lib/oauth.js';
import { createFolder, listFolders, savePost, listSavedPosts, removeSavedPost } from './saved.js';
import type { Did } from '@atcute/lexicons';

const loginSection = document.getElementById('login-section')!;
const appSection = document.getElementById('app-section')!;
const statusEl = document.getElementById('status')!;

function setStatus(msg: string, isError = false) {
  statusEl.textContent = msg;
  statusEl.className = isError ? 'error' : '';
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ---- App State ----
let rpc: Client;
let userDid: Did;
let currentFolderUri: string | undefined;

// ---- Render Functions ----

async function renderFolders() {
  const folderList = document.getElementById('folder-list')!;
  try {
    const folders = await listFolders(rpc, userDid);
    folderList.innerHTML = `
      <div class="folder-item ${!currentFolderUri ? 'active' : ''}" data-uri="">All Saved</div>
      ${folders.map((f) => `
        <div class="folder-item ${currentFolderUri === f.uri ? 'active' : ''}" data-uri="${escapeHtml(f.uri)}">
          ${escapeHtml(f.name)}
        </div>
      `).join('')}
    `;

    folderList.querySelectorAll('.folder-item').forEach((el) => {
      el.addEventListener('click', () => {
        currentFolderUri = (el as HTMLElement).dataset.uri || undefined;
        renderFolders();
        renderSavedPosts();
      });
    });
  } catch (err) {
    folderList.innerHTML = '<div class="folder-item active">All Saved</div>';
    console.error('listFolders not implemented yet:', err);
  }
}

async function renderSavedPosts() {
  const container = document.getElementById('saved-posts')!;
  try {
    const items = await listSavedPosts(rpc, userDid, currentFolderUri);
    if (items.length === 0) {
      container.innerHTML = '<p class="empty-state">No saved posts yet. Browse the timeline and save some posts!</p>';
      return;
    }
    container.innerHTML = items.map((item) => `
      <div class="saved-post-card">
        <div class="post-uri">${escapeHtml(item.postUri)}</div>
        <button class="remove-btn" data-rkey="${escapeHtml(item.rkey)}">Remove</button>
      </div>
    `).join('');

    container.querySelectorAll('.remove-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const rkey = (btn as HTMLElement).dataset.rkey!;
        try {
          await removeSavedPost(rpc, userDid, rkey);
          renderSavedPosts();
        } catch (err) {
          setStatus(`Error: ${err instanceof Error ? err.message : err}`, true);
        }
      });
    });
  } catch (err) {
    container.innerHTML = '<p class="empty-state">Implement listSavedPosts to see your saved posts!</p>';
    console.error('listSavedPosts not implemented yet:', err);
  }
}

async function loadTimeline() {
  const container = document.getElementById('timeline-posts')!;
  try {
    const result = await rpc.get('app.bsky.feed.getTimeline', {
      params: { limit: 20 },
    });
    if (!result.ok) return;

    container.innerHTML = result.data.feed.map((item: any) => {
      const post = item.post;
      const record = post.record as { text?: string };
      return `
        <div class="timeline-post">
          <div class="post-header">
            <strong>${escapeHtml(post.author.displayName || post.author.handle)}</strong>
            <span class="handle">@${escapeHtml(post.author.handle)}</span>
          </div>
          <div class="post-text">${escapeHtml(record.text || '')}</div>
          <button class="save-btn" data-uri="${escapeHtml(post.uri)}" data-cid="${escapeHtml(post.cid)}">
            Save
          </button>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.save-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const postUri = (btn as HTMLElement).dataset.uri!;
        const postCid = (btn as HTMLElement).dataset.cid!;
        try {
          await savePost(rpc, userDid, postUri, postCid, currentFolderUri);
          (btn as HTMLButtonElement).textContent = 'Saved!';
          (btn as HTMLButtonElement).disabled = true;
          renderSavedPosts();
        } catch (err) {
          setStatus(`Error: ${err instanceof Error ? err.message : err}`, true);
        }
      });
    });
  } catch (err) {
    container.innerHTML = '<p class="empty-state">Failed to load timeline</p>';
  }
}

// ---- App Init ----

async function initApp(agent: OAuthUserAgent) {
  rpc = new Client({ handler: agent });
  userDid = agent.sub as Did;

  loginSection.style.display = 'none';
  appSection.style.display = 'flex';

  // Show user info
  const profileResult = await rpc.get('app.bsky.actor.getProfile', {
    params: { actor: agent.sub },
  });
  if (!profileResult.ok) return;
  const profile = profileResult.data;
  document.getElementById('user-handle')!.textContent = `@${profile.handle}`;
  (document.getElementById('user-avatar') as HTMLImageElement).src = profile.avatar || '';

  document.getElementById('logout-btn')!.onclick = () => logout(agent);

  // New folder button
  document.getElementById('new-folder-btn')!.addEventListener('click', async () => {
    const name = prompt('Folder name:');
    if (!name) return;
    try {
      await createFolder(rpc, userDid, name);
      renderFolders();
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : err}`, true);
    }
  });

  // Load initial data
  await Promise.all([renderFolders(), renderSavedPosts(), loadTimeline()]);
}

// ---- Main Init ----

async function init() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('state')) {
    setStatus('Completing login...');
    try {
      const agent = await handleCallback();
      window.history.replaceState({}, '', '/');
      await initApp(agent);
      setStatus('');
    } catch (err) {
      setStatus(`Login failed: ${err instanceof Error ? err.message : err}`, true);
    }
    return;
  }

  const existing = await resumeSession();
  if (existing) {
    setStatus('Resuming session...');
    try {
      await initApp(existing);
      setStatus('');
    } catch {
      setStatus('Session expired, please log in again', true);
    }
    return;
  }

  const loginBtn = document.getElementById('login-btn')!;
  const handleInput = document.getElementById('handle-input') as HTMLInputElement;

  loginBtn.addEventListener('click', async () => {
    const handle = handleInput.value.trim();
    if (!handle) { setStatus('Please enter your handle', true); return; }
    loginBtn.setAttribute('disabled', '');
    setStatus('Redirecting to authorization...');
    try { await login(handle); }
    catch (err) { setStatus(`Error: ${err instanceof Error ? err.message : err}`, true); loginBtn.removeAttribute('disabled'); }
  });

  handleInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') loginBtn.click(); });
}

init();
