# Senior Developer & Security Guidelines (Coding Agent Instructions)

> **CRITICAL INSTRUCTION FOR ALL AI CODING AGENTS**:
> Whenever you analyze, plan, edit, or refactor code in this repository (**{{PROJECT_NAME}}**), you must **strictly adhere** to all architectural best practices, security standards, UI/UX conventions, documentation maintenance, and commit conventions detailed in this document.

---

## 1. Project Overview & Architecture

{{PROJECT_OVERVIEW}}

### Project Structure & Separation of Concerns:
```text
{{PROJECT_STRUCTURE}}
```

---

## 2. Professional Mindset & Clean Code Standards

{{CODING_STANDARDS}}

---

## 3. Framework & Technical Guidelines

{{FRAMEWORK_SPECIFIC_RULES}}

---

## 4. Zero-Vulnerability & Cybersecurity Principles

{{SECURITY_RULES}}

---

## 5. Continuous Documentation Maintenance (README Sync)

1. **Keep Documentation Synchronized:**
   - Whenever adding new features, components, architecture changes, settings options, or build requirements, **you must update `README.md`** to reflect the changes.
   - Keep technology stack listings, installation/build instructions, and environment variable notes completely accurate.

---

## 6. Standard Git Commit Message Conventions

All commit messages in this project must follow the standard **Conventional Commits** specification:

### Format:
```text
<type>(<scope>): <short description in imperative mood>
```

### Commit Types:
* `feat(scope):` -> A new feature or user-facing capability (e.g. `feat(models): add animated cyber samurai 3D model`).
* `fix(scope):` -> A bug fix or error correction (e.g. `fix(tray): update mute icon on tray menu toggle`).
* `perf(scope):` -> Performance improvement (e.g. `perf(three): dispose unused textures on model swap`).
* `refactor(scope):` -> Code restructuring without changing functional behavior (e.g. `refactor(timers): extract interval calculation helper`).
* `security(scope):` -> Security hardening or IPC sanitization (e.g. `security(ipc): validate payload structure in main process`).
* `style(scope):` -> Styling, theme, or layout tweaks (e.g. `style(settings): refine slider contrast for dark theme`).
* `docs(scope):` -> Documentation updates (e.g. `docs(readme): document new stretch break intervals`).
* `chore(scope):` -> Maintenance, dependencies, build configuration (e.g. `chore(deps): update electron to latest patch release`).

---

## 7. Verification & Quality Assurance Runbook

Before completing any coding task, the agent must run and verify all of the following:

{{VERIFICATION_RUNBOOK}}
