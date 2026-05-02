# Repository-level Architecture

SpecFlow for VSCode is a local-first VSCode extension.

## Principles

- Markdown is the source of truth.
- JSON indexes are cache only.
- The extension must work offline.
- The extension must fit naturally into VSCode.
- LLM integrations should start with prompt generation and clipboard workflow.
- GitHub Spec Kit compatibility is a product feature.

## High-level components

```text
VSCode Extension
├── Commands
├── Tree Views
├── WebView Panels
├── Markdown Parsers
├── SDD Storage Services
├── Validation Services
├── Prompt Generator
└── Optional Integrations
```
