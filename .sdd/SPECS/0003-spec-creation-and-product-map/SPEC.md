---
id: 0003-spec-creation-and-product-map
title: Spec Creation Wizard and Product Map
type: feature
status: done
priority: high
owner: slava
created: 2026-05-02
updated: 2026-05-02
---

# Specification: Spec Creation Wizard and Product Map

## Problem

Creating a new specification currently requires editing Markdown files manually. Product feature planning is also fragmented across dashboards and task boards, making it hard to visualize the product in one place.

## Goal

Add a native VSCode wizard for creating new specifications and a Product Map view that visualizes product features, so users can stay inside the UI instead of returning to raw code and Markdown.

## Functional Requirements

- FR-001 Provide a native VSCode wizard for creating a new spec.
- FR-002 Generate the full spec document set from wizard input.
- FR-003 Automatically refresh the spec tree and open the newly created spec dashboard.
- FR-004 Provide a Product Map WebView that visualizes all specs as product features.
- FR-005 Support Russian UI labels in WebViews and notifications.
- FR-006 Show documents with entity-first presentation and file link as a small secondary label.

## Non-functional Requirements

- Must remain TypeScript-based.
- Must preserve Markdown as source of truth.
- Must work offline and without a backend.
- Must keep the current release flow intact.

## Out of Scope

- Marketplace publishing automation.
- Cloud sync.
- Collaborative editing.

## Acceptance Criteria

- User can create a spec through a wizard.
- User can see a Product Map of all specs.
- New specs are created with a full Markdown document set.
- Tree view refreshes after spec creation.
- UI uses Material-style cards and supports Russian localization.
