Show `git status --short`. If nothing is staged, stop.
Run `git diff --cached`.
Ask the user for context, then generate a message in `type: subject` form (types: feat, fix, docs, refactor, test, chore, style).
Confirm the message before running `git commit -m`.
Display `git log -1 --stat` after committing.
