# Workshop 5：Link in Bio

使用 atcute + OAuth + 自訂 Lexicon 打造完全建立在 AT Protocol 之上的 Link in Bio 應用程式 — 資料存在你自己的 PDS，網路上的使用者則可以查看。

## 功能

- AT Protocol OAuth 登入（只請求需要的 scope，不使用 `transition:generic`）
- 自訂 Lexicon：`com.example.linkinbio.profile` + `com.example.linkinbio.link`
- Profile 編輯（顯示名稱、描述、自訂色彩主題）
- 新增 / 刪除 Link records
- 公開檢視頁：`/#/view/<handle>` 網路上的使用者可以查看使用者的 Link in Bio
- 每筆 record 都有 PDSls 連結可以直接檢視原始資料

## 設定

1. 啟用 corepack（只需做一次，用 repo 指定的 pnpm 版本）：
   ```bash
   corepack enable
   ```

2. 安裝依賴並生成 Lexicon 型別：
   ```bash
   pnpm install
   pnpm lex:generate     # 從 lexicons/*.json 生成 TypeScript 型別到 src/lexicons/
   ```

3. 啟動開發伺服器：
   ```bash
   pnpm dev
   ```

4. 開啟瀏覽器前往 **`http://127.0.0.1:5175`**
   > 必須是 `127.0.0.1`，不能是 `localhost`。atproto OAuth 禁止 `localhost` 作為實際的 origin。

## 自訂 Lexicon

| NSID | 用途 | Key | CRUD 操作 |
| --- | --- | --- | --- |
| `com.example.linkinbio.profile` | 使用者 profile（singleton） | `literal:self` | `putRecord` / `getRecord` |
| `com.example.linkinbio.link` | 單筆 link record | `tid` | `createRecord` / `listRecords` / `deleteRecord` |

## OAuth Scope（細粒度最小權限）

這個 app 只申請實際需要的權限，不使用 `transition:generic`（那會讓 app 能寫入 repo 內所有類型的 record）。

```
atproto
repo:com.example.linkinbio.profile?action=create&action=update&action=delete
repo:com.example.linkinbio.link?action=create&action=update&action=delete
```

| Scope | 授予 |
| --- | --- |
| `atproto` | 授權 atproto OAuth profile（所有 session 必需） |
| `repo:com.example.linkinbio.profile?action=...` | 只能寫入 profile record |
| `repo:com.example.linkinbio.link?action=...` | 只能寫入 link record |

> **使用者頭像的取得**：在這個應用程式中，我們直接顯示使用者的 Bluesky 頭像，因此需要獲得使用者的 `app.bsky.actor.profile` 資料，我們透過 **`public.api.bsky.app`** 這個公開的 AppView 讀取相關資料，不需要額外授權或驗證。

> 延伸閱讀：[atproto.com/specs/permission](https://atproto.com/specs/permission)

## OAuth Client Metadata

- **Dev**：用 loopback `client_id`（`http://localhost/?redirect_uri=...&scope=...`），PDS 會即時從 query string 組出虛擬 metadata，**不需要 hosted JSON**。
- **Prod**：`public/oauth-client-metadata.json` 會從網站根目錄提供（路徑 `/oauth-client-metadata.json`），`client_id` 欄位必須 = 這個檔案的真實 URL。

## 部署到 Cloudflare Pages

1. 把 `public/oauth-client-metadata.json` 三個 URL 欄位（`client_id`、`client_uri`、`redirect_uris`）換成你的 deploy URL。
2. 建立 `.env` 檔：
   ```
   VITE_OAUTH_CLIENT_ID=https://your-app.pages.dev/oauth-client-metadata.json
   VITE_OAUTH_REDIRECT_URI=https://your-app.pages.dev/callback
   ```
3. 建置並部署：
   ```bash
   pnpm build                 # 產出 dist/
   npx wrangler pages deploy dist
   ```
4. Cloudflare Pages 預設是 static site，callback route (`/callback`) 需要 SPA fallback — 在 `public/_redirects` 加上：
   ```
   /*  /index.html  200
   ```

## 用 PDSls 驗證資料

登入後，點任何一筆 record 旁邊的「PDSls」按鈕，會開啟 [pdsls.dev](https://pdsls.dev) 看到這筆 record 在你 PDS 裡的原始 JSON，證明資料真的存在你自己的 repo 裡。

範例 URL 格式：
- Profile：`https://pdsls.dev/at://{did}/com.example.linkinbio.profile/self`
- Link：`https://pdsls.dev/at://{did}/com.example.linkinbio.link/{rkey}`

## 延伸想法

- **Theme gallery** — 加入預設主題（配色 + 字型）
- **拖拉排序** — 改變 `order` 欄位
- **自訂背景圖** — 上傳 blob 作為背景（需加 `blob:image/*` scope）
- **`@yourhandle.com`** — 用自己的 domain 作為 atproto handle
- **SSR 公開頁** — 後端 render `/{handle}` 路由給未登入訪客（類似 linkat.blue）

## 學習重點

- 最小權限 OAuth scope 設計
- `oauth-client-metadata.json` 的 10 個欄位
- Loopback `client_id` 在 dev 的運作原理
- Singleton record (`literal:self` + `putRecord`) vs collection record (`tid` + `createRecord`)
- 從 handle 解析到 PDS endpoint（`LocalActorResolver`）
- 用 `simpleFetchHandler` 讀取不需要授權的公開資料（使用者頭像）

> 想要作業指導？到 [Discord](https://discord.gg/GPBJPshrBU) 取得 GitHub Classroom 連結（非必要）
