# Commit Guidelines

When the user requests to commit using `/commit`:
- **Step 1: Analyze the project**: Before committing, run checks to ensure there are no errors in the project. Run `npm run lint` and `npx tsc --noEmit` (or relevant validation commands) to check for syntax and type errors.
- **Step 2: Handle Errors**: If any errors are found during the analysis, DO NOT commit. Report the errors to the user and ask if they would like you to fix them first.
- **Step 3: Commit**: If there are no errors, proceed with the commit using the Conventional Commits format:
  - Use `feat(): "message"` for new features and developments.
  - Use `fix(): "message"` for bug fixes.
  - For other types of changes, use appropriate prefixes like `docs:`, `chore:`, `refactor:`, etc.
  - Always review the staged/unstaged changes and generate an appropriate commit message using these prefixes before executing the commit.
