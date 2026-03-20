# Workshop 3：OAuth 登入 + Saved Posts

使用 atcute 實作 AT Protocol OAuth 瀏覽器登入，並建立「Saved Posts with Folders」功能。

## 功能

- AT Protocol OAuth 登入流程（PKCE + DPoP）
- Loopback client — 開發時無需預先註冊
- 瀏覽個人時間線，儲存喜歡的貼文
- 用資料夾分類你的 saved posts
- 自訂 Lexicon（`com.example.nekosky.saved.*`）

## 設定

1. 安裝依賴：
   ```bash
   pnpm install
   ```

2. 啟動開發伺服器：
   ```bash
   pnpm dev
   ```

3. 開啟瀏覽器前往 `http://localhost:5173`

## 自訂 Lexicon

本專案使用兩個自訂 Lexicon：

- `com.example.nekosky.saved.folder` — 資料夾 record
- `com.example.nekosky.saved.item` — 已儲存貼文 record（含 folder 參照）

使用 `@atcute/lex-cli` 生成型別：
```bash
pnpm lex   # 從 lexicons/*.json 生成型別到 src/lexicons/
```

## 作業

實作 `src/saved.ts` 中的 TODO 函式：

1. `createFolder` — 用 `createRecord` 建立資料夾
2. `listFolders` — 用 `listRecords` 列出所有資料夾
3. `savePost` — 用 `createRecord` 儲存貼文到資料夾
4. `listSavedPosts` — 用 `listRecords` 列出已儲存的貼文
5. `removeSavedPost` — 用 `deleteRecord` 移除已儲存的貼文

UI 已經預先建好 — 你只需要實作 AT Protocol 的操作。

> 想要作業指導？到 [Discord](https://discord.gg/GPBJPshrBU) 取得 GitHub Classroom 連結（非必要）

## 學習重點

- AT Protocol OAuth 流程（PKCE + DPoP + PAR — 由 atcute 處理）
- App Password vs OAuth 的差異
- 自訂 Lexicon 定義與使用
- Record CRUD（`createRecord`, `listRecords`, `deleteRecord`）
- 瀏覽器中的 session 管理
