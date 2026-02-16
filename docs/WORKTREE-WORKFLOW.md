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

## Working with Claude Code

Claude Code is your primary tool for writing code, running git commands, and creating PRs. Here's how to use it effectively within the worktree workflow.

### Starting a Session

Always `cd` into the correct worktree **before** launching Claude Code:

```bash
cd ../inburgering-app-features
claude
```

Claude Code inherits your working directory. If you launch it from the wrong worktree, every git command it runs will happen in the wrong place.

**Quick sanity check inside a session:** Ask Claude Code "What directory are we in?" or just have it run `pwd`.

### Let Claude Code Handle Git

You don't need to memorize git commands. Tell Claude Code what you want in plain English:

| You say | Claude Code does |
|---------|-----------------|
| "Create a branch for adding vocabulary flashcards" | `git checkout -b features/vocab-flashcards` |
| "Commit what we have so far" | Stages relevant files, writes a commit message |
| "Push this up" | `git push -u origin features/vocab-flashcards` |
| "Create a PR for this" | Runs `gh pr create` with a title and summary |
| "We're done, clean up the worktree" | Detaches HEAD, deletes local and remote branch |

You can also say things like "commit and push everything, then create a PR" and Claude Code will chain the steps together.

### Handling "I Just Had an Idea!" Moments

You're mid-session working on a feature, and suddenly you think of a bug fix or a marketing task. **Don't context-switch.** Here's what to do:

1. **Tell Claude Code to park it.** Say: "Hey, quick aside — I want to remember to [idea]. Can you note it down?"
2. **Claude Code creates a GitHub Issue** (or you can do it manually later). Tag it with `[FEATURE]`, `[FIX]`, or `[MKTG]` in the title.
3. **Go back to what you were doing.** The idea is captured. It's not going anywhere.

If the idea is truly urgent (production is broken), commit your current work first:

```
"Commit what we have as a WIP, push it, then let's switch to the bug-fix worktree."
```

### Using Plan Mode for Bigger Work

If a task will touch more than 2-3 files, ask Claude Code to plan first:

```
"I want to add spaced repetition to the vocab builder. Can you plan this out before we start coding?"
```

Claude Code will enter plan mode — it'll explore the codebase, identify which files to create or change, and present a step-by-step plan for your approval before writing any code.

## Working from Claude Mobile App

The Claude mobile app is great for thinking, not for coding. Use it when you're away from your desk or want to brainstorm without the pressure of an open editor.

### What Mobile Is Good For

- **Brainstorming features** — "What would a good spaced repetition system look like for this app?"
- **Writing specs** — "Help me write requirements for a progress dashboard"
- **Planning content** — "What should the next 3 blog posts be about?"
- **Drafting copy** — "Write the marketing copy for the pricing page"
- **Triaging bugs** — "A user reported X. What are the likely causes given this codebase?"
- **Thinking through architecture** — "Should I use server components or client components for this?"

### What Mobile Can't Do

Mobile Claude doesn't have access to your codebase, terminal, or git. It can't:

- Read or edit files
- Run `npm run build` or any commands
- Create branches, commit, or push
- Create PRs or issues

It's a thinking partner, not a coding partner.

### Capturing Ideas on Mobile

When an idea hits, capture it at the right level of detail:

**Quick note** (30 seconds) — Just the core idea:
> "Feature idea: add a streak counter to the dashboard that shows consecutive days practiced"

**Structured idea** (2-3 minutes) — The what and why:
> "Feature: streak counter on dashboard. Why: motivation and retention. Shows consecutive days with at least one exercise completed. Resets at midnight CET. Display as a flame icon with number."

**Full spec** (10-15 minutes) — Ready to hand off to Claude Code:
> Ask mobile Claude: "Help me spec out a streak counter feature. Here's what I'm thinking..." and have a back-and-forth conversation until the spec is solid.

### The Mobile-to-Desktop Handoff

When you've brainstormed something on mobile and want to build it, ask mobile Claude:

> "Summarize everything we discussed into a session prompt I can paste into Claude Code."

Mobile Claude will produce a condensed summary with:
- What to build
- Key decisions made
- Technical constraints discussed
- Suggested approach

Copy that summary, open Claude Code in the right worktree, and paste it in:

```bash
cd ../inburgering-app-features
git checkout -b features/streak-counter
claude
# Paste the session prompt from mobile
```

## Staying Organized (Anti-Chaos Guide)

Ideas come fast. Without a system, you'll end up with half-finished branches everywhere. Here's how to stay sane.

### The Parking Lot — GitHub Issues

Every idea that isn't your current task goes into a GitHub Issue. Tag the title so you know which worktree it belongs to:

- `[FEATURE] Add streak counter to dashboard`
- `[FIX] Audio player skips on Safari`
- `[MKTG] Write blog post about KNM exam changes`

