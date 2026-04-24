---
theme: seriph
title: Link in Bio on AT Protocol
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
Link in Bio on AT Protocol

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
  ema-3: 477,35,320,745,-5
  vtb-logo-3: 298,26,66,66,6
  hiro-3: 648,20,297,713,5
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
    <span class="font-bold text-white/60">03/20</span>
    <span class="text-white/60">實作自己的機器人和演算法！<br>OAuth 驗證和你的第一個社交應用程式</span>
  </div>
  <div class="flex gap-6 py-3">
    <span class="font-bold color-#f291a5">04/24</span>
    <span v-mark.box.pink="1">Link in Bio on AT Protocol</span>
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

<img v-drag="'hiro-3'" src="./assets/shared/Hiro_Arms1_Default.webp" class="w-50" />
<img v-drag="'ema-3'" src="./assets/shared/Ema_ArmR3_ArmL7_Smile.webp" class="w-50" />
<img v-drag="'vtb-logo-3'" src="./assets/shared/nycu_vtb_logo_t.webp" class="w-20" />

---
dragPos:
  sherry-3: 43,181,331,327,-5
  discord-help-3: 365,292,593,68
---

# 有問題想問！？

### 可以在 **<a href="https://discord.gg/GPBJPshrBU">交大 VTuber 社</a>** Discord 伺服器的 <a href="https://discord.com/channels/806901909356412949/1478581760270008474">`#at-protocol-by-yuna`</a> 頻道<br>發問！

<img v-drag="'discord-help-3'" src="./assets/shared/discord-help.webp">

<img v-drag="'sherry-3'" src="./assets/shared/sherry.webp">

---
---

# 上週回顧

<div class="grid grid-cols-2 gap-6 mt-8 text-left">
  <div v-click="[1, 2]" class="border border-white/20 rounded-xl p-5">
    <lucide:bot class="text-3xl mb-3 color-#f291a5" />
    <p class="font-bold text-lg mb-1">Bot + Jetstream</p>
    <p class="text-white/60 text-sm">即時監聽事件 → AI 回覆</p>
  </div>
  <div v-click="[2, 3]" class="border border-white/20 rounded-xl p-5">
    <lucide:newspaper class="text-3xl mb-3 color-#f291a5" />
    <p class="font-bold text-lg mb-1">Custom Feed</p>
    <p class="text-white/60 text-sm">索引 Like 事件 → 自訂演算法</p>
  </div>
  <div v-click="[3, 4]" class="border border-white/20 rounded-xl p-5">
    <lucide:key-round class="text-3xl mb-3 color-#f291a5" />
    <p class="font-bold text-lg mb-1">OAuth 登入</p>
    <p class="text-white/60 text-sm">瀏覽器授權登入（PKCE + DPoP）</p>
  </div>
  <div v-click="4" class="border border-white/20 rounded-xl p-5">
    <lucide:layout-dashboard class="text-3xl mb-3 color-#f291a5" />
    <p class="font-bold text-lg mb-1">Mini Social App</p>
    <p class="text-white/60 text-sm">自訂 Lexicon + 河道 + 發文</p>
  </div>
</div>

---
---

# 今天的目標

<div class="grid grid-cols-4 gap-4 mt-8">
  <div v-click="[1, 2]" class="flex flex-col items-center border border-white/20 rounded-xl p-4">
    <lucide:link class="text-3xl mb-2" />
    <p class="text-base font-bold text-center">Link in Bio<br>SPA</p>
  </div>
  <div v-click="[2, 3]" class="flex flex-col items-center border border-white/20 rounded-xl p-4">
    <lucide:file-code class="text-3xl mb-2" />
    <p class="text-base font-bold text-center">兩個<br>自訂 Lexicon</p>
  </div>
  <div v-click="[3, 4]" class="flex flex-col items-center border border-white/20 rounded-xl p-4">
    <lucide:shield-check class="text-3xl mb-2" />
    <p class="text-base font-bold text-center">最小<br> OAuth Scope</p>
  </div>
  <div v-click="[4, 5]" class="flex flex-col items-center border border-white/20 rounded-xl p-4">
    <lucide:palette class="text-3xl mb-2" />
    <p class="text-base font-bold text-center">自訂<br>色彩主題</p>
  </div>
</div>

<div class="grid grid-cols-4 gap-4 mt-2 text-md text-white/50 text-center">
  <p v-click="[1, 2]" class="!leading-[2]">Profile + Links<br>資料在你的 PDS</p>
  <p v-click="[2, 3]" class="!leading-[2]">Singleton + Collection<br>同時練習兩種 pattern</p>
  <p v-click="[3, 4]" class="!leading-[2]">只要最小權限，<br>不要 transition:generic</p>
  <p v-click="[4, 5]" class="!leading-[2]">每個人的頁面都能<br>有自己的風格</p>
