# AT Protocol 從零開始喵

交大 VTuber 社 114-2 社課 - AT Protocol 課程教材與工作坊程式碼

by [yuna0x0](https://github.com/yuna0x0)

## 課程大綱

| 週次 | 日期 | 主題 |
| --- | --- | --- |
| 1 | 03/13 | AT Protocol 是什麼？ |
| 2 | 03/20 | 實作自己的機器人和演算法！OAuth 驗證和你的第一個社交應用程式 |
| 3 | 04/24 | Link in Bio on AT Protocol |

## 專案結構

```
slides/          # 課程簡報 (Slidev)
1-agent/         # Workshop 1: AI Bot（Jetstream + Vercel AI SDK）
2-custom-feed/   # Workshop 2: Custom Feed Generator（Like 索引 + Backfill）
3-oauth/         # Workshop 3: OAuth 登入 + Saved Posts with Folders
4-social-app/    # Workshop 4: Mini Social App + Personal Status
5-link-in-bio/   # Workshop 5: Link in Bio
```

## 作業（GitHub Classroom）

非必要，提供作業指導給有興趣的同學。

作業連結請到 [交大 VTuber 社 Discord](https://discord.gg/GPBJPshrBU) 的 `#at-protocol-by-yuna` 頻道取得。

## 開發

```bash
pnpm install          # 安裝所有依賴

# 簡報
pnpm slides:dev       # 第一堂簡報開發伺服器
pnpm slides:dev:2     # 第二堂簡報開發伺服器
pnpm slides:dev:3     # 第三堂簡報開發伺服器
pnpm slides:build     # 建置所有簡報
pnpm slides:export:3  # 匯出第三堂 PDF

# 工作坊
pnpm agent:dev        # 啟動 AI Bot
pnpm feed:dev         # 啟動 Feed Generator
pnpm oauth:dev        # 啟動 OAuth Demo
pnpm social:dev       # 啟動 Mini Social App
pnpm linkinbio:dev    # 啟動 Link in Bio
```

## 使用技術

- [atcute](https://github.com/mary-ext/atcute)
- [Microcosm Constellation](https://constellation.microcosm.blue/)
- [Vercel AI SDK](https://sdk.vercel.ai/)
- [Hono](https://hono.dev/)
- [Slidev](https://sli.dev/)

## Agent Skills

還原 Agent Skills：

```bash
npx skills experimental_install
```
