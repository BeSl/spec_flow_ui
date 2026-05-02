# SDD Workflow

SpecFlow follows a simple Spec-Driven Development workflow.

## Core rule

No implementation starts before the relevant specification is approved.

## Specification lifecycle

```text
draft -> approved -> in-progress -> review -> done
```

Use `blocked` when progress is impossible without a decision, dependency, or missing information.

## Task lifecycle

```text
todo -> ready -> in-progress -> review -> done
```

Use `blocked` when the task cannot continue.

## Human + AI workflow

1. Developer and AI prepare or refine `SPEC.md`.
2. Developer approves the spec by setting status to `approved`.
3. AI prepares or updates `PLAN.md` and `TASKS.md`.
4. Developer selects a task and marks it `ready`.
5. AI implements only the selected task.
6. Developer reviews the result.
7. AI fixes issues or writes tests.
8. Developer runs tests and marks the task `done`.

## Guardrails

- Do not implement from a `draft` spec.
- Do not mark a task `done` without acceptance criteria.
- Do not change unrelated files.
- Do not introduce architecture changes without an ADR.
- Do not treat JSON indexes as source of truth.
- Keep Markdown readable for humans and LLMs.
