# Prompt for local Codex

You are working in a repository for **SpecFlow for VSCode**.

SpecFlow is a VSCode extension for Spec-Driven Development. It stores project memory in Markdown files, visualizes specifications and tasks inside VSCode, validates SDD workflow rules, and generates structured prompts for AI coding agents.

## Read first

Before implementing anything, read these files:

- `.sdd/WORKFLOW.md`
- `.sdd/CONFIG.md`
- `.sdd/LLM.md`
- `.sdd/DECISIONS/ADR-0001-markdown-as-source-of-truth.md`
- `.sdd/DECISIONS/ADR-0002-simple-status-model.md`
- `.sdd/DECISIONS/ADR-0003-github-spec-kit-compatibility.md`
- `.sdd/SPECS/0001-specflow-vscode-extension/SPEC.md`
- `.sdd/SPECS/0001-specflow-vscode-extension/PLAN.md`
- `.sdd/SPECS/0001-specflow-vscode-extension/TASKS.md`
- `.sdd/SPECS/0001-specflow-vscode-extension/ARCHITECTURE.md`
- `.sdd/SPECS/0001-specflow-vscode-extension/DESIGN.md`

## Important decisions

- The project name is **SpecFlow for VSCode**.
- Markdown is the source of truth.
- JSON files under `.sdd/STATE` are cache only.
- GitHub Spec Kit compatibility is a product feature.
- The status model must stay simple.
- MVP must not require backend, cloud, or direct LLM API access.

## Current task

Start with:

```text
TASK-0001 Create VSCode extension skeleton
```

## Task goal

Create the initial TypeScript VSCode extension project structure.

## Acceptance criteria

- Extension compiles.
- Extension activates.
- `package.json` contains extension metadata.
- `src/extension.ts` exists.
- At least one command can be executed from Command Palette.

## Suggested files

- `package.json`
- `tsconfig.json`
- `src/extension.ts`
- `src/commands/index.ts`

## Implementation rules

- Implement only TASK-0001.
- Do not implement the full product in one step.
- Do not add GitLab/GitHub integration yet.
- Do not add backend services.
- Keep the extension simple and compilable.
- Use TypeScript.
- Prefer clean project structure over clever abstractions.

## Required response after implementation

Return:

1. Summary of changes.
2. Changed files.
3. How to build.
4. How to run/debug in VSCode.
5. Risks or assumptions.
6. Recommended next task.
