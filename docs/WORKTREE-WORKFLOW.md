# Git Worktree Workflow with Claude Code

Git worktrees allow you to have multiple working directories tied to a single repository. Each worktree gets its own isolated directory and branch, so you can run parallel Claude Code sessions without file conflicts.

## Concrete Example: 3 Parallel Sessions

### Step 0: Start clean on main

```bash
cd ~/path/to/inburgering-app
git fetch origin && git pull
```

### Step 1: Create all 3 worktrees

```bash
git worktree add ../inburgering-app-auth -b feature/auth
git worktree add ../inburgering-app-ui-refresh -b feature/ui-refresh
git worktree add ../inburgering-app-bugfix -b fix/knm-scoring
```

### Step 2: Push each branch immediately

```bash
cd ../inburgering-app-auth && git push -u origin feature/auth
cd ../inburgering-app-ui-refresh && git push -u origin feature/ui-refresh
cd ../inburgering-app-bugfix && git push -u origin fix/knm-scoring
```

### Step 3: Open 3 terminals, launch Claude in each

```bash
# Terminal 1
cd ~/path/to/inburgering-app-auth
claude

# Terminal 2
cd ~/path/to/inburgering-app-ui-refresh
claude

# Terminal 3
cd ~/path/to/inburgering-app-bugfix
claude
```

### Step 4: Work — commit & push frequently

Each session works independently. Commit after each meaningful unit:
- A component works
- A bug is fixed
- Tests pass

Push before stepping away (lunch, meetings, end of day).

### Step 5: When done — push and create PR

```bash
git push
# Create PR on GitHub
gh pr create --title "Add auth flow" --body "Description here"
```

### Step 6: Merge on GitHub (NOT locally)

Merge PRs through the GitHub UI. Do **not** run `git merge` locally on main — this avoids tangled history and ensures CI runs.

### Step 7: Clean up each merged worktree

```bash
# Go back to main repo
cd ~/path/to/inburgering-app

# Remove worktree, delete local and remote branch
git worktree remove ../inburgering-app-auth
git branch -d feature/auth
git push origin --delete feature/auth

# Pull merged changes
git pull
```

### Step 8: Sync remaining active worktrees with main

If other worktrees are still active after a merge:

```bash
cd ~/path/to/inburgering-app-ui-refresh
git fetch origin
git rebase origin/main
```

## Quick Reference Cheat Sheet

| When | Do |
|------|-----|
| New feature | `git worktree add ../inburgering-app-name -b feature/name` → push → `claude` |
| Completed a piece | Commit (`/commit` or "commit this") |
| Stepping away | Push |
| Done for the day | Commit and push, then close terminal |
| PR merged | Remove worktree → delete branch → pull main |
| Long-lived branch | `git fetch origin && git rebase origin/main` |

## Naming Conventions

- **Worktree folder:** `inburgering-app-{short-name}`
- **Branch:** `feature/{short-name}`, `fix/{short-name}`, `refactor/{short-name}`

Examples:

```bash
git worktree add ../inburgering-app-dark-mode -b feature/dark-mode
git worktree add ../inburgering-app-knm-fix -b fix/knm-scoring
git worktree add ../inburgering-app-perf -b refactor/performance
```

## Common Mistakes

| Mistake | Why It's Bad | Prevention |
|---------|--------------|------------|
| Working on main | Features get tangled, hard to review | Always create a feature branch |
| Not pushing branch | Work is unprotected, invisible to others | Push immediately after creating |
| Uncommitted work | Easy to lose, causes merge conflicts | Commit after each unit of work |
| Local merges to main | Bypasses CI, tangles history | Always merge via GitHub PR |
| Stale branches | Drift from main, painful merges | Keep branches short-lived (days, not weeks) |
| Zombie worktrees | Clutter, confusion about what's active | Clean up immediately after merge |

## End of Day Checklist

1. All work committed?
2. All branches pushed?
3. Any worktrees that should be cleaned up?

```bash
# Quick status check
git worktree list
# For each worktree:
cd ../inburgering-app-feature && git status
```

## Troubleshooting

### Error: "Branch already exists"

```bash
# Check out the existing branch into a worktree instead
git worktree add ../inburgering-app-existing feature/existing-branch
```

### Error: "Directory already exists"

```bash
# Remove the directory first, then recreate
rm -rf ../inburgering-app-feature
git worktree add ../inburgering-app-feature -b feature/name
```

### Worktree is locked

```bash
git worktree unlock ../inburgering-app-feature
```

### Stale worktree metadata (directory was deleted manually)

```bash
git worktree prune
```

## Git Command Reference

| Command | Purpose |
|---------|---------|
| `git worktree add <path> -b <branch>` | Create new worktree with new branch |
| `git worktree add <path> <existing-branch>` | Create worktree from existing branch |
| `git worktree list` | Show all worktrees |
| `git worktree remove <path>` | Remove a worktree |
| `git worktree prune` | Clean up stale worktree metadata |
| `git worktree lock <path>` | Prevent automatic pruning |
| `git worktree unlock <path>` | Allow automatic pruning |
