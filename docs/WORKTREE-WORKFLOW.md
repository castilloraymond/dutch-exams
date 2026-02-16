# Git Worktree Workflow — Permanent 3-Worktree Setup

## Overview

This project uses three **permanent** worktrees — one per work domain. They stay on disk at all times. You never create or destroy them for individual tasks; you just `cd` into the right one and start working.

| Worktree Directory | Branch Prefix | Domain |
|---|---|---|
| `inburgering-app-features` | `features/` | New features |
| `inburgering-app-bug-fix` | `fix/` | Bug fixes |
| `inburgering-app-mktg` | `mktg/` | Marketing & content |

Each worktree lives one level up from the main repo (sibling directories). Between tasks, worktrees sit in **detached HEAD** at main's tip — ready for a fresh branch.

## What Goes Where

### Features (`inburgering-app-features`)

New functionality and enhancements:

- AI-powered question explanations
- New mock exam sections
- New module features (vocabulary builder, spaced repetition)
- Exam flow improvements
- New UI components or pages

### Bug Fixes (`inburgering-app-bug-fix`)

Broken things that need fixing:

- Broken exam scoring
- Layout issues on mobile
- Audio player glitches
- Auth flow bugs
- Content typos or errors in JSON files

### Marketing (`inburgering-app-mktg`)

Content, SEO, and growth work:

- New blog posts
- SEO optimization (metadata, schema, sitemap)
- Landing page copy updates
- Testimonials and social proof updates
- Content calendar items

## Daily Workflow — Start of Day

Sync every worktree with main before you start working.

If the worktree is **idle** (detached HEAD, no active branch):

```bash
cd ../inburgering-app-features && git fetch origin && git checkout --detach origin/main
cd ../inburgering-app-bug-fix && git fetch origin && git checkout --detach origin/main
cd ../inburgering-app-mktg && git fetch origin && git checkout --detach origin/main
```

If the worktree has an **active branch** with in-progress work:

```bash
cd ../inburgering-app-features && git fetch origin && git rebase origin/main
```

If there's uncommitted work, commit or stash first, then rebase.

## Working in a Worktree — The Cycle

Every task follows this loop inside the appropriate worktree:

### 1. Go to the worktree

```bash
cd ../inburgering-app-features
```

### 2. Create a descriptive branch

```bash
git checkout -b features/ai-explanations
```

Use the worktree's prefix (`features/`, `fix/`, `mktg/`) so branches sort logically.

### 3. Work and commit

Commit after each meaningful unit of work — a component works, a bug is fixed, a blog post is done.

```bash
git add components/AiExplanation.tsx lib/ai.ts
git commit -m "feat: add AI explanation component for exam questions"
```

Push before stepping away (lunch, meetings, end of day):

```bash
git push -u origin features/ai-explanations
```

### 4. Create a PR and merge on GitHub

```bash
git push
gh pr create --title "Add AI explanations" --body "Description here"
```

Merge through the GitHub UI — never run `git merge` locally on main.

### 5. Reset the worktree for the next task

After the PR is merged, detach from the branch and clean up:

```bash
git fetch origin
git checkout --detach origin/main
git branch -d features/ai-explanations
git push origin --delete features/ai-explanations
```

The worktree is now in detached HEAD at main's tip, ready for the next task.

## A Day in the Life

### Morning — Start a feature

```bash
# Sync all worktrees
cd ../inburgering-app-features && git fetch origin && git checkout --detach origin/main
cd ../inburgering-app-bug-fix && git fetch origin && git checkout --detach origin/main
cd ../inburgering-app-mktg && git fetch origin && git checkout --detach origin/main

# Start working on a new feature
cd ../inburgering-app-features
git checkout -b features/vocab-builder
claude  # launch Claude Code and start building
```

### Midday — Write a blog post while the feature PR is in review

```bash
cd ../inburgering-app-mktg
git checkout -b mktg/exam-tips-post
claude  # write the blog post, commit, push, create PR
```

### Afternoon — A bug report comes in

```bash
cd ../inburgering-app-bug-fix
git checkout -b fix/mobile-scoring-bug

# Fix, commit, push
git add components/ResultsSummary.tsx
git commit -m "fix: correct score calculation on mobile"
git push -u origin fix/mobile-scoring-bug

# Create PR
gh pr create --title "Fix mobile scoring bug" --body "Score was incorrect on small screens due to..."

# After merge, reset for the next bug
git fetch origin && git checkout --detach origin/main
git branch -d fix/mobile-scoring-bug
git push origin --delete fix/mobile-scoring-bug
```

## Ad-Hoc Work (Edge Cases)

Some tasks don't fit the three domains:

- Infrastructure or DevOps changes
- Major refactors that touch everything
- Experimental spikes or prototypes

For these, create a **temporary 4th worktree**, use it, and clean it up when done:

```bash
# Create
git worktree add ../inburgering-app-infra -b refactor/build-config
cd ../inburgering-app-infra
claude

# After merge, remove it
cd ../inburgering-app
git worktree remove ../inburgering-app-infra
git branch -d refactor/build-config
git push origin --delete refactor/build-config
```

## End of Day Checklist

```bash
# Check status of all worktrees
git worktree list
```

For each active worktree:

1. All work committed? (`git status`)
2. Branch pushed to remote? (`git push`)
3. Any merged PRs? Reset that worktree (`git fetch origin && git checkout --detach origin/main`)
4. Clean up merged remote branches

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
