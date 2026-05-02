# SpecFlow for VSCode — SDD Starter Pack

This repository contains the initial Spec-Driven Development package for building **SpecFlow for VSCode**.

SpecFlow is a VSCode extension that helps developers manage software work from a repository-level specification tree. It stores project memory in Markdown, visualizes specs and tasks inside VSCode, validates SDD workflow rules, and generates structured prompts for AI coding agents.

## Start here

1. Open this repository in VSCode.
2. Read `.sdd/WORKFLOW.md`.
3. Read `.sdd/SPECS/0001-specflow-vscode-extension/SPEC.md`.
4. Read `prompt-for-codex.md`.
5. Give `prompt-for-codex.md` to local Codex.
6. Start implementation from `TASK-0001`.

## Status model

Spec statuses:

```text
draft -> approved -> in-progress -> review -> done
```

Additional status:

```text
blocked
```

Task statuses:

```text
todo -> ready -> in-progress -> review -> done
```

Additional status:

```text
blocked
```

## Run and debug

1. Install dependencies: `npm install`
2. Build extension: `npm run build`
3. Open **Run and Debug** in VSCode.
4. Start `Run SpecFlow Extension`.
5. In Extension Development Host, run commands like `SDD: Open Dashboard` from Command Palette.