</div>

<p v-click="5" class="absolute bottom-18 left-0 right-0 text-center text-white text-2xl">
  最後一堂！把三週學到的東西做成<span class="color-#f291a5 font-bold">你自己的產品</span>
</p>

---
---

# Link in Bio 是什麼？

<div class="flex gap-8 mt-8">
<div class="flex-1 text-left">

### 生活中的例子

<div class="space-y-4 mt-6 text-lg">
  <li>Bluesky / Twitter / Threads bio 裡那個唯一的連結</li>
  <li>點進去會看到一個「<span class="color-#f291a5 font-bold">連結集合頁</span>」</li>
  <li>常見服務：<code>Linktree</code>、<code>lit.link</code>、<code>POTOFU</code></li>
</div>

<div v-click class="mt-8 border-l-2 border-red pl-4 text-base text-white/70">
  資料存在中心化服務 → 你<span class="color-red font-bold">不真的擁有</span>你的連結頁
</div>

</div>
<div class="flex-1 text-left">

### 我們要做什麼？

<div class="space-y-4 mt-6 text-lg">
  <li v-click="[2, 3]">類似的應用程式，但資料存在<span v-mark.box.pink="2">你自己的 PDS</span></li>
  <li v-click="[3, 4]">用自訂 <span class="color-purple font-bold">Lexicon</span> 定義資料格式</li>
  <li v-click="[4, 5]">OAuth 授權後才能寫入</li>
  <li v-click="5">任何人都能<span class="color-lime font-bold">免登入</span>瀏覽你的頁面</li>
</div>

</div>
</div>

---
---

# 已經有人做了！linkat.blue

<div class="flex gap-8 mt-6">
<div class="flex-1 text-left">

### 參考實作

<p class="text-lg mt-4">由日本開發者 <a href="https://github.com/mkizka" target="_blank">mkizka</a> 打造的 Link-in-Bio on AT Protocol</p>

<div class="space-y-3 mt-6 text-base">
  <div class="border border-white/20 rounded-lg px-3 py-2">
    <code class="color-#f291a5">blue.linkat.board</code> — 唯一的 Lexicon<br>
    <span class="text-white/50 text-sm">singleton record，每人一筆</span>
  </div>
  <div class="border border-white/20 rounded-lg px-3 py-2">
    儲存一個陣列：<code>[ { url, text, emoji } ]</code>
  </div>
  <div class="border border-white/20 rounded-lg px-3 py-2">
    公開頁：<code>linkat.blue/{handle}</code>
  </div>
</div>

</div>
<div class="flex-1 text-left">

### 我們的版本

<div class="space-y-3 mt-4 text-base">
  <div class="border border-#f291a5/50 rounded-lg px-3 py-2">
    <b class="color-#f291a5">拆成兩個 Lexicon</b><br>
    <span class="text-white/50 text-sm">練習 singleton + collection 兩種 pattern</span>
  </div>
  <div class="border border-white/20 rounded-lg px-3 py-2">
    <code>com.example.linkinbio.profile</code> — 個人資料（singleton）
  </div>
  <div class="border border-white/20 rounded-lg px-3 py-2">
    <code>com.example.linkinbio.link</code> — 每筆連結一個 record
  </div>
  <div class="border border-white/20 rounded-lg px-3 py-2">
    <b>純前端 SPA</b>，公開頁 <code>#/view/{handle}</code>
  </div>
</div>

</div>
</div>

---
---

# 今天的架構

<div class="flex flex-col items-center justify-center h-[80%]">

<div class="flex items-center gap-4 text-xl">
  <div v-click="[1, 2]" class="border border-white/20 rounded-xl px-5 py-4 text-center">
    <lucide:monitor class="text-3xl mx-auto mb-2" />
    <p class="font-bold text-lg">SPA in Browser</p>
    <p class="text-xs text-white/60 mt-1">Vite + TS</p>
  </div>
  <span v-click="[2, 3]" class="text-2xl text-white/30">⇄</span>
  <div v-click="[2, 3]" class="border border-white/20 rounded-xl px-5 py-4 text-center">
    <lucide:shield class="text-3xl mx-auto mb-2 color-purple" />
    <p class="font-bold text-lg">OAuth</p>
    <p class="text-xs text-white/60 mt-1">@atcute/oauth-browser-client</p>
  </div>
  <span v-click="[2, 3]" class="text-2xl text-white/30">⇄</span>
  <div v-click="[2, 3]" class="border border-#f291a5/50 rounded-xl px-5 py-4 text-center">
    <lucide:hard-drive class="text-3xl mx-auto mb-2 color-#f291a5" />
    <p class="font-bold text-lg color-#f291a5">Your PDS</p>
    <p class="text-xs text-white/60 mt-1">profile + link records</p>
  </div>
