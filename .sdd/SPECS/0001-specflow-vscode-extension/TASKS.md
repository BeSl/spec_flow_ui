# Tasks

## TASK-0001 Create VSCode extension skeleton

Status: done  
Priority: high  
Agent: codex  
DependsOn: none

### Goal

Create the initial TypeScript VSCode extension project structure.

### Acceptance Criteria

- Extension compiles.
- Extension activates.
- `package.json` contains extension metadata.
- `src/extension.ts` exists.
- At least one command can be executed from Command Palette.

### Suggested Files

- `package.json`
- `tsconfig.json`
- `src/extension.ts`
- `src/commands/index.ts`

---

## TASK-0002 Register basic SDD commands

Status: done  
Priority: high  
Agent: codex  
DependsOn: TASK-0001

### Goal

Register initial command palette actions.

### Acceptance Criteria

- `SDD: Initialize Project` command exists.
- `SDD: Create Specification` command exists.
- `SDD: Open Dashboard` command exists.
- `SDD: Validate Project` command exists.

---

## TASK-0003 Implement SDD project initializer

Status: done  
Priority: high  
Agent: codex  
DependsOn: TASK-0002

### Goal

Create `.sdd/` folder structure in the active workspace.

### Acceptance Criteria

- Creates `.sdd/WORKFLOW.md`.
- Creates `.sdd/CONFIG.md`.
- Creates `.sdd/SPECS/`.
- Creates `.sdd/TEMPLATES/`.
- Creates `.sdd/AGENTS/`.
- Does not overwrite existing files without confirmation.

---

## TASK-0004 Add template writer with safe overwrite behavior

Status: done  
Priority: medium  
Agent: codex  
DependsOn: TASK-0003

### Goal

Implement reusable file creation logic for templates.

### Acceptance Criteria

- Can create files from bundled templates.
- Can skip existing files.
- Can ask for overwrite confirmation.
- Reports created/skipped files.

---

## TASK-0005 Implement spec model

Status: done  
Priority: high  
Agent: codex  
DependsOn: TASK-0001

### Goal

Create TypeScript domain models for specs and tasks.

### Acceptance Criteria

- `Spec` type exists.
- `Task` type exists.
- Status types use the simplified status model.
- Models do not depend on VSCode APIs.

---

## TASK-0006 Implement metadata/frontmatter parser

Status: done  
Priority: high  
Agent: codex  
DependsOn: TASK-0005

### Goal

Read metadata from Markdown frontmatter and optional `metadata.json`.

### Acceptance Criteria

- Parses `SPEC.md` frontmatter.
- Reads `metadata.json` if present.
- Handles missing metadata gracefully.
- Has unit tests for parser logic.

---

## TASK-0007 Implement spec scanner

Status: done  
Priority: high  
Agent: codex  
DependsOn: TASK-0006

### Goal

Scan `.sdd/SPECS` and build an in-memory spec tree.

### Acceptance Criteria

- Supports nested folders.
- Detects specs by `SPEC.md`.
- Builds parent-child hierarchy.
- Handles empty workspace state.

---

## TASK-0008 Implement Spec TreeView

Status: done  
Priority: high  
Agent: codex  
DependsOn: TASK-0007

### Goal

Display specs in VSCode sidebar.

### Acceptance Criteria

- TreeView shows specs hierarchically.
- Status icons or labels are visible.
- Clicking a spec opens dashboard or Markdown file.
- Refresh command works.

---

## TASK-0009 Implement Spec Dashboard WebView

Status: done  
Priority: medium  
Agent: codex  
DependsOn: TASK-0008

### Goal

Show a visual dashboard for selected spec.

### Acceptance Criteria

- Shows title, status, priority, type.
- Shows links to SPEC, PLAN, TASKS, DESIGN, ARCHITECTURE.
- Shows task progress summary.
- Provides button to generate prompt.

---

## TASK-0010 Implement Task Board WebView

Status: done  
Priority: medium  
Agent: codex  
DependsOn: TASK-0006

### Goal

Render tasks from `TASKS.md` as cards grouped by status.

### Acceptance Criteria

- Parses task blocks from Markdown.
- Groups cards by status.
- Shows task id, title, status, priority, agent.
- Opens source Markdown on click.

---

## TASK-0011 Implement LLM prompt generator

Status: done  
Priority: high  
Agent: codex  
DependsOn: TASK-0007

### Goal

Generate task-specific prompts from SDD context.

### Acceptance Criteria

- Includes `.sdd/WORKFLOW.md`.
- Includes selected `SPEC.md`.
- Includes selected task from `TASKS.md`.
- Includes acceptance criteria.
- Copies prompt to clipboard.

---

## TASK-0012 Implement SDD validation service

Status: done  
Priority: high  
Agent: codex  
DependsOn: TASK-0007

### Goal

Detect common SDD workflow violations.

### Acceptance Criteria

- Detects missing `.sdd/` folder.
- Detects specs without `SPEC.md`.
- Detects tasks without acceptance criteria.
- Detects implementation tasks under draft specs.
- Reports results in VSCode output channel.

---

## TASK-0013 Add compatibility detection service

Status: done  
Priority: medium  
Agent: codex  
DependsOn: TASK-0007

### Goal

Detect GitHub Spec Kit-like structures and prepare for import.

### Acceptance Criteria

- Detects common spec folders.
- Does not mutate files automatically.
- Reports compatibility findings.

---

## TASK-0014 Add import/mapping design for compatible specs

Status: done  
Priority: low  
Agent: codex  
DependsOn: TASK-0013

### Goal

Design how external spec structures map into SpecFlow.

### Acceptance Criteria

- Mapping documented.
- No destructive conversion.
- User can review before import.
