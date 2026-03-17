# 課程簡報

使用 [Slidev](https://sli.dev/) 製作的課程簡報。

## 指令

```bash
pnpm dev        # 啟動開發伺服器（預設 course1）
pnpm dev:1      # 啟動 course1 開發伺服器
pnpm build      # 建置靜態檔案
pnpm export     # 匯出 PDF
```

## 結構

```
course1.md                # 第一堂課程簡報
components/               # 共用 Vue 元件
styles/                   # 共用樣式
assets/
  shared/                 # 共用素材（背景、角色、Logo）
  course1/                # 第一堂課程專用素材
```

## 新增課程

1. 建立 `courseN.md`（可複製 `course1.md` 的 frontmatter 作為範本）
2. 在 `assets/courseN/` 放入該課程專用素材（共用素材放 `assets/shared/`）
3. 在 `package.json` 新增對應腳本：
   ```json
   "dev:N": "slidev courseN.md --open",
   "build:N": "slidev build courseN.md --base /courseN/ --out dist/courseN",
   "export:N": "slidev export courseN.md"
   ```
4. `pnpm build` 會自動偵測所有 `courseN.md` 並建置
   - course1 部署於根路徑 `/`
   - 其他課程部署於 `/courseN/`
