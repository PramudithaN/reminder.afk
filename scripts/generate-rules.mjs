#!/usr/bin/env node

/**
 * Universal Dynamic AI Agent Rules Generator
 * 
 * Automatically analyzes any repository (Node.js, Electron, React, Next.js, Vue,
 * TypeScript, Python, Rust, Go, etc.) and dynamically generates customized
 * AGENTS.md and GEMINI.md files from templates.
 * 
 * Usage:
 *   node scripts/generate-rules.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, '..')

// ── Directory scanner for project structure ──────────────────────────────────
const IGNORED_DIRS = new Set([
  'node_modules', '.git', 'dist', 'dist-electron', 'dist-ssr',
  'build', 'release', '.next', '.cache', '.turbo', '.vscode', '.idea',
  'coverage', '__pycache__', 'target', 'vendor',
])

function generateDirectoryTree(dir, prefix = '', depth = 0, maxDepth = 2) {
  if (depth > maxDepth) return []
  
  let entries = []
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return []
  }

  const lines = []
  const filtered = entries
    .filter(e => !IGNORED_DIRS.has(e.name) && !e.name.startsWith('.DS_Store'))
    .sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1
      if (!a.isDirectory() && b.isDirectory()) return 1
      return a.name.localeCompare(b.name)
    })

  for (let i = 0; i < filtered.length; i++) {
    const entry = filtered[i]
    const isLast = i === filtered.length - 1
    const pointer = isLast ? '└── ' : '├── '
    const nextPrefix = prefix + (isLast ? '    ' : '│   ')

    // Annotate common directories
    let annotation = ''
    if (entry.name === 'electron') annotation = '                 # Electron Main Process & Preload'
    else if (entry.name === 'src') annotation = '                      # React Renderer / Application Source'
    else if (entry.name === 'public') annotation = '                   # Static Public Assets & Icons'
    else if (entry.name === 'components') annotation = '           # Reusable UI & View Components'
    else if (entry.name === 'hooks') annotation = '                # Business Logic & State Hooks'
    else if (entry.name === 'lib' || entry.name === 'utils') annotation = '                  # Utility Functions & Helper Libraries'
    else if (entry.name === 'types') annotation = '                # TypeScript Type Declarations'
    else if (entry.name === 'constants') annotation = '            # Configuration Constants & Registries'
    else if (entry.name === 'assets') annotation = '               # Media, 3D Models & Static Files'

    lines.push(`${prefix}${pointer}${entry.name}${annotation}`)

    if (entry.isDirectory()) {
      lines.push(...generateDirectoryTree(path.join(dir, entry.name), nextPrefix, depth + 1, maxDepth))
    }
  }

  return lines
}

// ── Analyze Repository Tech Stack ───────────────────────────────────────────
function analyzeProject(rootDir) {
  const pkgPath = path.join(rootDir, 'package.json')
  let pkg = {}
  if (fs.existsSync(pkgPath)) {
    try {
      pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    } catch {
      pkg = {}
    }
  }

  const allDeps = {
    ...(pkg.dependencies || {}),
    ...(pkg.devDependencies || {}),
  }

  const scripts = pkg.scripts || {}
  const hasTs = fs.existsSync(path.join(rootDir, 'tsconfig.json')) || !!allDeps['typescript']
  const isElectron = !!allDeps['electron'] || fs.existsSync(path.join(rootDir, 'electron'))
  const isReact = !!allDeps['react']
  const isNext = !!allDeps['next']
  const isVue = !!allDeps['vue']
  const isThree = !!allDeps['three'] || !!allDeps['@react-three/fiber']
  const isMui = !!allDeps['@mui/material'] || !!allDeps['@emotion/react']
  const isTailwind = !!allDeps['tailwindcss']
  const isVite = !!allDeps['vite']

  // Project naming & overview
  const baseName = path.basename(rootDir)
  const projectName = pkg.name || baseName
  const description = pkg.description || (isElectron 
    ? 'A high-performance desktop application built with Electron, React, and TypeScript.'
    : 'A modern web application and codebase.')

  return {
    projectName,
    baseName,
    description,
    pkg,
    scripts,
    hasTs,
    isElectron,
    isReact,
    isNext,
    isVue,
    isThree,
    isMui,
    isTailwind,
    isVite,
    allDeps,
  }
}

// ── Rule Builders ───────────────────────────────────────────────────────────

function buildProjectOverview(info) {
  const stack = []
  if (info.isElectron) stack.push('**Electron**')
  if (info.isNext) stack.push('**Next.js**')
  else if (info.isReact) stack.push('**React 18**')
  else if (info.isVue) stack.push('**Vue**')
  if (info.hasTs) stack.push('**TypeScript**')
  if (info.isVite) stack.push('**Vite**')
  if (info.isThree) stack.push('**Three.js / React Three Fiber**')
  if (info.isMui) stack.push('**Material UI (MUI)**')
  if (info.isTailwind) stack.push('**Tailwind CSS**')

  return `**${info.projectName}** is a modern application built with ${stack.join(', ')}.\n\n` +
    `> ${info.description}`
}

function buildCodingStandards(info) {
  const points = []

  points.push(`1. **Senior Developer Excellence:**\n` +
    `   - Write clean, expressive, and modular ${info.hasTs ? 'TypeScript' : 'JavaScript'} code.\n` +
    `   - Follow strict separation of concerns across state, business logic, UI presentation, and platform APIs.`)

  if (info.isElectron) {
    points.push(`   - Maintain a strict boundary between the Electron **Main Process** (system tray, windows, display management, login items) and the **Renderer Process** (React UI, Three.js 3D scene, Web Audio synthesis).\n` +
      `   - Never import Node.js core modules (\`fs\`, \`path\`, \`child_process\`) directly inside \`src/\`. All desktop interactions must flow through the preload bridge (\`electron/preload.ts\`).`)
  }

  if (info.hasTs) {
    points.push(`2. **TypeScript & Strict Typing:**\n` +
      `   - Never use \`any\`. Always declare explicit interfaces, type unions, and type aliases.\n` +
      (info.isElectron ? `   - Maintain strict typing for all IPC channels in \`src/types/electron.d.ts\` and \`electron/main.ts\`.\n` : '') +
      `   - Ensure \`npm run lint\` and \`npx tsc --noEmit\` always pass with 0 errors or warnings.`)
  }

  points.push(`3. **DRY & Single Responsibility:**\n` +
    `   - Separate state persistence, business hooks, presentation components, and external services into dedicated modules.`)

  if (info.isThree) {
    points.push(`4. **Resilient 3D & Audio Performance:**\n` +
      `   - Always wrap 3D asset loaders (\`useGLTF\`, \`useAnimations\`) in React \`<Suspense>\` and \`<ModelErrorBoundary>\` boundaries with graceful fallbacks.\n` +
      `   - Preload all 3D models using \`useGLTF.preload()\` at module load to prevent stutter during rendering triggers.\n` +
      `   - Properly dispose of Three.js geometries, textures, materials, and Web Audio context nodes upon component unmount to prevent memory leaks in long-running processes.`)
  }

  return points.join('\n')
}

function buildFrameworkRules(info) {
  const sections = []

  if (info.isElectron) {
    sections.push(`### Electron Desktop & Overlay Guidelines:\n` +
      `1. **Transparent Overlay & Pointer Events:**\n` +
      `   - When idle or minimized, ensure the window ignores mouse events (\`win.setIgnoreMouseEvents(true, { forward: true })\`) so user interactions pass through to background desktop applications.\n` +
      `   - When an interactive dialog, reminder, or modal triggers, enable pointer events (\`win.setIgnoreMouseEvents(false)\`).\n` +
      `2. **Multi-Monitor Display Routing:**\n` +
      `   - Dynamically detect active cursor coordinates (\`screen.getCursorScreenPoint()\`) and route overlays to the nearest monitor display bounds (\`screen.getDisplayNearestPoint()\`).\n` +
      `3. **System Tray & Single-Instance Lifecycle:**\n` +
      `   - Enforce single instance locking (\`app.requestSingleInstanceLock()\`).\n` +
      `   - Keep tray context menus synchronized with live application state (mute status, startup preferences).`)
  }

  if (info.isMui || info.isTailwind) {
    sections.push(`### UI/UX Design System:\n` +
      `1. **Consistent Visual Aesthetic:**\n` +
      `   - Maintain high-contrast, dark-mode developer aesthetics (#101010 background, vibrant accent colors, crisp monospace typography: \`"Fira Code", "Consolas", "Inter", monospace\`).\n` +
      `   - Use subtle backdrop blurs (\`backdrop-filter: blur(6px)\`) with smooth CSS transitions.`)
  }

  return sections.length > 0 ? sections.join('\n\n') : `Follow standard idiomatic ${info.isReact ? 'React' : 'frontend'} design patterns and component modularity.`
}

function buildSecurityRules(info) {
  const points = []

  if (info.isElectron) {
    points.push(`1. **Context Isolation & Sandboxing:**\n` +
      `   - Enforce \`contextIsolation: true\`, \`nodeIntegration: false\`, and \`sandbox: false\` in \`BrowserWindow\` \`webPreferences\`.\n` +
      `   - Never expose raw Node.js modules directly to the renderer.\n` +
      `   - Only expose safe, strictly whitelisted IPC methods via \`contextBridge.exposeInMainWorld('ipcRenderer', ...)\`.`)
    
    points.push(`2. **IPC Message Validation:**\n` +
      `   - Validate and sanitize all arguments received by \`ipcMain.on\` and \`ipcMain.handle\`.\n` +
      `   - Never trust input from the renderer to execute arbitrary shell commands, load unverified URLs, or write to arbitrary filesystem paths.`)
  } else {
    points.push(`1. **No Exposed Secrets:**\n` +
      `   - Never commit sensitive credentials or private keys. Retrieve runtime configurations through environment variables.`)
  }

  if (info.isThree || info.isElectron) {
    points.push(`3. **Safe Asset & Media Handling:**\n` +
      `   - 3D models (\`.glb\`) and static media must be bundled locally or loaded from verified internal paths.\n` +
      `   - Synthesize reminder chimes procedurally using the Web Audio API (\`AudioContext\`, \`OscillatorNode\`, \`GainNode\`) without downloading untrusted external audio files.`)
  }

  points.push(`4. **Clean Build Artifacts:**\n` +
    `   - Keep build artifacts (\`dist\`, \`dist-electron\`, \`release\`, \`node_modules\`) ignored in \`.gitignore\`.`)

  return points.join('\n')
}

function buildVerificationRunbook(info) {
  const steps = []
  let stepNumber = 1

  if (info.scripts['lint']) {
    steps.push(`${stepNumber++}. **Lint Check:**\n   \`\`\`bash\n   npm run lint\n   \`\`\`\n   *Must exit with code 0.*`)
  }

  if (info.hasTs) {
    steps.push(`${stepNumber++}. **TypeScript Compilation:**\n   \`\`\`bash\n   npx tsc --noEmit\n   \`\`\`\n   *Must compile with zero TypeScript errors.*`)
  }

  if (info.scripts['build']) {
    steps.push(`${stepNumber++}. **Production Build:**\n   \`\`\`bash\n   ${info.isVite ? 'npx vite build' : 'npm run build'}\n   \`\`\`\n   *Must bundle cleanly with zero build errors.*`)
  }

  if (info.scripts['test']) {
    steps.push(`${stepNumber++}. **Test Suite:**\n   \`\`\`bash\n   npm test\n   \`\`\`\n   *All tests must pass.*`)
  }

  return steps.join('\n\n')
}

// ── Main Execution ──────────────────────────────────────────────────────────
export function generateRules(rootDir = ROOT_DIR) {
  console.log(`[generate-rules] Analyzing repository at: ${rootDir}`)
  const info = analyzeProject(rootDir)

  const treeLines = [info.baseName + '/', ...generateDirectoryTree(rootDir)]
  const projectStructure = treeLines.join('\n')

  const overview = buildProjectOverview(info)
  const codingStandards = buildCodingStandards(info)
  const frameworkRules = buildFrameworkRules(info)
  const securityRules = buildSecurityRules(info)
  const verificationRunbook = buildVerificationRunbook(info)

  const replacements = {
    '{{PROJECT_NAME}}': info.projectName,
    '{{PROJECT_OVERVIEW}}': overview,
    '{{PROJECT_STRUCTURE}}': projectStructure,
    '{{CODING_STANDARDS}}': codingStandards,
    '{{FRAMEWORK_SPECIFIC_RULES}}': frameworkRules,
    '{{SECURITY_RULES}}': securityRules,
    '{{VERIFICATION_RUNBOOK}}': verificationRunbook,
  }

  // Generate AGENTS.md & GEMINI.md
  const templateTargets = [
    { template: 'AGENTS.template.md', output: 'AGENTS.md' },
    { template: 'GEMINI.template.md', output: 'GEMINI.md' },
  ]

  const templatesDir = path.join(rootDir, 'templates')

  for (const { template, output } of templateTargets) {
    const templatePath = path.join(templatesDir, template)
    let content = ''

    if (fs.existsSync(templatePath)) {
      content = fs.readFileSync(templatePath, 'utf8')
    } else {
      console.warn(`[generate-rules] Template ${template} not found in ${templatesDir}, using fallback format.`)
      content = `# Senior Developer & Security Guidelines (Coding Agent Instructions)\n\n` +
        `> Whenever you analyze, plan, edit, or refactor code in **{{PROJECT_NAME}}**, strictly adhere to these rules.\n\n` +
        `## 1. Project Overview & Architecture\n\n{{PROJECT_OVERVIEW}}\n\n` +
        `### Project Structure:\n\`\`\`text\n{{PROJECT_STRUCTURE}}\n\`\`\`\n\n` +
        `## 2. Coding Standards\n\n{{CODING_STANDARDS}}\n\n` +
        `## 3. Framework Guidelines\n\n{{FRAMEWORK_SPECIFIC_RULES}}\n\n` +
        `## 4. Security Principles\n\n{{SECURITY_RULES}}\n\n` +
        `## 5. Verification Runbook\n\n{{VERIFICATION_RUNBOOK}}\n`
    }

    // Replace all placeholders
    for (const [placeholder, value] of Object.entries(replacements)) {
      content = content.replaceAll(placeholder, value)
    }

    const outputPath = path.join(rootDir, output)
    fs.writeFileSync(outputPath, content, 'utf8')
    console.log(`[generate-rules] Generated ${output} successfully.`)
  }

  console.log(`[generate-rules] Completed agent rules generation!`)
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateRules(ROOT_DIR)
}
