# Architecture

## Technology Stack

- Language: TypeScript
- Runtime: VSCode Extension Host
- UI: VSCode TreeView + WebView
- Storage: Markdown + JSON indexes
- Markdown parsing: initially simple parser, later remark/gray-matter if needed
- Tests: VSCode Extension Test Runner or Vitest for pure services

## Modules

```text
src/
  extension.ts
  commands/
  tree/
  webview/
  model/
  parser/
  storage/
  services/
  templates/
  utils/
```

## Core Services

- `SddWorkspaceService` — detects and initializes `.sdd`.
- `SpecService` — loads specs and spec tree.
- `TaskService` — parses and updates tasks.
- `PromptService` — generates LLM prompts.
- `ValidationService` — validates workflow rules.
- `CompatibilityService` — detects GitHub Spec Kit-like structures.

## Data Ownership

Markdown files own the data. JSON indexes can be rebuilt and must not be edited manually.
