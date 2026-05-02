---
id: 0002-specflow-vscode-release-readiness
title: SpecFlow for VSCode Release Readiness
type: enhancement
status: approved
priority: high
owner: slava
created: 2026-05-02
updated: 2026-05-02
---

# Specification: SpecFlow for VSCode Release Readiness

## Problem

Core MVP features are implemented, but release readiness is incomplete: extension packaging flow, manual UX verification, and final artifact consistency are not formalized.

## Goal

Prepare the extension for first internal release with reproducible build/test/package workflow and final QA checklist.

## Functional Requirements

- FR-001 Add extension launch/debug configuration for VSCode Extension Host.
- FR-002 Add packaging command and verify `.vsix` artifact generation.
- FR-003 Add release QA command/checklist integration.
- FR-004 Update status and review artifacts from `review` to `done` after QA pass.

## Non-functional Requirements

- Keep current architecture and command model.
- Do not introduce backend or cloud dependencies.
- Preserve Markdown as source of truth.

## Out of Scope

- Marketplace publishing automation.
- Telemetry and analytics.
- Remote collaboration features.

## Acceptance Criteria

- Extension can be launched in Extension Development Host via checked-in debug config.
- Project can produce a `.vsix` package locally.
- Release QA checklist is documented and executable.
- Spec status is moved to `done` after checklist completion.
