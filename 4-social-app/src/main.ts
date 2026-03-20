import { Client } from '@atcute/client';
import type {} from '@atcute/bluesky';
import { login, handleCallback, resumeSession, logout, type OAuthUserAgent } from './auth.js';
import { loadTimeline, renderPost } from './timeline.js';
import { createPost } from './compose.js';
import { getStatus, setStatus as setUserStatus, clearStatus } from './status.js';
import type { Did } from '@atcute/lexicons';

const loginSection = document.getElementById('login-section')!;
const appSection = document.getElementById('app-section')!;
const statusEl = document.getElementById('status')!;

function setStatus(msg: string, isError = false) {
  statusEl.textContent = msg;
  statusEl.className = isError ? 'error' : '';
}

// Initialize the app after successful login
async function initApp(agent: OAuthUserAgent) {
  const rpc = new Client({ handler: agent });

  // Fetch profile for header
  const result = await rpc.get('app.bsky.actor.getProfile', {
    params: { actor: agent.sub },
  });
  if (!result.ok) return;
  const profile = result.data;

  // Show app view
  loginSection.style.display = 'none';
  appSection.style.display = 'block';

  // Update header
  (document.getElementById('header-avatar') as HTMLImageElement).src = profile.avatar || '';
  document.getElementById('header-handle')!.textContent = `@${profile.handle}`;

  // Logout handler
  document.getElementById('logout-btn')!.onclick = () => logout(agent);

  // Status display
  const statusDisplay = document.getElementById('user-status')!;
  const statusEditBtn = document.getElementById('status-edit-btn')!;

  async function refreshStatus() {
    try {
      const s = await getStatus(rpc, agent.sub as Did);
      statusDisplay.textContent = s ? `${s.emoji || ''} ${s.text}`.trim() : '';
      statusDisplay.style.display = s ? 'block' : 'none';
    } catch {
      statusDisplay.style.display = 'none';
    }
  }

  statusEditBtn.addEventListener('click', async () => {
    const text = prompt('Set your status (max 100 chars):');
    if (text === null) return;
    try {
      if (text.trim() === '') {
        await clearStatus(rpc, agent.sub as Did);
      } else {
        const emoji = prompt('Emoji (optional):') || undefined;
        await setUserStatus(rpc, agent.sub as Did, text.trim(), emoji);
      }
      await refreshStatus();
    } catch (err) {
      console.error('Status not implemented yet:', err);
    }
  });

  refreshStatus();

  // Compose post
  const postText = document.getElementById('post-text') as HTMLTextAreaElement;
  const charCount = document.getElementById('char-count')!;
  const postBtn = document.getElementById('post-btn') as HTMLButtonElement;

  postText.addEventListener('input', () => {
    charCount.textContent = `${postText.value.length} / 300`;
  });

  postBtn.addEventListener('click', async () => {
    const text = postText.value.trim();
    if (!text) return;

    postBtn.disabled = true;
    postBtn.textContent = '發送中...';
    try {
      await createPost(rpc, agent.sub, text);
      postText.value = '';
      charCount.textContent = '0 / 300';
      // Reload timeline to show new post
      await fetchTimeline(rpc, true);
    } catch (err) {
      alert(`發文失敗：${err instanceof Error ? err.message : err}`);
    } finally {
      postBtn.disabled = false;
      postBtn.textContent = '發文';
    }
  });

  // Load initial timeline
  await fetchTimeline(rpc);

  // Load more button
  document.getElementById('load-more')!.addEventListener('click', () => fetchTimeline(rpc));
}

// Timeline state
let currentCursor: string | undefined;

async function fetchTimeline(rpc: Client, reset = false) {
  if (reset) currentCursor = undefined;

  const timelineEl = document.getElementById('timeline')!;
  const loadMoreBtn = document.getElementById('load-more')!;

  try {
    const data = await loadTimeline(rpc, currentCursor);
    if (!data) return;
    const html = data.feed.map(renderPost).join('');

    if (reset) {
      timelineEl.innerHTML = html;
    } else {
      timelineEl.insertAdjacentHTML('beforeend', html);
    }

    currentCursor = data.cursor;
    loadMoreBtn.style.display = currentCursor ? 'block' : 'none';
  } catch (err) {
    console.error('Failed to load timeline:', err);
  }
}

// Main initialization
async function init() {
  // Step 1: Check for OAuth callback
  const params = new URLSearchParams(window.location.search);
  if (params.has('state')) {
    setStatus('正在完成登入...');
    try {
      const agent = await handleCallback();
      window.history.replaceState({}, '', '/');
      await initApp(agent);
    } catch (err) {
      setStatus(`登入失敗：${err instanceof Error ? err.message : err}`, true);
    }
    return;
  }

  // Step 2: Try to resume session
  const existing = await resumeSession();
  if (existing) {
    try {
      await initApp(existing);
    } catch {
      setStatus('Session 已過期，請重新登入', true);
    }
    return;
  }

  // Step 3: Show login form
  const loginBtn = document.getElementById('login-btn')!;
  const handleInput = document.getElementById('handle-input') as HTMLInputElement;

  loginBtn.addEventListener('click', async () => {
    const handle = handleInput.value.trim();
    if (!handle) {
      setStatus('請輸入你的 handle', true);
      return;
    }
    loginBtn.setAttribute('disabled', '');
    setStatus('正在重新導向...');
    try {
      await login(handle);
    } catch (err) {
      setStatus(`錯誤：${err instanceof Error ? err.message : err}`, true);
      loginBtn.removeAttribute('disabled');
    }
  });

  handleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') loginBtn.click();
  });
}

init();
