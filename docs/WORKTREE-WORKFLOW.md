# Git Worktree Workflow with Claude Code

A practical guide for parallel feature development using git worktrees.

## Starting New Work

```bash
# 1. Open terminal, go to your main repo
cd ~/path/to/inburgering-app

# 2. Sync main before branching
git fetch origin && git pull

# 3. Create worktree for your feature
git worktree add ../inburgering-app-feature-name -b feature/feature-name

# 4. Enter worktree and push branch immediately
cd ../inburgering-app-feature-name
git push -u origin feature/feature-name

# 5. Start Claude Code
claude
```

## While Working

### When to Commit

Commit after each meaningful unit of work:
- A component works
- A bug is fixed
- Tests pass
- Before switching to something else

Tell Claude: `commit this` or use `/commit`

### When to Push

Push at minimum:
- Before lunch
- Before any meeting
- End of day
- Before switching to another worktree

### Syncing with Main

If your branch lives more than a day:
```bash
git fetch origin
git rebase origin/main
```

## Ending a Session

```bash
# Before closing terminal, tell Claude:
"commit and push everything"

# Or manually:
git status  # verify clean
git push
```

## After PR is Merged

```bash
# Go back to main repo
cd ~/path/to/inburgering-app

# Clean up immediately
git worktree remove ../inburgering-app-feature-name
git branch -d feature/feature-name
git push origin --delete feature/feature-name
git pull  # get the merged changes
```

## Quick Reference

| When | Do |
|------|-----|
| New feature | New worktree → push branch → `claude` |
| Completed a piece | "commit this" |
| Stepping away | "push" |
| Done for day | "commit and push", then close |
| PR merged | Remove worktree, delete branch, pull main |

## Common Mistakes to Avoid

| Mistake | Why It's Bad | Prevention |
|---------|--------------|------------|
| Working on main | Features get tangled, hard to review | Always create a feature branch |
| Not pushing branch | Work is unprotected, invisible to others | Push immediately after creating |
| Uncommitted work | Easy to lose, causes merge conflicts | Commit after each unit of work |
| Stale branches | Drift from main, painful merges | Keep branches short-lived (days, not weeks) |
| Zombie worktrees | Clutter, confusion about what's active | Clean up immediately after merge |

## Naming Conventions

- **Worktree folder:** `project-name-feature-short-name`
- **Branch:** `feature/feature-short-name`

Example:
```bash
git worktree add ../inburgering-app-dark-mode -b feature/dark-mode
```

## End of Day Checklist

1. All work committed?
2. All branches pushed?
3. Any worktrees that should be cleaned up?

```bash
# Quick status check
git worktree list
# For each worktree:
cd ../worktree-name && git status
```
