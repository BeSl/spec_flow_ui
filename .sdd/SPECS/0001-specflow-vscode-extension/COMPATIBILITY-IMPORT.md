# Compatibility Import Mapping

## Goal

Define how external spec structures can be mapped into SpecFlow without destructive conversion.

## Principles

- Import must be preview-first.
- Source files are never modified during detection and preview.
- Import creates new files in `.sdd/SPECS` and keeps source paths visible.
- User confirms mapping before any write operation.

## Source Patterns

Supported compatibility hints:

- `specs/` (GitHub Spec Kit-like);
- `specifications/`;
- `docs/specs/`;
- standalone `SPEC.md` or `specification.md` files.

## Mapping Table

| External artifact | SpecFlow target |
| --- | --- |
| `specs/<id>/spec.md` or `SPEC.md` | `.sdd/SPECS/<id>/SPEC.md` |
| `specs/<id>/plan.md` or `PLAN.md` | `.sdd/SPECS/<id>/PLAN.md` |
| `specs/<id>/tasks.md` or `TASKS.md` | `.sdd/SPECS/<id>/TASKS.md` |
| `specs/<id>/design.md` or `DESIGN.md` | `.sdd/SPECS/<id>/DESIGN.md` |
| `specs/<id>/architecture.md` or `ARCHITECTURE.md` | `.sdd/SPECS/<id>/ARCHITECTURE.md` |
| `specs/<id>/tests.md` or `TESTS.md` | `.sdd/SPECS/<id>/TESTS.md` |
| metadata sidecar (`metadata.json`) | `.sdd/SPECS/<id>/metadata.json` |

## Import Workflow

1. Detect candidate structures and files.
2. Build in-memory mapping preview.
3. Show per-file actions: create, skip, conflict.
4. Ask explicit user confirmation.
5. Write mapped files to `.sdd/SPECS/<id>/...`.
6. Emit import report with created/skipped/conflicts.

## Conflict Handling

- If target file exists, default action is `skip`.
- User can switch per-file action to `overwrite`.
- `cancel` aborts import with no writes.

## Review Requirements

Before confirming import, user must be able to review:

- source path;
- target path;
- action (`create`, `skip`, `overwrite`);
- conflict reason.

## Non-goals

- No in-place conversion of external files.
- No automatic deletion or renaming.
- No irreversible migration without confirmation.
