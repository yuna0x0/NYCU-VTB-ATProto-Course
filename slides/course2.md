---
theme: seriph
title: 實作自己的機器人和演算法
info: |
  交大 VTuber 社 114-2 社課
  AT Protocol 從零開始喵
  by yuna0x0
class: text-center
drawings:
  persist: false
transition: fade-out
mdc: true
fonts:
  sans: 'LINE Seed JP'
themeConfig:
  primary: '#f291a5'
colorSchema: dark
---

<img src="./assets/shared/sky.webp" class="absolute inset-0 w-full h-full object-cover -z-2" />

# AT Protocol 從零開始喵
實作自己的機器人和演算法！<br>OAuth 驗證和你的第一個社交應用程式

<br>

<NameCard />

<div class="abs-br m-6 text-xl">
  <button v-if="__DEV__" @click="$slidev.nav.openInEditor()" title="Open in Editor" class="slidev-icon-btn">
    <carbon:edit />
  </button>
  <a href="https://github.com/yuna0x0/NYCU-VTB-ATProto-Course" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

---
dragPos:
  ema-2: 477,35,320,745,-5
  vtb-logo-2: 298,26,66,66,6
  hiro-2: 648,20,297,713,5
---

<img src="./assets/shared/sky.webp" class="absolute inset-0 w-full h-full object-cover -z-2" />
<div class="absolute inset-0 bg-black/50 -z-1" />

<div class="flex h-full">
<div class="w-1/2 flex flex-col justify-center text-left">

<p class="text-white/60 !mb-0">交大 VTuber 社 - 114-2 社課</p>
<h1 class="!mt-2 !mb-4">AT Protocol 從零開始喵</h1>

<NameCard size="sm" class="mb-6 self-start" />

<div class="flex flex-col text-lg">
  <div class="flex gap-6 py-3 border-b border-white/20">
    <span class="font-bold text-white/60">03/13</span>
    <span class="text-white/60">AT Protocol 是什麼？</span>
  </div>
  <div class="flex gap-6 py-3 border-b border-white/20">
    <span class="font-bold color-#f291a5">03/20</span>
    <span v-mark.box.pink="1">實作自己的機器人和演算法！<br>OAuth 驗證和你的第一個社交應用程式</span>
  </div>
  <div class="flex gap-6 py-3">
    <span class="font-bold text-white/60">04/24</span>
    <span class="text-white/60">Link in Bio on AT Protocol</span>
  </div>
</div>

<div class="mt-8 text-white/60 text-base space-y-2">
  <div><lucide:clock class="inline-block mr-1" />星期五 19:00 ~ 21:00</div>
  <div><lucide:map-pin class="inline-block mr-1" />交大活動中心 537 & Discord 線上</div>
</div>

</div>
<div class="w-1/2">
</div>
</div>

<img v-drag="'hiro-2'" src="./assets/shared/Hiro_Arms1_Default.webp" class="w-50" />
<img v-drag="'ema-2'" src="./assets/shared/Ema_ArmR3_ArmL7_Smile.webp" class="w-50" />
<img v-drag="'vtb-logo-2'" src="./assets/shared/nycu_vtb_logo_t.webp" class="w-20" />

---
dragPos:
  sherry-2: 43,181,331,327,-5
  discord-help-2: 365,292,593,68
---

# 有問題想問！？

### 可以在 **<a href="https://discord.gg/GPBJPshrBU">交大 VTuber 社</a>** Discord 伺服器的 <a href="https://discord.com/channels/806901909356412949/1478581760270008474">`#at-protocol-by-yuna`</a> 頻道<br>發問！

<img v-drag="'discord-help-2'" src="./assets/shared/discord-help.webp">

<img v-drag="'sherry-2'" src="./assets/shared/sherry.webp">

---
---

# 餵食 Yuna 🥺

上禮拜的 QRCode 有錯誤喵嗚 (╥﹏╥)

<div class="flex items-center justify-center mt-18">
    <img src="./assets/shared/yuna-donate.webp" class="w-[300px]">
</div>

---
---

# 上週回顧

<div class="grid grid-cols-3 gap-6 mt-8 text-left">
  <div v-click="[1, 2]" class="border border-white/20 rounded-xl p-5">
    <lucide:fingerprint class="text-3xl mb-3 color-#f291a5" />
    <p class="font-bold text-lg mb-1">DID 身分系統</p>
    <p class="text-white/60 text-sm">你在去中心化系統上的身分</p>
  </div>
  <div v-click="[2, 3]" class="border border-white/20 rounded-xl p-5">
    <lucide:hard-drive class="text-3xl mb-3 color-#f291a5" />
    <p class="font-bold text-lg mb-1">PDS 個人資料伺服器</p>
    <p class="text-white/60 text-sm">你在 AT Protocol 的家</p>
  </div>
  <div v-click="[3, 4]" class="border border-white/20 rounded-xl p-5">
    <lucide:file-code class="text-3xl mb-3 color-#f291a5" />
    <p class="font-bold text-lg mb-1">Lexicon 結構語言</p>
    <p class="text-white/60 text-sm">定義資料格式與 API</p>
  </div>
  <div v-click="[4, 5]" class="border border-white/20 rounded-xl p-5">
    <lucide:radio class="text-3xl mb-3 color-#f291a5" />
    <p class="font-bold text-lg mb-1">Relay / Firehose</p>
    <p class="text-white/60 text-sm">聚合並轉發所有事件</p>
  </div>
  <div v-click="[5, 6]" class="border border-white/20 rounded-xl p-5">
    <lucide:zap class="text-3xl mb-3 color-#f291a5" />
    <p class="font-bold text-lg mb-1">Jetstream</p>
    <p class="text-white/60 text-sm">輕量級 JSON 事件串流</p>
  </div>
  <div v-click="6" class="border border-white/20 rounded-xl p-5">
    <lucide:layout-dashboard class="text-3xl mb-3 color-#f291a5" />
    <p class="font-bold text-lg mb-1">App View</p>
    <p class="text-white/60 text-sm">索引資料、提供應用 API</p>
  </div>
