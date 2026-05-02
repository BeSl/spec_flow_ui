# ADR-0001 Use Markdown as Source of Truth

Status: accepted  
Date: 2026-04-30

## Context

SpecFlow needs project memory that is readable by developers, reviewable in Git, and easy for LLM agents to consume.

## Decision

Use Markdown files as the source of truth for specifications, plans, tasks, architecture notes, reviews, tests, and prompts.

## Consequences

Pros:

- Git-friendly.
- Human-readable.
- LLM-friendly.
- No database required.
- Easy to review in merge requests.

Cons:

- Requires robust parsing.
- Requires validation.
- Requires careful formatting conventions.
