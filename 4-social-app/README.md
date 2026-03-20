# Workshop 4：Mini Social App

使用 atcute + OAuth 打造瀏覽器端的迷你社交應用，搭配自訂 Lexicon。

## 功能

- OAuth 登入（延伸 Workshop 3 概念）
- 瀏覽個人時間線（Timeline）
- 使用自訂 Lexicon 發布貼文
- Personal Status 功能（作業）
- 載入更多（cursor-based pagination）

## 設定

1. 安裝依賴：
   ```bash
   pnpm install
   ```

2. 啟動開發伺服器：
   ```bash
   pnpm dev
   ```

3. 開啟瀏覽器前往 `http://localhost:5174`

## 自訂 Lexicon

本專案定義了以下 Lexicon：

- `com.example.nekosky.feed.post` — 貼文 record
- `com.example.nekosky.feed.getTimeline` — 時間線 query
- `com.example.nekosky.actor.status` — 個人狀態 record（**作業**）

使用 `@atcute/lex-cli` 生成型別：
```bash
pnpm lex   # 從 lexicons/*.json 生成型別到 src/lexicons/
```

## 作業

實作 `src/status.ts` 中的 TODO 函式：

1. `setStatus` — 用 `putRecord` 設定個人狀態（key: `self`，singleton record）
2. `getStatus` — 用 `getRecord` 讀取個人狀態
3. `clearStatus` — 用 `deleteRecord` 清除個人狀態

UI 已經預先建好（header 中的 Set Status 按鈕）— 你只需要實作 AT Protocol 的操作。

> 想要作業指導？到 [Discord](https://discord.gg/GPBJPshrBU) 取得 GitHub Classroom 連結（非必要）

## 學習重點

- 完整的社交應用流程（登入 → 瀏覽 → 發文）
- Singleton record（`key: "self"` + `putRecord`）
- `putRecord` vs `createRecord` 的差異
- 自訂 Lexicon 定義與型別生成
- Cursor-based pagination 的 UI 實作
