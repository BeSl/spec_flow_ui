import { CreateSpecInput, CreateSpecPlan } from "../model/createSpec";

export type SpecDocumentBundle = Record<string, string>;

export function buildSpecDocumentBundle(input: CreateSpecInput, plan: CreateSpecPlan): SpecDocumentBundle {
  const now = new Date().toISOString().split("T")[0];
  const metadata = buildMetadataJson(input, plan, now);

  return {
    "SPEC.md": buildSpecMarkdown(input, plan, now),
    "PLAN.md": buildPlanMarkdown(plan),
    "TASKS.md": buildTasksMarkdown(input, plan),
    "TESTS.md": buildTestsMarkdown(input),
    "DESIGN.md": buildDesignMarkdown(input),
    "STATUS.md": buildStatusMarkdown(input, plan),
    "REVIEW.md": buildReviewMarkdown(plan),
    "metadata.json": JSON.stringify(metadata, null, 2) + "\n"
  };
}

function buildMetadataJson(input: CreateSpecInput, plan: CreateSpecPlan, now: string) {
  return {
    id: plan.specId,
    title: input.title,
    type: input.type,
    status: "draft",
    priority: input.priority,
    owner: input.owner,
    created: now,
    updated: now
  };
}

function buildSpecMarkdown(input: CreateSpecInput, plan: CreateSpecPlan, now: string): string {
  return `---
id: ${plan.specId}
title: ${input.title}
type: ${input.type}
status: draft
priority: ${input.priority}
owner: ${input.owner}
created: ${now}
updated: ${now}
---

# Specification: ${input.title}

## Problem

${input.problem}

## Goal

${input.goal}

## Functional Requirements

- FR-001 ...

## Non-functional Requirements

- Must work offline.

## Out of Scope

- ...

## Acceptance Criteria

${input.acceptanceCriteria.map((item) => `- ${item}`).join("\n") || "- ..."}

## Open Questions

- ...
`;
}

function buildPlanMarkdown(plan: CreateSpecPlan): string {
  return `# Implementation Plan

## Phase 1: Foundation

Goal: Implement the first pass for ${plan.specId}.

Tasks:

- TASK-0001 Implement the initial spec for ${plan.specId}
`;
}

function buildTasksMarkdown(input: CreateSpecInput, plan: CreateSpecPlan): string {
  const starterTask = input.createStarterTask
    ? `## TASK-0001 Implement ${input.title}

Status: ready  
Priority: high  
Agent: codex  
DependsOn: none

### Goal

Implement the initial set of changes for this specification.

### Acceptance Criteria

- Specification is understood and implementation can begin.
- Initial change scope is defined.

### Suggested Files

- ...
`
    : `## TASK-0001 Example task

Status: todo  
Priority: medium  
Agent: codex  
DependsOn: none

### Goal

Describe the task goal.

### Acceptance Criteria

- ...

### Suggested Files

- ...
`;

  return `# Tasks

${starterTask}`;
}

function buildTestsMarkdown(input: CreateSpecInput): string {
  return `# Tests

## Unit Tests

- ...

## Integration Tests

- ...

## Manual Tests

- Verify ${input.title} behavior in the UI.

## Acceptance Tests

- ${input.title} can be validated without reading implementation details.
`;
}

function buildDesignMarkdown(input: CreateSpecInput): string {
  return `# Design

## Overview

Describe the design for ${input.title}.

## UI Areas

- ...

## Notes

- ...
`;
}

function buildStatusMarkdown(input: CreateSpecInput, plan: CreateSpecPlan): string {
  return `# Status

Current status: draft

## Current focus

Create the first implementation tasks for ${plan.specId}.

## Blockers

None.

## Next action

Review and refine the spec before implementation.
`;
}

function buildReviewMarkdown(plan: CreateSpecPlan): string {
  return `# Review

## Review Checklist

- [ ] Spec content is complete.
- [ ] Acceptance criteria are clear.
- [ ] Task list is actionable.
- [ ] Status can move from draft to approved.

## Review Notes

- Review pending for ${plan.specId}.
`;
}
