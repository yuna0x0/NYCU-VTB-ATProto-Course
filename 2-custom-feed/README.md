# Workshop 2：Custom Feed Generator

使用 atcute、Hono 和 Node.js 內建 SQLite 建立自訂的 Bluesky Feed Generator。

> 需要 Node.js v22.5+（使用內建 `node:sqlite` 模組）

## 功能

- 訂閱 Jetstream 即時事件串流
- 根據關鍵字篩選並索引貼文
- 索引特定使用者的按讚貼文（like-based feed）
- Backfill：啟動時補回歷史按讚資料
- 提供 `getFeedSkeleton` XRPC endpoint
- 支援 cursor-based 分頁
- 可搭配 [Microcosm Constellation](https://constellation.microcosm.blue/) 查詢互動數據

## 設定

1. 複製 `.env.example` 為 `.env`，填入你的設定：
   ```bash
   cp .env.example .env
   ```

2. 在 [Bluesky 設定](https://bsky.app/settings/app-passwords) 建立 App Password

3. 安裝依賴：
   ```bash
   pnpm install
   ```

## 使用

```bash
pnpm dev           # 開發模式（自動重啟）
pnpm start         # 啟動 Feed Generator
pnpm publish-feed  # 發布 Feed 到 Bluesky
```

啟動後可以測試 endpoint：
```bash
curl http://localhost:3000/xrpc/app.bsky.feed.getFeedSkeleton
```

## 設定說明

| 變數 | 說明 |
|------|------|
| `FEED_KEYWORD` | 篩選關鍵字（例如 `#VTuber`） |
| `TARGET_DIDS` | 要索引按讚的 DID 清單（逗號分隔） |
| `FEED_HOSTNAME` | Feed Generator 的域名 |
| `FEED_RKEY` | Feed 識別碼 |

## 作業

建立一個聚合特定人按讚貼文的 Feed：
1. 將提供的 handle 清單轉換為 DID（`com.atproto.identity.resolveHandle`）
2. 實作 backfill — 取得歷史按讚資料
3. 監聽 Jetstream 的 `app.bsky.feed.like` 事件
4. 透過 `getFeedSkeleton` 回傳結果

> 想要作業指導？到 [Discord](https://discord.gg/GPBJPshrBU) 取得 GitHub Classroom 連結（非必要）

## 學習重點

- Feed Generator 架構（索引 → 服務 → 填充）
- Jetstream 事件結構（Post 事件 vs Like 事件）
- Backfill 機制（補回歷史資料）
- Microcosm Constellation（查詢互動數據）
- Node.js 內建 SQLite（`node:sqlite`）
- Cursor-based 分頁