</div>

<div v-click="3" class="mt-10 text-lg text-white/70 text-center">
  <lucide:eye class="inline-block color-lime mr-1" /> 任何人 → 透過 <code>resolveHandle</code> → 讀取任意使用者的 PDS<br>
  <span class="text-sm text-white/40">（不需要登入，是真正「公開」的資料）</span>
</div>

<div v-click="4" class="mt-6 text-base text-white/60 text-center">
  <lucide:wrench class="inline-block mr-1" /> Debug 工具：<a href="https://pdsls.dev" target="_blank" class="color-#f291a5 font-bold">pdsls.dev</a>
</div>

</div>

---
---

# Lexicon 快速複習

<div class="flex gap-8 mt-8">
<div class="flex-1 text-left">

### 它是什麼？

<div class="space-y-4 mt-4 text-lg">
  <li><span class="color-purple font-bold">結構定義語言</span></li>
  <li>用 JSON 定義 record 結構 + XRPC 方法</li>
  <li>每個 schema 有唯一 <span class="font-bold">NSID</span>（反轉 domain）</li>
  <li><code>@atcute/lex-cli</code> 從 JSON 生成 TypeScript 型別</li>
</div>

</div>
<div class="flex-1 text-left">

### 兩種 record key 的差別

<div class="space-y-3 mt-4 text-base">
  <div class="border border-white/20 rounded-lg px-3 py-2">
    <code class="color-#f291a5">"key": "literal:self"</code><br>
    <span class="text-white/60 text-sm">每個使用者只有一筆（singleton）</span>
  </div>
  <div class="border border-white/20 rounded-lg px-3 py-2">
    <code class="color-#f291a5">"key": "tid"</code><br>
    <span class="text-white/60 text-sm">時間戳記 ID（可以有很多筆）</span>
  </div>
</div>

<p class="mt-6 text-white/50 text-sm">
  今天兩種都會用到！
</p>

</div>
</div>

---
---

# Lexicon #1：profile.json

```json {all|4-5|6|10-12|13|14-17|18-20}
{
  "lexicon": 1,
  "id": "com.example.linkinbio.profile",
  "defs": { "main": {
    "type": "record",
    "key": "literal:self",
    "record": {
      "type": "object",
      "required": ["createdAt"],
      "properties": {
        "displayName": { "type": "string", "maxGraphemes": 64 },
        "description": { "type": "string", "maxGraphemes": 256 },
        "theme": { "type": "ref", "ref": "#theme" },
        "linkOrder": { "type": "array",
                       "items": { "type": "string", "format": "tid" } },
        "createdAt": { "type": "string", "format": "datetime" },
        "updatedAt": { "type": "string", "format": "datetime" }
      }
    }
  }, "theme": { "type": "object", "properties": {
    "accent": { "type": "string", "minLength": 4, "maxLength": 9 },
    "mode": { "type": "string", "enum": ["dark", "light"] }
  } } }
}
```

<div v-click="6" class="mt-3 text-white/60 text-sm text-center">
  <lucide:list-ordered class="inline-block color-#f291a5 mr-1" /> <code>linkOrder</code> 儲存 link record 的排序，更動排序時只需要 putRecord profile 一次
</div>

---
---

# Lexicon #2：link.json

<div class="flex gap-6 mt-4">
<div class="flex-1">

```json {all|5|9-13}
{
  "lexicon": 1,
  "id": "com.example.linkinbio.link",
  "defs": { "main": {
    "type": "record",
    "key": "tid",
    "record": {
      "type": "object",
      "required": ["url", "title", "createdAt"],
      "properties": {
        "url":       { "type": "string", "format": "uri" },
        "title":     { "type": "string", "minLength": 1 },
        "emoji":     { "type": "string", "maxGraphemes": 1 },
        "createdAt": { "type": "string", "format": "datetime" }
      }
    }
  } } }
}
```

</div>
<div class="flex-1 text-left">

### 每筆 link 一個 record

<div class="space-y-3 mt-4 text-base">
  <div class="border border-white/20 rounded-lg px-3 py-2">
    <code class="color-#f291a5">createRecord</code> → 新增 link
  </div>
  <div class="border border-white/20 rounded-lg px-3 py-2">
    <code class="color-#f291a5">listRecords</code> → 列出所有 link
  </div>
  <div class="border border-white/20 rounded-lg px-3 py-2">
    <code class="color-#f291a5">deleteRecord</code> → 刪除
  </div>
</div>

<p v-click class="mt-6 text-white/60 text-sm">
  排序交給 profile 的<br><code>linkOrder</code> 陣列管理
