# Architecture

## Technology Stack

- Language: TypeScript
- Runtime: VSCode Extension Host
- UI: VSCode InputBox/QuickPick + WebView
- Storage: Markdown + JSON indexes
- Tests: Vitest for services, extension build/package checks

## Modules

```text
src/
  wizard/
  services/
  webview/
  model/
```

## Core Services

- `SpecCreationService` — generates spec ids, slugs, and paths.
- `SpecDocumentFactory` — produces the Markdown documents for a new spec.
- `ProductMapService` — loads specs into a feature map model.
- `SpecCreationWizard` — collects user input and invokes creation flow.

## Data Ownership

Markdown files own the data. JSON metadata is rebuildable cache only.
