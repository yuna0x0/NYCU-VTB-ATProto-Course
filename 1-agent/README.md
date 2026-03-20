# Workshop 1：AI Bot

使用 atcute 和 Vercel AI SDK 打造 Bluesky 聊天機器人。

## 功能

- 監聽 Jetstream 即時事件串流
- 偵測提及 Bot 的貼文
- 使用 Vercel AI SDK 自動生成回覆（支援任何 OpenAI-compatible provider）
- 發布回覆到 Bluesky

## 設定

1. 複製 `.env.example` 為 `.env`，填入你的設定：
   ```bash
   cp .env.example .env
   ```

2. 在 [Bluesky 設定](https://bsky.app/settings/app-passwords) 建立 App Password

3. 取得 AI provider 的 API Key（預設使用 [OpenRouter](https://openrouter.ai/keys)，也可使用 OpenAI、Ollama 等）

4. 安裝依賴：
   ```bash
   pnpm install
   ```

## 使用

```bash
pnpm dev            # 開發模式（自動重啟）
pnpm start          # 啟動 Bot
pnpm publish-post "Hello!"  # 發布一則貼文
```

## AI Provider 設定

透過環境變數設定，支援任何 OpenAI-compatible API：

| 變數 | 說明 | 預設值 |
|------|------|--------|
| `AI_API_KEY` | API Key | (必填) |
| `AI_BASE_URL` | API Base URL | `https://openrouter.ai/api/v1` |
| `AI_MODEL` | 模型名稱 | `google/gemini-3-flash-preview` |

## 作業

修改 system prompt 打造你的 Bot 人設，並選擇 **一個** 延伸功能實作（例如：DM、Rich Text 回覆、定時發文、更換頭像等）。

> 想要作業指導？到 [Discord](https://discord.gg/GPBJPshrBU) 取得 GitHub Classroom 連結（非必要）

## 學習重點

- AT Protocol 認證（App Password）
- XRPC API 呼叫（`com.atproto.repo.createRecord`）
- 使用 `@atcute/jetstream` 訂閱即時事件串流
- 貼文結構：text, reply threading（parent + root）
- 整合 Vercel AI SDK（支援多種 AI provider）
