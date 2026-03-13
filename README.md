# AT Protocol 從零開始喵

交大 VTuber 社 114-2 社課 - AT Protocol 課程教材與工作坊程式碼

by [yuna0x0](https://github.com/yuna0x0)

## 課程大綱

| 週次 | 日期 | 主題 |
| --- | --- | --- |
| 1 | 03/13 | AT Protocol 是什麼？ |
| 2 | 03/20 | 實作自己的機器人和演算法！OAuth 驗證和你的第一個社交應用程式 |
| 3 | 03/27 | Link in Bio on AT Protocol |

## 專案結構

```
slides/          # 課程簡報 (Slidev)
1-agent/         # 工作坊：Bot 實作
2-custom-feed/   # 工作坊：自訂 Feed
3-oauth/         # 工作坊：OAuth 驗證
4-social-app/    # 工作坊：社交應用程式
5-link-in-bio/   # 工作坊：Link in Bio
```

## 開發

```bash
pnpm install
pnpm slides:dev    # 啟動簡報開發伺服器
pnpm slides:build  # 建置簡報
pnpm slides:export # 匯出 PDF
```

## Agent Skills

還原 Agent Skills：

```bash
npx skills experimental_install
```
