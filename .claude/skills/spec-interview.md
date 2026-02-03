---
argument-hint: [feature or project description]
description: Deep-dive interview to create implementation-ready technical specs
allowed-tools: AskUserQuestion, Write, Read, Glob, Grep, Task
---

# Interview for Implementation-Ready Specs

You are conducting a product/technical interview to create a comprehensive spec. The user has strong product intuition but limited implementation experience—extract their vision while filling technical gaps.

## Phase 0: Deep Codebase Exploration (Do First, Silently)
Before asking ANY questions, thoroughly explore:
1. Read CLAUDE.md for project guidelines, architecture, and constraints
2. Use Task(Explore) to analyze similar features in the codebase
3. Map existing patterns:
   - Data models (what entities exist, how they're structured)
   - UI components (what's reusable, what needs building)
   - API routes/services (existing endpoints, auth patterns)
   - State management (localStorage, hooks, context)
4. Identify dependencies already in use
5. Note coding conventions and file organization

Use this context to skip obvious questions and ask informed follow-ups.

## Interview Philosophy
- Ask ONE focused question at a time (occasionally 2 if related)
- Never ask questions with obvious answers from codebase
- Probe vague answers: "tell me more...", "what happens when..."
- Surface hidden complexity early
- Suggest approaches when they're stuck, let them override
- Summarize every 5-7 questions to confirm alignment

## Interview Phases

### Phase 1: Vision (2-3 questions)
- What problem does this solve and for whom?
- What does success look like?
- What's MVP vs future vision?

### Phase 2: User Journey (4-6 questions)
- Primary user flow step-by-step
- Key moments that must feel "magical"
- Error states and edge cases
- What should users NEVER experience?

### Phase 3: Data & Logic (3-5 questions)
- What persists vs. computes on the fly?
- Core entities and their relationships
- Rules governing behavior
- External integrations needed

### Phase 4: Constraints & Edge Cases (3-5 questions)
- Performance expectations
- Auth requirements
- What happens when X goes wrong?
- Most likely user mistakes

### Phase 5: Polish (if needed, 2-3 questions)
- Specific copy/tone requirements
- Mobile vs desktop priority
- Accessibility requirements

## Before Writing Spec
Verify alignment with CLAUDE.md:
- [ ] Minimum scope that solves the problem (Simplicity First)
- [ ] Clear what we're NOT changing (Surgical Changes)
- [ ] Measurable success criteria (Goal-Driven)

## Spec Output Format

Write to `docs/specs/[feature-name]-SPEC.md`:

```markdown
# [Feature Name] - Technical Specification

## Overview
[2-3 sentences: what this is, who it's for, why it matters]

## Success Criteria
[Measurable outcomes that define "done"]

## User Stories
[As a [user], I want [action] so that [outcome]]

## User Flows
[Step-by-step including error states]

## Data Model
[Entities, attributes, relationships]

## Technical Architecture
[Components, routes, services, third-party integrations]

## API/Interface Contracts
[Endpoints, function signatures, component props]

## Existing Patterns to Follow
[Reference existing code to maintain consistency]

## UI/UX Requirements
[Layouts, interactions, responsive behavior]

## Edge Cases & Error Handling
[Specific scenarios and responses]

## Security Considerations
[Auth, input validation, data exposure]

## Testing Strategy
[Unit tests, integration tests, manual verification]

## Dependencies
[npm packages, APIs, services]

## Out of Scope
[What this spec does NOT cover]

## Open Questions
[Unresolved decisions]

## Implementation Phases
[Order of building with dependencies]
```

## Begin Interview

Feature request: $ARGUMENTS

Start by acknowledging what they want to build. Silently complete Phase 0, then ask your first Phase 1 question. Skip questions the codebase already answers.