</p>

</div>
</div>

---
---

# 兩種 Pattern 對照

<div class="grid grid-cols-2 gap-6 mt-6">
  <div v-click="[1, 2]" class="border border-white/20 rounded-xl p-5">
    <div class="flex items-center gap-3 mb-3">
      <lucide:user class="text-2xl color-#f291a5" />
      <h3 class="!m-0">Profile (Singleton)</h3>
    </div>
    <p class="text-sm text-white/60 mb-3">一個使用者 = 一筆 record</p>
    <div class="space-y-2 text-sm">
      <div><code class="color-#f291a5">putRecord</code> <span class="text-white/50">→ 建立或更新（upsert）</span></div>
      <div><code class="color-#f291a5">getRecord</code> <span class="text-white/50">→ 讀取 rkey "self"</span></div>
    </div>
    <p class="mt-3 text-xs text-white/50">Workshop 4 的 <code>status</code> 也是這個 pattern</p>
  </div>

  <div v-click="2" class="border border-white/20 rounded-xl p-5">
    <div class="flex items-center gap-3 mb-3">
      <lucide:list class="text-2xl color-#f291a5" />
      <h3 class="!m-0">Links (Collection)</h3>
    </div>
    <p class="text-sm text-white/60 mb-3">一個使用者 = 多筆 record（tid rkey）</p>
    <div class="space-y-2 text-sm">
      <div><code class="color-#f291a5">createRecord</code> <span class="text-white/50">→ 新增（server 產生 rkey）</span></div>
      <div><code class="color-#f291a5">listRecords</code> <span class="text-white/50">→ 列出所有</span></div>
      <div><code class="color-#f291a5">deleteRecord</code> <span class="text-white/50">→ 刪除指定 rkey</span></div>
    </div>
    <p class="mt-3 text-xs text-white/50">Workshop 3 的 <code>saved.folder</code> 也是這個 pattern</p>
  </div>
</div>

<p v-click="3" class="mt-6 text-center text-lg">
  同一個 app 裡兩種都出現 = 你已經掌握 <span class="color-#f291a5 font-bold">atproto record CRUD</span> 的完整工具箱
</p>

---
---

# Record CRUD 實戰（1/2）寫入

<div class="mt-4">

````md magic-move
```typescript
// putRecord: profile (singleton, rkey: "self")
await rpc.post('com.atproto.repo.putRecord', {
  input: {
    repo: did,
    collection: 'com.example.linkinbio.profile',
    rkey: 'self',
    record: {
      $type: 'com.example.linkinbio.profile',
      displayName, description, theme,
      createdAt,
      updatedAt: new Date().toISOString(),
    },
  },
});
```

```typescript
// createRecord: link (server 產生 tid rkey)
await rpc.post('com.atproto.repo.createRecord', {
  input: {
    repo: did,
    collection: 'com.example.linkinbio.link',
    record: {
      $type: 'com.example.linkinbio.link',
      url, title, emoji,
      createdAt: new Date().toISOString(),
    },
  },
});
```
````

</div>

<div v-click class="mt-4 text-center text-white/60 text-sm">
  <code>putRecord</code> 指定 <code>rkey</code>（upsert）｜<code>createRecord</code> 讓 server 產生 tid
</div>

---
---

# Record CRUD 實戰（2/2）讀取與刪除

<div class="mt-4">

````md magic-move
```typescript
// listRecords: 讀出 collection 的所有 record
const result = await rpc.get('com.atproto.repo.listRecords', {
  params: {
    repo: did,
    collection: 'com.example.linkinbio.link',
    limit: 100,
  },
});
if (result.ok) {
  for (const r of result.data.records) {
    console.log(r.uri, r.value);
  }
}
```

```typescript
// deleteRecord: 用 rkey 指定要刪的 record
await rpc.post('com.atproto.repo.deleteRecord', {
  input: {
    repo: did,
    collection: 'com.example.linkinbio.link',
    rkey,
  },
});
```
````

</div>

<div v-click class="mt-4 text-center text-white/60 text-sm">
  讀取自己的 record <span class="color-lime font-bold">不需要 scope</span>｜刪除需要 <code>action=delete</code>
</div>

---
---

# OAuth Scope：只請求最小權限

<div class="mt-4 text-left">

<p class="text-lg text-white/70">這個 app 只需要什麼權限？</p>