You can create these from Claude Code mid-session:

```
"Create a GitHub issue titled '[FEATURE] Add streak counter to dashboard' with a short description."
```

Or jot them down on mobile and batch-create them later.

### One Active Branch Per Worktree

This is the golden rule. Each worktree should have **at most one** active branch at a time. If you want to start something new, finish (or park) what you're working on first.

**Before starting new work**, check:

```bash
git worktree list
```

If a worktree shows a branch name instead of `(detached HEAD)`, there's work in progress. Either finish it or commit a WIP:

```bash
git add -A && git commit -m "WIP: [what you were doing]"
git push -u origin features/whatever
```

### Am I in the Right Worktree?

Use this quick-reference when you're about to start working:

| Your task is about... | Go to | Branch prefix |
|---|---|---|
| New page, component, or feature | `inburgering-app-features` | `features/` |
| Something is broken or wrong | `inburgering-app-bug-fix` | `fix/` |
| Blog post, SEO, landing page copy | `inburgering-app-mktg` | `mktg/` |
| Not sure | Ask yourself: "Am I adding, fixing, or marketing?" |

### Recovery Recipes

Things go wrong. Here's how to fix common mistakes.

**Accidentally made changes on main (not committed yet):**

```bash
# Stash your changes
git stash

# Go to the right worktree and create a branch
cd ../inburgering-app-features
git checkout -b features/my-work

# Pop the stash (this works across worktrees if they share the repo)
git stash pop
```

**Accidentally committed to main:**

```bash
# Note the commit hash
git log --oneline -1
# e.g., abc1234

# Undo the commit on main (keeps your changes)
git reset --soft HEAD~1

# Stash the changes
git stash

# Go to the right worktree
cd ../inburgering-app-features
git checkout -b features/my-work
git stash pop
git add -A && git commit -m "feat: description of what you did"
```

**Accidentally pushed to main:**

Stop. Don't try to fix this yourself. Ask Claude Code:

> "I accidentally pushed a commit to main. Help me revert it safely."

Claude Code will create a revert commit (safe) rather than force-pushing (dangerous).

**Started work in the wrong worktree:**

```bash
# Commit your work-in-progress
git add -A && git commit -m "WIP: moving to correct worktree"

# Note the commit hash
git log --oneline -1
# e.g., abc1234

# Go to the correct worktree and create a branch
cd ../inburgering-app-bug-fix
git checkout -b fix/the-actual-fix

# Cherry-pick your work
git cherry-pick abc1234

# Go back to the wrong worktree and undo
cd ../inburgering-app-features
git reset --hard HEAD~1
git checkout --detach origin/main
```

Or just tell Claude Code: "I started this bug fix in the features worktree by mistake. Help me move it to bug-fix."

### Context-Switching Safely

If you need to pause one task and start another in a different worktree:

1. **Commit a WIP** in your current worktree:
   ```bash
   git add -A && git commit -m "WIP: halfway through vocab builder UI"
   git push
   ```
2. **Switch** to the other worktree and do your work there.
3. **Come back** and pick up where you left off — your WIP commit is waiting.

Don't leave uncommitted changes when switching. They can cause confusion across worktrees.

## Parallel Claude Code Sessions

You can run Claude Code in multiple terminal tabs at the same time, one per worktree. This lets you work on independent tasks in parallel.

### When It Works Well

- A feature in `inburgering-app-features` + a blog post in `inburgering-app-mktg`
- A bug fix in `inburgering-app-bug-fix` + a content update in `inburgering-app-mktg`
- Any two tasks that touch **completely different files**

### When It Doesn't Work

Avoid parallel sessions when both tasks touch the same high-impact files:

| File | Why it's risky |
|---|---|
| `lib/types.ts` | Shared interfaces — parallel changes will conflict |
| `lib/content.ts` | Central content loader — imports every content file |
| `app/globals.css` | Design tokens — changes affect everything |
| `app/layout.tsx` | Root layout — wraps the entire app |
| `components/landing/index.ts` | Barrel exports — ordering can conflict |

If both tasks need `lib/types.ts`, do them sequentially. Merge one PR first, sync the other worktree, then continue.

### Practical Limits

**Max 2 active sessions** is the sweet spot for a solo developer. With 3 sessions you'll spend more time context-switching than coding. One focused session usually beats two distracted ones.

### Keeping Sessions Straight

With multiple terminals open, it's easy to forget which is which:

- **Label your terminal tabs** — "Features: vocab-builder" and "Mktg: blog-post"
- **Ask Claude Code** — Say "What branch are we on?" if you're unsure
- **Check the prompt** — Your terminal prompt may show the directory or branch name
- **Use `pwd`** — Quickest way to confirm you're in the right place

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