</div>

---
---

# 今天的目標

<div class="grid grid-cols-4 gap-4 mt-8">
  <div v-click="[1, 2]" class="flex flex-col items-center border border-white/20 rounded-xl p-4">
    <lucide:bot class="text-3xl mb-2" />
    <p class="text-base font-bold text-center">打造 AI<br>聊天機器人</p>
  </div>
  <div v-click="[2, 3]" class="flex flex-col items-center border border-white/20 rounded-xl p-4">
    <lucide:newspaper class="text-3xl mb-2" />
    <p class="text-base font-bold text-center">建立<br>自訂演算法</p>
  </div>
  <div v-click="[3, 4]" class="flex flex-col items-center border border-white/20 rounded-xl p-4">
    <lucide:key-round class="text-3xl mb-2" />
    <p class="text-base font-bold text-center">OAuth<br>驗證</p>
  </div>
  <div v-click="[4, 5]" class="flex flex-col items-center border border-white/20 rounded-xl p-4">
    <lucide:layout-dashboard class="text-3xl mb-2" />
    <p class="text-base font-bold text-center">迷你<br>社交應用</p>
  </div>
</div>

<div class="grid grid-cols-4 gap-4 mt-2 text-md text-white/50 text-center">
  <p v-click="[1, 2]" class="!leading-[2]">監聽提及、串接 AI、<br>自動回覆</p>
  <p v-click="[2, 3]" class="!leading-[2]">篩選貼文、打造個人化<br>動態牆</p>
  <p v-click="[3, 4]" class="!leading-[2]">瀏覽器端安全登入流程</p>
  <p v-click="[4, 5]" class="!leading-[2]">瀏覽河道、發布貼文</p>
</div>

<p v-click="5" class="absolute bottom-18 left-0 right-0 text-center text-white text-2xl">
  使用 <a href="https://github.com/mary-ext/atcute" target="_blank"><span class="color-#f291a5 font-bold">atcute</span></a> - 輕量級 AT Protocol 開發套件
</p>

---
---

# 開發套件比較

<div class="flex gap-6 mt-30">
<div v-click="[1, 2]" class="flex-1 border border-white/20 rounded-xl p-6 text-left">