<div class="mt-6 space-y-3 text-base">
  <div v-click="[1, 2]" class="border border-white/20 rounded-lg px-4 py-3 flex items-center gap-4">
    <code class="color-#f291a5 font-bold text-lg">atproto</code>
    <span class="text-white/80">啟用 atproto OAuth profile，所有 session 必需</span>
  </div>
  <div v-click="[2, 3]" class="border border-white/20 rounded-lg px-4 py-3 flex items-start gap-4">
    <code class="color-#f291a5 font-bold shrink-0">repo:linkinbio.profile?action=...</code>
    <span class="text-white/80">只能寫入 <b>profile</b> 這個 collection</span>
  </div>
  <div v-click="[3, 4]" class="border border-white/20 rounded-lg px-4 py-3 flex items-start gap-4">
    <code class="color-#f291a5 font-bold shrink-0">repo:linkinbio.link?action=...</code>
    <span class="text-white/80">只能寫入 <b>link</b> 這個 collection</span>
  </div>
</div>

<div v-click="[4, 5]" class="mt-6 border-l-2 border-lime pl-4 text-sm text-white/70">
  <lucide:check class="inline-block color-lime mr-1" /> 顯示使用者頭像需要 <code>app.bsky.actor.profile</code> 資料，我們透過公開的 <code>public.api.bsky.app</code> AppView 讀取，不需要額外授權或驗證。
</div>

<div v-click="5" class="mt-3 border-l-2 border-red pl-4 text-sm text-white/60">
  對照 <code>transition:generic</code> 會授權寫入 repo <b class="color-red">所有的</b> collection。<br>
  我們只請求真正需要的東西。<a href="https://atproto.com/specs/permission" target="_blank">atproto.com/specs/permission</a>
</div>

</div>

---
---

# OAuth Client Metadata

<div class="flex gap-6 mt-4">
<div class="flex-1">

```json {all|1|2-5|6|7-8|9-11}
{
  "client_id": "https://your-app.example.com/oauth-client-metadata.json",
  "client_name": "Link in Bio",
  "client_uri": "https://your-app.example.com",
  "redirect_uris": ["https://your-app.example.com/callback"],
  "scope": "atproto repo:... rpc:...",
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code"],
  "application_type": "web",
  "token_endpoint_auth_method": "none",
  "dpop_bound_access_tokens": true
}
```

</div>
<div class="flex-1 text-left">

### Public SPA 的必填欄位

<div class="space-y-2 mt-4 text-sm">
  <li><code>client_id</code> = JSON 自己的公開 URL</li>
  <li><code>redirect_uris</code> 都用 HTTPS</li>
  <li><code>scope</code> 必須包含 <code>atproto</code></li>
  <li><code>token_endpoint_auth_method: "none"</code><br><span class="text-white/50 text-xs">public client，沒有 secret</span></li>
  <li><code>dpop_bound_access_tokens: true</code></li>
  <li><span class="text-white/50">不需要 <code>jwks_uri</code>（那是 confidential client 才用的）</span></li>
</div>

<p v-click class="mt-4 text-white/60 text-sm">
  專案把 JSON 放在 <code>public/oauth-client-metadata.json</code>，Vite 會原樣從網站根目錄提供。
</p>

</div>
</div>

---
---

# 開發時怎麼辦？Loopback 魔法

<div class="mt-4">

````md magic-move
```ts
// Naive attempt: atproto OAuth rejects real http://localhost as origin
configureOAuth({
  metadata: {
    client_id: 'http://localhost:5175/client-metadata.json',
    redirect_uri: 'http://localhost:5175/callback',
  },
});
```

```ts
// Loopback form: "localhost" inside client_id is a magic keyword,
// PDS synthesizes virtual metadata from the query string (no hosted JSON)
const DEV_REDIRECT = 'http://127.0.0.1:5175/callback';
const DEV_CLIENT_ID =
  `http://localhost/?redirect_uri=${encodeURIComponent(DEV_REDIRECT)}` +
  `&scope=${encodeURIComponent(SCOPE)}`;

configureOAuth({
  metadata: { client_id: DEV_CLIENT_ID, redirect_uri: DEV_REDIRECT },
  identityResolver,
});
// Vite server actually binds to 127.0.0.1:5175, not localhost
```
````

</div>

<div v-click class="mt-4 border-l-2 border-orange pl-4 text-sm text-white/70">
  <lucide:alert-triangle class="inline-block color-orange mr-1" /> 瀏覽器一定要開 <code>http://127.0.0.1:5175</code>，不是 <code>localhost</code>！<br>
  <span class="text-xs text-white/50">client_id 裡那個 "localhost" 是 PDS 辨識的關鍵字，不是你要連的 hostname</span>
</div>

---
---

# Handle → DID → PDS：公開檢視是怎麼運作的

```typescript {0|1-10|12-17|19-22}
import { LocalActorResolver, CompositeHandleResolver,
  WellKnownHandleResolver, DohJsonHandleResolver,
  CompositeDidDocumentResolver, PlcDidDocumentResolver,
  WebDidDocumentResolver } from '@atcute/identity-resolver';

