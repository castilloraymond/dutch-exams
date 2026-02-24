# Git Worktree Workflow

## Worktree Setup

Three permanent worktrees, one per work domain. They live as sibling directories one level up from the main repo. Between tasks, worktrees sit in **detached HEAD** at main's tip.

| Worktree Directory | Branch Prefix | Use for |
|---|---|---|
| `inburgering-app` | — | Reference only, don't work here |
| `inburgering-app-features` | `features/` | New features, enhancements, new pages/components |
| `inburgering-app-bug-fix` | `fix/` | Bug fixes, layout issues, content errors |
| `inburgering-app-mktg` | `mktg/` | Blog posts, SEO, landing page copy, content calendar |

## How It Works

Claude handles all git operations. No manual commands needed.

**Starting a task:** Tell Claude "start working on [thing]" — Claude will:
1. Check the worktree is clean and up-to-date with main
2. Create a branch with the right prefix
3. Push the branch immediately

**Finishing a task:** Tell Claude "ship it" or "commit and create a PR" — Claude will:
1. Commit, push, and create a PR
2. After you merge on GitHub, tell Claude "PR merged, clean up" — Claude resets the worktree

**If something looks wrong:** Tell Claude "check git health" — Claude will diagnose and fix.

## Parallel Sessions

You can run Claude Code in multiple terminal tabs simultaneously, one per worktree. This works well when tasks touch completely different files.

### When parallel works

- A feature in `inburgering-app-features` + a blog post in `inburgering-app-mktg`
- A bug fix in `inburgering-app-bug-fix` + a content update in `inburgering-app-mktg`
- Any two tasks that touch **completely different files**

### When to go sequential

Avoid parallel sessions when both tasks touch the same high-impact files:

| File | Why it conflicts |
|---|---|
| `lib/types.ts` | Shared interfaces — parallel changes will conflict |
| `lib/content.ts` | Central content loader — imports every content file |
| `app/globals.css` | Design tokens — changes affect everything |
| `app/layout.tsx` | Root layout — wraps the entire app |
| `components/landing/index.ts` | Barrel exports — ordering can conflict |

If both tasks need any of these files, merge one PR first, sync the other worktree, then continue.

### Practical limit

**Max 2 active sessions** is the sweet spot. With 3 sessions you'll spend more time context-switching than coding.

## Ad-Hoc Work

For tasks that don't fit the three domains (infrastructure, major refactors, experimental spikes): tell Claude to create a temporary 4th worktree. Claude will set it up, and clean it up after the PR merges.

## Key Rules

- Never work directly on main — always create a branch in the appropriate worktree
- One active branch per worktree at a time
- Merge via GitHub PR, never locally
- Reset worktrees immediately after PR merge — don't leave them on merged branches
- Never move the repo between storage locations without recreating worktrees (`.git` files use absolute paths)