<div class="flex items-center gap-3 mb-4">
  <h3 class="!text-xl !m-0"><b class="color-blue">@atproto/*</b> <span class="text-base font-normal text-white/50">官方 TypeScript SDK</span></h3>
</div>

<div class="text-lg space-y-4">
<li>一體式套件，依賴較多、套件較大</li>
<li><b>Jetstream: <span class="color-red">官方只有 Go 實作</span></b><br><span class="color-gray">*僅 Ozone 有 TypeScript 實作</span></li>
</div>

</div>
<div v-click="2" class="flex-1 border border-white/20  rounded-xl p-6 text-left">

<div class="flex items-center gap-3 mb-4">
  <h3 class="!text-xl !m-0"><b class="color-purple">@atcute/*</b> <span class="text-base font-normal text-white/50">社群 TypeScript SDK</span></h3>
</div>

<div class="text-lg space-y-4">
<li>按需求引入，較少外部依賴、更為<b class="color-lime">輕量</b></li>
<li>原生 TypeScript Jetstream 客戶端 +<br><span v-mark.box.pink="2">社群 Lexicon 支援</span> (eg, microcosm)</li>
</div>

</div>
</div>

---
---

# Bluesky Bot 是怎麼運作的？

<div class="mt-12 text-left">

<p v-click="[1, 2]" class="text-2xl font-bold color-blue">「監聽事件 → 處理 → 回覆」</p>

<br>
    
<ol class="text-xl space-y-4">
<li v-click="[2, 3]">使用者在 Bluesky 上 <span v-mark.box.pink="2">@mention</span> 你的 Bot</li>
<li v-click="[3, 4]"><span class="color-purple font-bold">Jetstream</span> 即時串流事件到你的程式</li>
<li v-click="[4, 5]">Bot 過濾出<span class="color-orange font-bold">提及自己</span>的貼文，提取文字內容</li>
<li v-click="[5, 6]">呼叫 <span class="color-purple font-bold">AI</span> 生成回覆（Vercel AI SDK）</li>
<li v-click="[6, 7]">透過 <code>createRecord</code> 發布回覆貼文</li>
</ol>

<div v-click="7" class="mt-8 text-lg border-l-2 border-red pl-4">
  Bot 帳號應標記為 Bot，並只回應<b class="color-red">主動提及</b>你的使用者 (opt-in)
</div>

</div>

---
---

# 認證方式：App Password

<div class="flex gap-8 mt-8">
<div class="flex-1 text-left">

### 流程

<div class="space-y-6 mt-4 text-xl">
  <li v-click="[1, 2]"><code>com.atproto.server.createAppPassword</code> → 建立 <span v-mark.box.orange="1">App Password</span><br><span class="color-gray">*可以在 Bluesky 介面操作</span></li>
  <li v-click="[2, 3]"><code>com.atproto.server.createSession</code> → accessToken + refreshToken</li>
  <li v-click="[3, 4]">使用 Token 呼叫 <span class="color-purple font-bold">HTTP API (XRPC)</span></li>
</div>
<br>
<p v-click="4" class="mt-6 text-lg border-l-2 border-red pl-4">App Password 不是帳號的密碼！</p>

</div>
<div class="flex-1">

### 程式碼

```typescript {0|0|7-10|12}
import { Client, CredentialManager }
  from '@atcute/client';

const manager = new CredentialManager({
  service: 'https://bsky.social',
});
await manager.login({
  identifier: 'your.handle',
  password: 'app-password',
});

const rpc = new Client({ handler: manager });
```

</div>
</div>

---
---

# 發文與回覆

<div class="mt-4">

````md magic-move
```typescript
// Create a new post
await rpc.post('com.atproto.repo.createRecord', {
  input: {
    repo: session.did,
    collection: 'app.bsky.feed.post',
    record: {
      $type: 'app.bsky.feed.post',
      text: 'Hello from my bot!',
      createdAt: new Date().toISOString(),
    },
  },
});
```

```typescript
// Reply to a post — add reply field with parent + root
await rpc.post('com.atproto.repo.createRecord', {
  input: {
    repo: session.did,
    collection: 'app.bsky.feed.post',
    record: {
      $type: 'app.bsky.feed.post',
      text: 'Great post!',
      reply: {
        parent: { uri: parentUri, cid: parentCid },
        root: { uri: rootUri, cid: rootCid },
      },
      createdAt: new Date().toISOString(),
    },
  },
});
```
````

</div>

<div v-click class="mt-4 text-white/60 text-base">
  <code>root</code> = 討論串的起點 ｜ <code>parent</code> = 你直接回覆的對象
</div>

---
---

# Rich Text：讓文字更豐富

<div class="flex gap-8 mt-8">
<div class="flex-1">

```typescript
import { RichTextBuilder }
  from '@atcute/bluesky-richtext-builder';

const rt = new RichTextBuilder();

rt.text('Hello ');
rt.mention('alice.bsky.social',
           'did:plc:...');
rt.text('! Check out ');
rt.link('atproto.com',
        'https://atproto.com');
rt.text(' ');
rt.tag('ATProto');

const { text, facets } = rt.build();
```

</div>
<div class="flex-1 text-left">

### Facets

<p class="text-white/60 mb-4">Bluesky 的 Rich Text 編碼</p>

<div class="space-y-3 text-lg">
  <div v-click="[1, 2]" class="border border-white/20 rounded-lg px-4 py-2">
    <code class="color-#f291a5">@mention</code> - 提及其他使用者
  </div>
  <div v-click="[2, 3]" class="border border-white/20 rounded-lg px-4 py-2">
    <code class="color-#f291a5">link</code> - 超連結
  </div>
  <div v-click="3" class="border border-white/20 rounded-lg px-4 py-2">
    <code class="color-#f291a5">#hashtag</code> - 標籤
  </div>
</div>

<p v-click="4" class="mt-4 text-base text-white/50">
  Facets 記錄文字中每個特殊元素的<br>位元組位置和類型
</p>

</div>
</div>

---
---

# 監聽 Jetstream：即時接收事件

<div class="flex gap-8 mt-6">
<div class="flex-1 text-left">

### 回顧

<p class="text-white/60 text-base mb-4">Jetstream 是 Firehose 的輕量 JSON 版本</p>

<div class="space-y-3 text-lg">
  <li><span class="font-bold">JSON</span> 格式，容易解析</li>
  <li>可篩選 <span class="font-bold">collection</span> 和 <span class="font-bold">DID</span></li>
  <li><code>@atcute/jetstream</code> 自動重連</li>
</div>

</div>
<div class="flex-1">

```typescript
import { JetstreamSubscription }
  from '@atcute/jetstream';

// Subscribe to Jetstream
const jetstream = new JetstreamSubscription({
  url: 'wss://jetstream1.us-east'
    + '.bsky.network/subscribe',
  wantedCollections: ['app.bsky.feed.post'],
});

// Async iterator — auto-reconnects!
for await (const event of jetstream) {
  if (event.kind !== 'commit') continue;
  if (event.commit.operation !== 'create')
    continue;

  const post = event.commit.record;
  console.log(post.text);
}
```

</div>
</div>

---
---

# 加入 AI：用 Vercel AI SDK 生成回覆

<div class="mt-2">

```typescript
import { generateText } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

// OpenAI-compatible: works with OpenRouter, OpenAI, Ollama...
const provider = createOpenAICompatible({
  name: 'ai-provider',
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL
    || 'https://openrouter.ai/api/v1',
});

const { text: reply } = await generateText({
  model: provider(process.env.AI_MODEL
    || 'google/gemini-3-flash-preview'),
  system: 'You are a friendly bot. Reply concisely.',
  prompt: mentionText,
});
```

</div>

<div v-click class="mt-6 text-center text-xl">
  <span class="font-bold">Jetstream 監聽</span> + <span class="font-bold">AI </span> + <span class="font-bold">XRPC 發文</span> = <span class="color-orange font-bold">Agent Account</span>
</div>

---
---

# Bot 架構總覽

<div class="flex flex-col items-center justify-center h-[80%]">

<div class="flex items-center gap-4 text-xl">
  <div v-click="[1, 2]" class="border border-white/20 rounded-xl px-6 py-5 text-center">
    <p class="font-bold text-2xl">Jetstream</p>
    <p class="text-base text-white/60 mt-1">即時事件串流</p>
  </div>
  <span v-click="[2, 3]" class="text-2xl text-white/30">→</span>
  <div v-click="[2, 3]" class="border border-white/20 rounded-xl px-6 py-5 text-center">
    <p class="font-bold text-2xl">過濾提及</p>
    <p class="text-base text-white/60 mt-1">偵測 @mention</p>
  </div>
  <span v-click="[3, 4]" class="text-2xl text-white/30">→</span>
  <div v-click="[3, 4]" class="border border-white/20 rounded-xl px-6 py-5 text-center">
    <p class="font-bold text-2xl">AI 生成</p>
    <p class="text-base text-white/60 mt-1">Vercel AI SDK</p>
  </div>
  <span v-click="4" class="text-2xl text-white/30">→</span>
  <div v-click="4" class="border border-#f291a5/50 rounded-xl px-6 py-5 text-center">
    <p class="font-bold text-2xl color-#f291a5">發布回覆</p>
    <p class="text-base text-white/60 mt-1">createRecord</p>
  </div>
</div>

</div>

---
---

# Workshop：打造你的 AI Bot

<div class="flex gap-8 mt-6">
<div class="flex-1 text-left">

### 步驟

<div class="space-y-5 text-xl mt-4">
  <li>設定環境：<code>.env</code> + <span class="color-orange font-bold">App Password</span></li>
  <li>用 <code>publish-post</code> 發布第一則貼文</li>
  <li>啟動 <span class="color-purple font-bold">Jetstream</span> 監聽</li>
  <li>串接 <span class="font-bold">AI</span> 回覆，測試你的 Bot！</li>
</div>

<div class="mt-6 text-base text-white/50 border-l-2 border-white/20 pl-4">
  作業：修改 system prompt 打造你的 Bot 人設，<br>並選擇一個延伸功能實作
</div>

</div>
<div class="flex-1">

### 啟動

```bash
cd 1-agent
cp .env.example .env
# 填入你的設定

pnpm install
pnpm dev
```

<p class="mt-4 text-white/60">
  <lucide:folder class="inline-block align-text-bottom mr-1" /> 專案目錄：<code>1-agent/</code>
</p>

<div class="mt-3 border border-white/20 rounded-lg px-3 py-2">
  <carbon:logo-github class="inline-block align-text-bottom mr-1" /> 想要作業指導？到 <a href="https://discord.gg/GPBJPshrBU" target="_blank">Discord</a> 取得 GitHub Classroom 連結（非必要）
</div>

</div>
</div>

---
---

# 什麼是 Feed Generator？

<div class="mt-8 text-left">

<p class="text-2xl text-white/60 mb-10">Feed = 自訂演算法，決定 Bluesky 河道顯示什麼貼文</p>

<div class="space-y-7 text-2xl">
  <li v-click="[1, 2]">使用者在 Bluesky 中<span v-mark.underline.pink="1">訂閱你的 Feed</span></li>
  <li v-click="[2, 3]">Bluesky 向你的服務發送 <code>getFeedSkeleton</code> 請求</li>
  <li v-click="[3, 4]">你的演算法決定回傳哪些<span v-mark.underline.lime="3">貼文 URI</span></li>
  <li v-click="4">Bluesky 填充完整內容並顯示給使用者</li>
</div>

</div>

---
---

# Feed Generator 架構

<div class="mt-12 text-left">

<p v-click="[1, 2]" class="text-2xl font-bold color-blue">「索引 → 篩選 → 回傳 URI」</p>

<br>
    
<div class="text-xl space-y-5">
<li v-click="[2, 3]"><span class="color-purple font-bold">Jetstream</span> 串流全網的即時事件到你的服務</li>
<li v-click="[3, 4]">索引器篩選符合條件的貼文，存入 <span class="font-bold">SQLite</span></li>
<li v-click="[4, 5]"><code>getFeedSkeleton</code> 回傳貼文 <span v-mark.underline.pink="3">URI 清單</span></li>
<li v-click="5">Bluesky <span class="color-purple font-bold">App View</span> 負責渲染完整內容 (hydration)</li>
</div>

<p v-click="5" class="mt-8 text-xl text-white/60">你只需要回傳 URI — Bluesky 負責渲染</p>

</div>

---
---

# 兩個關鍵 Endpoint

<div class="flex gap-6 mt-6">
<div class="flex-1 text-left">

### describeFeedGenerator

<p class="text-white/60 text-base mb-3">描述你的服務提供哪些 Feed</p>

```json
{
  "did": "did:web:my-feed.example.com",
  "feeds": [{
    "uri": "at://did:plc:.../
            app.bsky.feed.generator/
            my-cool-feed"
  }]
}
```

</div>
<div class="flex-1 text-left">

### getFeedSkeleton

<p class="text-white/60 text-base mb-3">關鍵部分，回傳符合演算法的貼文清單</p>

```json
{
  "cursor": "1710000000000",
  "feed": [
    {
      "post": "at://did:plc:.../
              app.bsky.feed.post/abc123"
    },
    {
      "post": "at://did:plc:.../
              app.bsky.feed.post/def456"
    }
  ]
}
```

</div>
</div>

---
---

# Jetstream 事件結構：Like 事件

<div class="flex gap-8 mt-8">
<div class="flex-1 text-left">

### Post 事件

```typescript
// collection: app.bsky.feed.post
event.commit.record = {
  text: 'Hello world!',
  createdAt: '2025-03-20T...',
}
// event.did = 發文者的 DID
```

</div>
<div class="flex-1 text-left">

### Like 事件

```typescript
// collection: app.bsky.feed.like
event.commit.record = {
  subject: {
    uri: 'at://did:plc:.../post/...',
    cid: 'bafyrei...',
  },
  createdAt: '2025-03-20T...',
}
// event.did = 按讚者的 DID
```

</div>
</div>

<div v-click class="mt-6 text-xl text-center border border-white/30 rounded-xl px-4 py-2">
  不同 collection 的 record 結構不同 — <code>event.did</code> 是執行動作的人
</div>

---
---

# Backfill：補回歷史資料

<div class="mt-8 text-left">

<p class="text-2xl text-white/60 mb-10">Jetstream 只串流即時事件 — 啟動前的資料需要另外補回</p>

<div class="space-y-8 text-2xl">
  <li v-click="[1, 2]">確定目標 DID 清單（先 <span v-mark.underline.orange="1"><code>resolveHandle</code></span> 轉換）</li>
  <li v-click="[2, 3]">呼叫 <span v-mark.underline.purple="2"><code>getActorLikes</code></span> 取得每個人的按讚記錄</li>
  <li v-click="[3, 4]">將按讚的貼文 URI <span v-mark.underline.lime="3">存入資料庫</span></li>
  <li v-click="4">啟動 Jetstream 監聽新的 like 事件</li>
</div>

</div>

---
---

# Microcosm Constellation

<div class="flex gap-8 mt-4">
<div class="flex-1 text-left">

<p class="text-white/60 mb-4">社群維護的 AT Protocol 全網反向連結資料</p>

<div class="space-y-3 text-lg">
  <li>查詢任何貼文的<span class="color-orange font-bold">按讚、回覆、轉發數</span></li>
  <li><code>@atcute/microcosm</code> <span class="color-blue font-bold">提供 TypeScript 型別</span></li>
  <li>同一個 <code>Client</code> 模式！</li>
</div>

</div>
<div class="flex-1">

```typescript
import { Client, simpleFetchHandler }
  from '@atcute/client';
import type {} from '@atcute/microcosm';

const constellation = new Client({
  handler: simpleFetchHandler({
    service:
      'https://constellation.microcosm.blue',
  }),
});

const { data } = await constellation.get(
  'blue.microcosm.links.getBacklinksCount',
  { params: {
      subject: postUri,
      sourceType: 'like',
  } },
);
console.log(data.count); // like count!
```

</div>
</div>

---
---

# 演算法範例

<div class="grid grid-cols-2 gap-5 mt-8 text-left">
  <div v-click="[1, 2]" class="border border-white/20 rounded-xl p-5">
    <div class="flex items-center gap-3 mb-2">
      <lucide:hash class="text-2xl color-#f291a5" />
      <p class="font-bold text-xl">關鍵字篩選</p>
    </div>
    <p class="text-white/60 !leading-[2]">包含特定 hashtag 或關鍵字的貼文</p>
  </div>
  <div v-click="[2, 3]" class="border border-white/20 rounded-xl p-5">
    <div class="flex items-center gap-3 mb-2">
      <lucide:users class="text-2xl color-#f291a5" />
      <p class="font-bold text-xl">社群聚合</p>
    </div>
    <p class="text-white/60 !leading-[2]">聚合特定群組成員的貼文<br><span class="font-bold color-orange">(eg, VTuber 社社員追蹤的人的貼文)</span></p>
  </div>
  <div v-click="[3, 4]" class="border border-white/20 rounded-xl p-5">
    <div class="flex items-center gap-3 mb-2">
      <lucide:trending-up class="text-2xl color-#f291a5" />
      <p class="font-bold text-xl">互動排序</p>
    </div>
    <p class="text-white/60 !leading-[2]">依照按讚數、回覆數排序</p>
  </div>
  <div v-click="4" class="border border-white/20 rounded-xl p-5">
    <div class="flex items-center gap-3 mb-2">
      <lucide:languages class="text-2xl color-#f291a5" />
      <p class="font-bold text-xl">語言篩選</p>
    </div>
    <p class="text-white/60 !leading-[2]">只顯示特定語言的貼文</p>
  </div>
</div>

---
---

# 用 Jetstream 索引貼文

```typescript {all|1-6|8-17|19-22}
import { JetstreamSubscription } from '@atcute/jetstream';

const jetstream = new JetstreamSubscription({
  url: 'wss://jetstream1.us-east.bsky.network/subscribe',
  wantedCollections: ['app.bsky.feed.post'],
});

for await (const event of jetstream) {
  if (event.kind !== 'commit') continue;
  const { operation, rkey } = event.commit;
  // Check if the post contains our target hashtag
  if (operation === 'create'
    && (event.commit.record as any).text?.includes('#VTuber')) {
    const uri = `at://${event.did}/app.bsky.feed.post/${rkey}`;
    db.prepare('INSERT OR IGNORE INTO posts (uri, cid, indexed_at) VALUES (?, ?, ?)')
      .run(uri, event.commit.cid, Date.now());
  }
}

// Serve the feed
app.get('/xrpc/app.bsky.feed.getFeedSkeleton', (c) => {
  const rows = db.prepare('SELECT uri FROM posts ORDER BY indexed_at DESC LIMIT ?').all(limit);
  return c.json({ feed: rows.map((r) => ({ post: r.uri })) });
});
```

---
---

# Workshop：建立你的 Custom Feed

<div class="flex gap-8 mt-6">
<div class="flex-1 text-left">

### 步驟

<div class="space-y-5 text-xl mt-4">
  <li>設定環境與<span class="color-orange font-bold">篩選關鍵字</span></li>
  <li>啟動 <span class="color-purple font-bold">Jetstream</span> 索引器</li>
  <li>建立 <code>getFeedSkeleton</code> endpoint</li>
  <li>發布你的 Feed 到 <span class="color-blue font-bold">Bluesky</span>！</li>
</div>

<div class="mt-6 text-base text-white/50 border-l-2 border-white/20 pl-4">
  作業：建立一個聚合特定人按讚貼文的 Feed，<br>含 backfill 與 like 事件監聽
</div>

</div>
<div class="flex-1">

### 啟動

```bash
cd 2-custom-feed
cp .env.example .env
# 填入你的設定

pnpm install
pnpm dev

# 測試 endpoint
curl localhost:3000/xrpc/\
  app.bsky.feed.getFeedSkeleton
```

<p class="mt-3 text-white/60">
  <lucide:folder class="inline-block align-text-bottom mr-1" /> 專案目錄：<code>2-custom-feed/</code>
</p>

<div class="mt-2 border border-white/20 rounded-lg px-3 py-2">
  <carbon:logo-github class="inline-block align-text-bottom mr-1" /> 想要作業指導？到 <a href="https://discord.gg/GPBJPshrBU" target="_blank">Discord</a> 取得 GitHub Classroom 連結（非必要）
</div>

</div>
</div>

---
---

# 自訂 Lexicon 實戰

<div class="flex gap-6 mt-4">
<div class="flex-1 text-left">

### 定義你的資料結構

```json
{
  "lexicon": 1,
  "id": "com.example.nekosky.saved.folder",
  "defs": {
    "main": {
      "type": "record",
      "key": "tid",
      "record": {
        "type": "object",
        "required": ["name", "createdAt"],
        "properties": {
          "name": { "type": "string" },
          "createdAt": {
            "type": "string",
            "format": "datetime"
          }
        }
      }
    }
  }
}
```

</div>
<div class="flex-1 text-left">

### Record CRUD

<div class="space-y-3 mt-4 text-base">
  <div class="border border-white/20 rounded-lg px-3 py-2">
    <code class="color-#f291a5">createRecord</code> — 新增一筆記錄
  </div>
  <div class="border border-white/20 rounded-lg px-3 py-2">
    <code class="color-#f291a5">listRecords</code> — 列出 collection 中的所有記錄
  </div>
  <div class="border border-white/20 rounded-lg px-3 py-2">
    <code class="color-#f291a5">putRecord</code> — 建立或更新（upsert）
  </div>
  <div class="border border-white/20 rounded-lg px-3 py-2">
    <code class="color-#f291a5">deleteRecord</code> — 刪除記錄
  </div>
  <div class="border border-white/20 rounded-lg px-3 py-2">
    <code class="color-#f291a5">getRecord</code> — 讀取單筆記錄
  </div>
</div>

</div>
</div>

---
---

# 為什麼需要 OAuth？

<div class="flex gap-8 mt-8">
<div class="flex-1 text-left">

### App Password

<div class="space-y-5 mt-6 text-xl">
  <li>適合<span class="font-bold">伺服器端</span> Bot / 服務</li>
  <li>直接使用帳號密碼登入</li>
  <li class="text-white/60">不適合給使用者在瀏覽器中輸入</li>
</div>

</div>
<div class="flex-1 text-left">

### OAuth

<div class="space-y-5 mt-6 text-xl">
  <li>適合<span class="color-orange font-bold">使用者端</span>應用程式</li>
  <li>使用者在自己的 PDS 上授權</li>
  <li>PKCE + DPoP - <span class="color-lime font-bold">atcute 幫你處理</span></li>
  <li v-click>開發時<span v-mark.underline.orange="1">不需要預先註冊</span> client</li>
</div>

</div>
</div>

---
---

# OAuth 登入流程

<div class="mt-10 text-left space-y-8 text-2xl">
  <li v-click="[1, 2]">輸入 Handle — <span v-mark.underline.orange="1"><code class="text-base">resolveHandle</code></span> 解析身分</li>
  <li v-click="[2, 3]">導向使用者的 PDS 進行授權 — <span v-mark.underline.purple="2"><code class="text-base">createAuthorizationUrl</code></span></li>
  <li v-click="[3, 4]">Callback 回傳授權碼 — <span v-mark.underline.lime="3"><code class="text-base">finalizeAuthorization</code></span></li>
  <li v-click="4">取得 Session — 已登入，可呼叫 API</li>
</div>

<p v-click="5" class="text-white/60 text-lg mt-8 text-center">整個流程由 <code>@atcute/oauth-browser-client</code> 幫你完成</p>

---
---

# OAuth 程式碼

<div class="relative h-[78%] mt-2">

<div v-click="[1, 2]" class="absolute inset-0">

```typescript
// Step 1: Configure OAuth — loopback client, no registration!
import { configureOAuth, createAuthorizationUrl,
  finalizeAuthorization, OAuthUserAgent }
  from '@atcute/oauth-browser-client';

configureOAuth({
  metadata: {
    client_id: 'http://localhost?redirect_uri=...',
    redirect_uri: 'http://localhost:5173/callback',
  },
  identityResolver, // resolves handles → DIDs
});
```

</div>

<div v-click="[2, 3]" class="absolute inset-0">

```typescript
// Step 2: Start login — redirect to PDS for authorization
async function login(handle: string) {
  const authUrl = await createAuthorizationUrl({
    target: { type: 'account', identifier: handle },
    scope: 'atproto transition:generic',
  });

  window.location.assign(authUrl); // redirect!
}
```

</div>

<div v-click="3" class="absolute inset-0">

```typescript
// Step 3: Handle callback — exchange code for session
const params = new URLSearchParams(location.search);
const { session } = await finalizeAuthorization(params);
const agent = new OAuthUserAgent(session);

// Use OAuthUserAgent as Client handler!
const rpc = new Client({ handler: agent });

const { data } = await rpc.get('app.bsky.actor.getProfile',
  { params: { actor: agent.sub } },
);
console.log(data.displayName); // your name!
```

</div>

</div>

<style>
.slidev-vclick-hidden {
  opacity: 0 !important;
}
</style>

---
---

# Workshop：OAuth 登入

<div class="flex gap-8 mt-6">
<div class="flex-1 text-left">

### 步驟

<div class="space-y-5 text-xl mt-4">
  <li>設定環境，安裝依賴</li>
  <li>輸入 Handle 進行 <span class="color-purple font-bold">OAuth</span> 登入</li>
  <li>在 <span class="font-bold color-purple">PDS</span> 上授權應用</li>
  <li>觀察 callback → 顯示你的個人資料</li>
</div>

<div class="mt-6 text-base text-white/50 border-l-2 border-white/20 pl-4">
  作業：實作「Saved Posts with Folders」功能，<br>使用自訂 Lexicon + Record CRUD
</div>

</div>
<div class="flex-1">

### 啟動

```bash
cd 3-oauth
pnpm install
pnpm dev
```

<p class="mt-4 text-white/60">
  <lucide:folder class="inline-block align-text-bottom mr-1" /> 專案目錄：<code>3-oauth/</code><br>
  <lucide:globe class="inline-block align-text-bottom mr-1" /> 開啟 <code>http://localhost:5173</code>
</p>

<div class="mt-3 border border-white/20 rounded-lg px-3 py-2">
  <carbon:logo-github class="inline-block align-text-bottom mr-1" /> 想要作業指導？到 <a href="https://discord.gg/GPBJPshrBU" target="_blank">Discord</a> 取得 GitHub Classroom 連結（非必要）
</div>

</div>
</div>

---
---

# 打造迷你社交應用

<div class="flex gap-8 mt-8">
<div class="flex-1 text-left">

### 功能

<div class="space-y-4 mt-4 text-lg">
  <div v-click="[1, 2]" class="flex items-center gap-3">
    <lucide:key-round class="color-#f291a5 shrink-0" />
    <span>OAuth 登入（延伸 Workshop 3）</span>
  </div>
  <div v-click="[2, 3]" class="flex items-center gap-3">
    <lucide:list class="color-#f291a5 shrink-0" />
    <span>瀏覽你的<span v-mark.underline.pink="2">河道</span></span>
  </div>
  <div v-click="3" class="flex items-center gap-3">
    <lucide:send class="color-#f291a5 shrink-0" />
    <span>用<span v-mark.underline.pink="3">自訂 Lexicon</span> 發布貼文</span>
  </div>
</div>

</div>
<div class="flex-1">

### 核心 API

```typescript
// Read timeline
const { data } = await rpc.get(
  'app.bsky.feed.getTimeline',
  { params: { limit: 20 } },
);

// Create post (custom lexicon!)
await rpc.post(
  'com.atproto.repo.createRecord',
  { input: {
      repo: did,
      collection:
        'com.example.nekosky.feed.post',
      record: { $type: '...', text, ... },
  } },
);
```

</div>
</div>

---
---

# Workshop：Mini Social App

<div class="flex gap-8 mt-6">
<div class="flex-1 text-left">

### 步驟

<div class="space-y-5 text-xl mt-4">
  <li>啟動開發伺服器</li>
  <li>使用 <span class="color-purple font-bold">OAuth</span> 登入你的帳號</li>
  <li>瀏覽你的河道</li>
  <li>用<span class="color-purple font-bold">自訂 Lexicon</span> 發布一則貼文！</li>
</div>

<div class="mt-6 text-base text-white/50 border-l-2 border-white/20 pl-4">
  作業：實作 Personal Status 功能，<br>使用 singleton record + putRecord
</div>

</div>
<div class="flex-1">

### 啟動

```bash
cd 4-social-app
pnpm install
pnpm dev
```

<p class="mt-4 text-white/60">
  <lucide:folder class="inline-block align-text-bottom mr-1" /> 專案目錄：<code>4-social-app/</code><br>
  <lucide:globe class="inline-block align-text-bottom mr-1" /> 開啟 <code>http://localhost:5174</code>
</p>

<div class="mt-3 border border-white/20 rounded-lg px-3 py-2">
  <carbon:logo-github class="inline-block align-text-bottom mr-1" /> 想要作業指導？到 <a href="https://discord.gg/GPBJPshrBU" target="_blank">Discord</a> 取得 GitHub Classroom 連結（非必要）
</div>

</div>
</div>

---
---

# 本週回顧 & 延伸想法

<div class="flex gap-8 mt-8">
<div class="flex-1 text-left">

### 今天學到的

<div class="space-y-5 text-xl mt-4">
  <div class="flex items-center gap-3">
    <lucide:bot class="color-#f291a5" />
    <span><span class="color-#f291a5 font-bold">Bot</span> | Jetstream + AI</span>
  </div>
  <div class="flex items-center gap-3">
    <lucide:newspaper class="color-#f291a5" />
    <span><span class="color-#f291a5 font-bold">Feed</span> | 索引 + getFeedSkeleton</span>
  </div>
  <div class="flex items-center gap-3">
    <lucide:key-round class="color-#f291a5" />
    <span><span class="color-#f291a5 font-bold">OAuth</span> | 瀏覽器端安全登入流程</span>
  </div>
  <div class="flex items-center gap-3">
    <lucide:layout-dashboard class="color-#f291a5" />
    <span><span class="color-#f291a5 font-bold">Social App</span> | 河道 + 發文</span>
  </div>
</div>

</div>
<div class="flex-1 text-left">

### 延伸想法

<div class="space-y-5 text-xl mt-4 text-white/80">
  <li>把 VTuber 社社員追蹤的人<br>的貼文聚集起來的 Feed</li>
  <li>類似 BBS 看板的應用</li>
  <li>類似 ActivityPub 的 Group Message</li>
  <li>更複雜的演算法（ML 排序）</li>
</div>

</div>
</div>

---
---

# 本週作業

<div class="mt-8 text-left text-xl space-y-6">

<div class="border border-white/20 rounded-xl p-6">
  <p class="font-bold text-2xl mb-3">選擇一個 Workshop 延伸！</p>
  <div class="space-y-3 text-white/80">
    <li>自訂 Bot 的 AI 人設（修改 System Prompt）</li>
    <li>調整 Feed 的篩選演算法（換一個關鍵字或條件）</li>
    <li>用 OAuth 登入後顯示更多資料（eg, 自己收藏的貼文）</li>
    <li>為 Social App 加入更多功能（eg, 按讚、轉發）</li>
    <li class="color-purple">在 <code>#at-protocol-by-yuna</code> 頻道分享你的成果</li>
  </div>
</div>

</div>

---
---

<img src="./assets/shared/sky.webp" class="absolute inset-0 w-full h-full object-cover -z-2" />
<div class="absolute inset-0 bg-black/50 -z-1" />

<div class="flex flex-col items-center justify-center h-full gap-6">
<img src="./assets/shared/ema-kiang.webp" class="h-[40%] object-contain rounded-xl" />
<h1 class="!text-4xl font-bold">謝謝大家！下週見喵 :3</h1>
</div>

<p class="absolute bottom-4 right-6 text-xs text-white/40">GIF 來源：<a href="https://x.com/hyouenn/status/1990701565305569692" target="_blank">@hyouenn</a></p>