const resolver = new LocalActorResolver({
  handleResolver: new CompositeHandleResolver({
    methods: { http: new WellKnownHandleResolver(),
               dns: new DohJsonHandleResolver({ dohUrl: '...' }) }}),
  didDocumentResolver: new CompositeDidDocumentResolver({ /* plc + web */ }),
});

// #/view/bsky.app 路由觸發：
const { did, handle, pds } = await resolver.resolve('bsky.app');
// { did: 'did:plc:...',
//   handle: 'bsky.app',
//   pds: 'https://puffball.us-east.host.bsky.network' }

// 建立無登入的 XRPC client，並輸入對方的 PDS
import { Client, simpleFetchHandler } from '@atcute/client';
const publicRpc = new Client({ handler: simpleFetchHandler({ service: pds }) });
const links = await publicRpc.get('com.atproto.repo.listRecords', {...});
```

<div v-click class="mt-3 text-center text-base text-white/70">
  <span class="color-lime font-bold">不需要登入</span>就能看別人的 Link in Bio
</div>

---
---

# 我們要用的 atcute 套件

<div class="grid grid-cols-2 gap-4 mt-6 text-sm">
  <div v-click="[1, 2]" class="border border-white/20 rounded-lg p-3">
    <code class="color-#f291a5 font-bold">@atcute/oauth-browser-client</code>
    <p class="text-white/60 mt-1">PKCE + DPoP + IndexedDB session</p>
  </div>
  <div v-click="[2, 3]" class="border border-white/20 rounded-lg p-3">
    <code class="color-#f291a5 font-bold">@atcute/identity-resolver</code>
    <p class="text-white/60 mt-1">handle → DID → PDS</p>
  </div>
  <div v-click="[3, 4]" class="border border-white/20 rounded-lg p-3">
    <code class="color-#f291a5 font-bold">@atcute/client</code>
    <p class="text-white/60 mt-1"><code>Client</code> + <code>simpleFetchHandler</code></p>
  </div>
  <div v-click="[4, 5]" class="border border-white/20 rounded-lg p-3">
    <code class="color-#f291a5 font-bold">@atcute/atproto</code> + <code class="color-#f291a5 font-bold">@atcute/bluesky</code>
    <p class="text-white/60 mt-1">型別定義（<code>import type</code> 就會註冊）</p>
  </div>
  <div v-click="[5, 6]" class="border border-white/20 rounded-lg p-3">
    <code class="color-#f291a5 font-bold">@atcute/lex-cli</code>
    <p class="text-white/60 mt-1">從 JSON lexicon 生成 TypeScript 型別</p>
  </div>
  <div v-click="[6, 7]" class="border border-white/20 rounded-lg p-3">
    <code class="color-#f291a5 font-bold">@atcute/lexicons</code>
    <p class="text-white/60 mt-1">基礎型別（<code>Did</code>、<code>Handle</code>）</p>
  </div>
</div>

<br>
<p v-click="7" class="mt-5 text-center text-base text-white/60">
  同一套 SDK 從 Workshop 3 一路用到今天，你應該已經很熟了對..對吧 (￣ω￣)
</p>

---
---

# Workshop：Link in Bio

<div class="flex gap-8 mt-6">
<div class="flex-1 text-left">

### 步驟

<div class="space-y-4 text-xl mt-4">
  <li><code>corepack enable</code>（一次就好）</li>
  <li><code>pnpm install</code> + <code>pnpm lex:generate</code></li>
  <li><span class="color-purple font-bold">OAuth</span> 登入你的 Bluesky 帳號</li>
  <li>設定 profile + 挑一個喜歡的<span class="color-#f291a5 font-bold">顏色</span></li>
  <li>新增幾個 link</li>
  <li>把 <code>#/view/yourhandle</code> 分享給朋友！</li>
</div>

<div class="mt-4 text-base text-white/50 border-l-2 border-white/20 pl-4">
  延伸：部署到 Cloudflare Pages，<br>讓你的 Link in Bio 真的公開上線
</div>

</div>
<div class="flex-1">

### 啟動

```bash
cd 5-link-in-bio
corepack enable
pnpm install
pnpm lex:generate
pnpm dev
```

<p class="mt-4 text-white/60">
  <lucide:folder class="inline-block align-text-bottom mr-1" /> 專案目錄：<code>5-link-in-bio/</code><br>
  <lucide:globe class="inline-block align-text-bottom mr-1" /> 開啟 <code>http://127.0.0.1:5175</code>
</p>

<div class="mt-3 border border-orange/30 rounded-lg px-3 py-2 text-sm text-white/70">
  <lucide:alert-triangle class="inline-block align-text-bottom mr-1 color-orange" />
  <b class="color-orange">127.0.0.1</b>，不是 <code>localhost</code>！
</div>

<div class="mt-3 border border-white/20 rounded-lg px-3 py-2">
  <carbon:logo-github class="inline-block align-text-bottom mr-1" /> 想要作業指導？到 <a href="https://discord.gg/GPBJPshrBU" target="_blank">Discord</a> 取得 GitHub Classroom 連結（非必要）
</div>

</div>
</div>

---
---

# 程式碼架構

<div class="grid grid-cols-2 gap-3 mt-4 text-sm">
  <div class="border border-white/20 rounded-lg p-3">
    <code class="color-#f291a5">lexicons/com/example/linkinbio/*.json</code>
    <p class="text-white/60 mt-1">兩個 Lexicon 定義（profile + link）</p>
  </div>
  <div class="border border-white/20 rounded-lg p-3">
    <code class="color-#f291a5">src/lib/oauth.ts</code>
    <p class="text-white/60 mt-1">OAuth + Scope 常數 + <code>login/handleCallback/resumeSession/logout</code></p>
  </div>
  <div class="border border-white/20 rounded-lg p-3">
    <code class="color-#f291a5">src/lib/public.ts</code>
    <p class="text-white/60 mt-1"><code>resolveActor</code> + <code>publicClient</code> 給公開檢視用</p>
  </div>
  <div class="border border-white/20 rounded-lg p-3">
    <code class="color-#f291a5">src/linkinbio.ts</code>
    <p class="text-white/60 mt-1">Record CRUD：<code>getProfile</code> / <code>putProfile</code> / <code>addLink</code> / <code>listLinks</code> / <code>deleteLink</code></p>
  </div>
  <div class="border border-white/20 rounded-lg p-3">
    <code class="color-#f291a5">src/main.ts</code>
    <p class="text-white/60 mt-1">Router（editor / callback / view / login）+ UI wiring</p>
  </div>
  <div class="border border-white/20 rounded-lg p-3">
    <code class="color-#f291a5">public/oauth-client-metadata.json</code>
    <p class="text-white/60 mt-1">正式部署時的 metadata 範本（dev 用 loopback）</p>
  </div>
</div>

<p class="mt-4 text-center text-base text-white/60">
  主要都透過 atcute 來實作和 AT Protocol 互動的邏輯！
</p>

---
---

# 用 PDSls 驗證你的資料

<div class="flex gap-8 mt-4">
<div class="flex-1 text-left">

### 為什麼重要？

<div class="space-y-3 mt-4 text-base">
  <li v-click="[1, 2]">確認資料<b class="color-#f291a5">真的</b>寫進你的 PDS</li>
  <li v-click="[2, 3]">看到 raw JSON，你寫出去的 $type / fields 全都對得上</li>
  <li v-click="[3, 4]">別人也能用同樣的 URL 看到你的資料（它本來就是公開的）</li>
  <li v-click="4">未來開發新的 AppView？資料早就在那了</li>
</div>

</div>
<div class="flex-1 text-left">

### URL 格式

<div class="space-y-3 mt-4 text-sm">
  <div class="border border-white/20 rounded-lg px-3 py-2 font-mono">
    pdsls.dev/at://<br>
    &nbsp;&nbsp;did:plc:xxx
  </div>
  <div class="border border-white/20 rounded-lg px-3 py-2 font-mono">
    pdsls.dev/at://<br>
    &nbsp;&nbsp;did:plc:xxx/<br>
    &nbsp;&nbsp;com.example.linkinbio.profile/self
  </div>
  <div class="border border-white/20 rounded-lg px-3 py-2 font-mono">
    pdsls.dev/at://<br>
    &nbsp;&nbsp;did:plc:xxx/<br>
    &nbsp;&nbsp;com.example.linkinbio.link/&lt;tid&gt;
  </div>
</div>

<p class="mt-3 text-white/50 text-sm">
  App 內每筆 record 都有「View on PDSls」按鈕，<br>直接點就會開啟
</p>

</div>
</div>

---
---

# 延伸想法

<div class="grid grid-cols-2 gap-5 mt-8">
  <div v-click="[1, 2]" class="border border-white/20 rounded-xl p-5">
    <lucide:rocket class="text-2xl color-#f291a5 mb-2" />
    <p class="font-bold text-lg mb-1">部署公開上線</p>
    <p class="text-white/60 text-sm">Cloudflare Pages / Netlify：設 env var、改 client_id URL</p>
  </div>
  <div v-click="[2, 3]" class="border border-white/20 rounded-xl p-5">
    <lucide:palette class="text-2xl color-#f291a5 mb-2" />
    <p class="font-bold text-lg mb-1">主題風格擴充</p>
    <p class="text-white/60 text-sm">加自訂字型、背景圖（上傳 blob，加 <code>blob:image/*</code> scope）</p>
  </div>
  <div v-click="[3, 4]" class="border border-white/20 rounded-xl p-5">
    <lucide:move class="text-2xl color-#f291a5 mb-2" />
    <p class="font-bold text-lg mb-1">拖拉排序</p>
    <p class="text-white/60 text-sm">在編輯器用滑鼠拖拉排序（現在是上下箭頭按鈕）</p>
  </div>
  <div v-click="[4, 5]" class="border border-white/20 rounded-xl p-5">
    <lucide:server class="text-2xl color-#f291a5 mb-2" />
    <p class="font-bold text-lg mb-1">SSR 公開頁</p>
    <p class="text-white/60 text-sm">用後端 SSR 渲染 <code>/{handle}</code> 頁面，分享連結到社群平台時會顯示縮圖卡片（類似 linkat.blue）</p>
  </div>
  <div v-click="5" class="border border-white/20 rounded-xl p-5">
    <lucide:share-2 class="text-2xl color-#f291a5 mb-2" />
    <p class="font-bold text-lg mb-1">跨 App 整合</p>
    <p class="text-white/60 text-sm">讓其他 atproto app 也能顯示你的 Link in Bio</p>
  </div>
</div>

---
---

# 三週回顧

<div class="flex gap-6 mt-8">
<div v-click="[1, 2]" class="flex-1 border border-white/20 rounded-xl p-5 text-left">
  <p class="text-sm text-white/50 mb-2">03/13</p>
  <h3 class="!m-0 !text-xl color-#f291a5">概念與架構</h3>
  <div class="mt-3 text-sm text-white/70 space-y-1">
    <li>DID / PDS / Lexicon</li>
    <li>Relay / Jetstream / AppView</li>
    <li>去中心化社交協議</li>
  </div>
</div>
<div v-click="[2, 3]" class="flex-1 border border-white/20 rounded-xl p-5 text-left">
  <p class="text-sm text-white/50 mb-2">03/20</p>
  <h3 class="!m-0 !text-xl color-#f291a5">Bot + Feed + OAuth</h3>
  <div class="mt-3 text-sm text-white/70 space-y-1">
    <li>AI Bot + Jetstream</li>
    <li>Custom Feed Generator</li>
    <li>OAuth + Mini Social App</li>
  </div>
</div>
<div v-click="3" class="flex-1 border border-#f291a5/50 rounded-xl p-5 text-left">
  <p class="text-sm text-white/50 mb-2">04/24</p>
  <h3 class="!m-0 !text-xl color-#f291a5">Link in Bio</h3>
  <div class="mt-3 text-sm text-white/70 space-y-1">
    <li>最小權限 OAuth scope</li>
    <li>Singleton + Collection 合體</li>
    <li>公開檢視 + 自訂主題</li>
  </div>
</div>
</div>
<br><br><br>
<p v-click="4" class="mt-10 text-center text-2xl">
  現在你擁有自己的<span class="color-#f291a5 font-bold">社交資料</span>，不再被平台綁架 :3
</p>

---
---

# 本週作業

<div class="mt-8 text-left text-xl space-y-6">

<div class="border border-white/20 rounded-xl p-6">
  <p class="font-bold text-2xl mb-3">把你的 Link in Bio 真的做出來！</p>
  <div class="space-y-3 text-white/80">
    <li>完成今天的 workshop，挑一個你喜歡的顏色</li>
    <li>加上 3-5 個你自己的連結</li>
    <li>用 PDSls 打開你的 <code>did:plc:*</code>，確認資料真的在 PDS 裡</li>
    <li><b>進階</b>：部署到 Cloudflare Pages，變成真的網站</li>
    <li class="color-purple">在 <code>#at-protocol-by-yuna</code> 頻道分享你的 <code>#/view/&lt;handle&gt;</code>！</li>
  </div>
</div>

</div>

---
---

<img src="./assets/shared/sky.webp" class="absolute inset-0 w-full h-full object-cover -z-2" />
<div class="absolute inset-0 bg-black/50 -z-1" />

<div class="flex flex-col items-center justify-center h-full gap-6">
<img src="./assets/shared/ema-kiang.webp" class="h-[40%] object-contain rounded-xl" />
<h1 class="!text-4xl font-bold">謝謝大家！這三週辛苦了喵 :3</h1>
</div>

<p class="absolute bottom-4 right-6 text-xs text-white/40">GIF 來源：<a href="https://x.com/hyouenn/status/1990701565305569692" target="_blank">@hyouenn</a></p>
