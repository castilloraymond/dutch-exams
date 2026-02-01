---
description: Manage git worktrees for parallel work
---

Help me manage git worktrees for parallel Claude Code sessions:

## Commands I might need:

**Create a worktree:**
```bash
git worktree add ../[project]-[purpose] [branch-name]
# Example: git worktree add ../passinburgering-quiz feature/new-quiz
```

**List worktrees:**
```bash
git worktree list
```

**Remove a worktree:**
```bash
git worktree remove ../[worktree-path]
# Or: rm -rf ../[path] && git worktree prune
```

## What I want to do:
$ARGUMENTS

Help me set this up. After creating a worktree, remind me to:
1. Open a new terminal tab
2. cd into the worktree directory
3. Run `claude` to start a new session
