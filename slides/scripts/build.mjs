import { readdirSync, readFileSync, writeFileSync, cpSync, mkdirSync } from 'fs'
import { execSync } from 'child_process'
import { join } from 'path'

const rootDir = join(import.meta.dirname, '..')
const distDir = join(rootDir, 'dist')

// Find all courseN.md files
const courses = readdirSync(rootDir)
  .filter(f => /^course\d+\.md$/.test(f))
  .sort()

if (courses.length === 0) {
  console.error('No courseN.md files found')
  process.exit(1)
}

// Extract title from each course's frontmatter
function getCourseTitle(filename) {
  const content = readFileSync(join(rootDir, filename), 'utf-8')
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (match) {
    const titleMatch = match[1].match(/^title:\s*(.+)$/m)
    if (titleMatch) return titleMatch[1].trim().replace(/^['"]|['"]$/g, '')
  }
  return filename.replace('.md', '')
}

// Build each course to dist/courseN/
for (const course of courses) {
  const name = course.replace('.md', '')
  const base = `/${name}/`
  const out = `dist/${name}`

  console.log(`Building ${course} → ${out} (base: ${base})`)
  execSync(
    `npx slidev build ${course} --base ${base} --out ${out}`,
    { cwd: rootDir, stdio: 'inherit' },
  )
}

// Copy sky.webp to dist/ for root index background
cpSync(join(rootDir, 'assets/shared/sky.webp'), join(distDir, 'sky.webp'))

// Generate root index.html with course listing
const courseEntries = courses.map(c => {
  const name = c.replace('.md', '')
  const num = name.replace('course', '')
  const title = getCourseTitle(c)
  return { name, num, title }
})

const indexHtml = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AT Protocol 從零開始喵 - 課程列表</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background: url('./sky.webp') center/cover no-repeat;
      z-index: -2;
    }
    body::after {
      content: '';
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: -1;
    }
    .container {
      max-width: 640px;
      width: 100%;
      padding: 2rem;
    }
    h1 {
      font-size: 1.875rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      color: #94a3b8;
      margin-bottom: 2rem;
    }
    .courses {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    a {
      display: block;
      padding: 1.25rem 1.5rem;
      background: rgba(30, 41, 59, 0.6);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 0.75rem;
      color: #e2e8f0;
      text-decoration: none;
      transition: transform 0.2s, background 0.2s, border-color 0.2s, box-shadow 0.2s;
    }
    a:hover {
      transform: translateY(-2px);
      background: rgba(51, 65, 85, 0.7);
      border-color: rgba(255, 255, 255, 0.15);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
    a:active {
      transform: translateY(0);
    }
    .course-num {
      font-size: 0.875rem;
      color: #94a3b8;
    }
    .course-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-top: 0.25rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>AT Protocol 從零開始喵</h1>
    <p class="subtitle">交大 VTuber 社 114-2 社課</p>
    <div class="courses">
${courseEntries.map(({ name, num, title }) => `      <a href="/${name}/">
        <div class="course-num">Course ${num}</div>
        <div class="course-title">${title}</div>
      </a>`).join('\n')}
    </div>
  </div>
</body>
</html>
`

writeFileSync(join(distDir, 'index.html'), indexHtml)

// Generate _redirects for SPA fallback
const redirects = courses
  .map(c => c.replace('.md', ''))
  .map(name => `/${name}/* /${name}/index.html 200`)

writeFileSync(join(distDir, '_redirects'), redirects.join('\n') + '\n')

console.log(`Built ${courses.length} course(s): ${courses.join(', ')}`)
