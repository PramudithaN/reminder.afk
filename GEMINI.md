# Commit Guidelines

When the user requests to commit using `/commit`:
- **Step 1: Analyze the project**: Before committing, run checks to ensure there are no errors in the project. Run `npm run lint` and `npx tsc --noEmit` (or relevant validation commands) to check for syntax and type errors.
- **Step 2: Handle Errors**: If any errors are found during the analysis, DO NOT commit. Report the errors to the user and ask if they would like you to fix them first.
- **Step 3: Commit**: If there are no errors, proceed with the commit using the Conventional Commits format:
  - Use `feat(scope): "message"` for new features and developments (e.g., `feat(ui): "add settings gear"`).
  - Use `fix(scope): "message"` for bug fixes.
  - For other types of changes, use appropriate prefixes like `docs(scope):`, `chore(scope):`, `refactor(scope):`, etc.
  - Always review the staged/unstaged changes and generate an appropriate commit message using these prefixes before executing the commit.
