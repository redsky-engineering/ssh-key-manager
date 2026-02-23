Show `git status --short`. If nothing is staged, stop.
Run `git diff --cached`.
Ask the user for context, then generate a message in `type: subject` form (types: feat, fix, docs, refactor, test, chore, style).

**Branch check**: Run `git branch --show-current`. If the current branch is `master` or `dev`, you MUST create a new branch before committing:

- Derive the branch name from the commit type and subject, kebab-cased and concise (e.g. `feat/josh/add-logout-dark-mode`, `fix/josh/user-deactivation-flow`).
- Format: `{type}/josh/{short-description}`
- Run `git checkout -b {branch-name}` before committing.
- Inform the user of the new branch name.

Confirm the commit message before running `git commit -m`.
Display `git log -1 --stat` after committing.
