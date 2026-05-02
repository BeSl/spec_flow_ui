# ADR-0003 Treat GitHub Spec Kit Compatibility as a Product Feature

Status: accepted  
Date: 2026-04-30

## Context

GitHub Spec Kit popularizes Spec-Driven Development through CLI commands, templates, and agent-oriented workflows. SpecFlow should not compete with it directly. Instead, SpecFlow should become a visual and repository-native VSCode layer that can coexist with Spec Kit projects.

## Decision

SpecFlow will support compatibility with GitHub Spec Kit concepts and folder structures where practical.

Initial compatibility goals:

- Import existing spec folders.
- Detect common spec files.
- Preserve Markdown as source of truth.
- Avoid proprietary-only formats.
- Provide migration helpers later.

## Consequences

Pros:

- Easier adoption by existing SDD users.
- Clear product differentiation.
- Less vendor lock-in.
- More attractive for developers already exploring Spec Kit.

Cons:

- Requires compatibility layer.
- Requires careful mapping between formats.
