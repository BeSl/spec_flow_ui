---
id: 0001-specflow-vscode-extension
title: SpecFlow for VSCode Extension Core
type: feature
status: approved
priority: high
owner: slava
created: 2026-04-30
updated: 2026-04-30
---

# Specification: SpecFlow for VSCode Extension Core

## 1. Problem

Developers who use AI coding agents need a structured way to follow Spec-Driven Development directly inside VSCode. Without a repository-native SDD layer, project memory is scattered across chats, issues, Markdown notes, and code comments.

## 2. Goal

Create a VSCode extension that manages SDD files, specification trees, task cards, workflow validation, and LLM prompt generation inside the developer's repository.

## 3. Product Positioning

SpecFlow is not a replacement for GitLab, GitHub, Claude, Codex, Copilot, or GitHub Spec Kit.

SpecFlow is a VSCode-native SDD workspace layer between human intent, repository memory, and AI-assisted implementation.

## 4. Key Feature: GitHub Spec Kit Compatibility

Compatibility with GitHub Spec Kit should be treated as a product feature.

SpecFlow should eventually:

- detect Spec Kit-like project structures;
- import existing specification folders;
- preserve Markdown files;
- visualize specs from compatible folders;
- generate prompts that can be used with common coding agents.

## 5. Users

- Solo developer using Codex, Claude, Copilot, or local LLMs.
- Small team managing development through Markdown and Git.
- Architect maintaining project memory inside the repository.
- Team adopting SDD with GitHub Spec Kit or similar workflows.

## 6. Functional Requirements

### FR-001 Initialize SDD workspace

The extension shall create the `.sdd/` folder structure with default templates and instructions.

### FR-002 Display specification tree

The extension shall display specifications from `.sdd/SPECS` as a hierarchical tree in the VSCode sidebar.

### FR-003 Open specification dashboard

The extension shall open a visual dashboard for a selected specification.

### FR-004 Parse tasks

The extension shall parse `TASKS.md` and display tasks as cards grouped by status.

### FR-005 Generate LLM prompts

The extension shall generate task-specific prompts for Codex, Claude, Copilot, or local LLMs.

### FR-006 Validate SDD workflow

The extension shall validate common workflow rules, including spec approval before implementation.

### FR-007 Preserve Markdown source of truth

The extension shall treat Markdown files as source of truth and JSON indexes as cache only.

## 7. Non-functional Requirements

- Must work offline.
- Must work without a backend in MVP.
- Must be TypeScript-based.
- Must fit naturally into VSCode.
- Must support monorepo structures.
- Must not require direct LLM API access in MVP.

## 8. Out of Scope for MVP

- Full autonomous agent execution.
- Hosted backend.
- Mandatory GitLab/GitHub API integration.
- Cloud sync.
- Real-time collaboration.

## 9. Acceptance Criteria

- User can initialize `.sdd/` in a repository.
- User can create a new specification.
- User can see specs in VSCode TreeView.
- User can open a spec dashboard.
- User can parse and view tasks from `TASKS.md`.
- User can generate and copy an LLM prompt for a selected task.
- User can run validation and see workflow problems.
