# Tasks

## TASK-0001 Implement spec creation model and helpers

Status: done  
Priority: high  
Agent: codex  
DependsOn: none

### Goal

Create helper logic for spec creation input, slug generation, next-number detection, and path/id construction.

### Acceptance Criteria

- `CreateSpecInput` exists.
- Slug helper exists.
- Next spec number helper exists.
- Spec id helper exists.
- No VSCode API dependency.
- Unit tests cover helpers.

---

## TASK-0002 Implement spec document generation service

Status: done  
Priority: high  
Agent: codex  
DependsOn: TASK-0001

### Goal

Generate the full Markdown document set for a new specification.

### Acceptance Criteria

- Creates `SPEC.md`, `PLAN.md`, `TASKS.md`, `TESTS.md`, `DESIGN.md`, `STATUS.md`, `REVIEW.md`, `metadata.json`.
- Does not overwrite existing spec folders.
- Generates starter content from templates.
- Unit tests cover output generation.

---

## TASK-0003 Implement native VSCode create specification wizard

Status: done  
Priority: high  
Agent: codex  
DependsOn: TASK-0002

### Goal

Collect spec input through native VSCode UI and trigger creation.

### Acceptance Criteria

- Command `SDD: Create Specification` starts a wizard.
- Wizard asks title, type, priority, owner, problem, goal, acceptance criteria, starter task option.
- Supports cancel at every step.
- Validates required fields.

---

## TASK-0004 Refresh tree and open new dashboard after creation

Status: done  
Priority: high  
Agent: codex  
DependsOn: TASK-0003

### Goal

Refresh the UI and open the newly created spec after wizard completion.

### Acceptance Criteria

- Tree refreshes after creation.
- New spec appears in the tree.
- New dashboard opens automatically.
- User sees a success notification.

---

## TASK-0005 Add Product Map WebView

Status: done  
Priority: high  
Agent: codex  
DependsOn: TASK-0004

### Goal

Visualize product features in one Material-style view.

### Acceptance Criteria

- Command `SDD: Open Product Map` exists.
- WebView shows all specs as cards.
- Cards show title, status, type, priority, task progress.
- Supports Russian localization.

---

## TASK-0006 Add Product Map actions to Activity Bar and Tree menus

Status: done  
Priority: medium  
Agent: codex  
DependsOn: TASK-0005

### Goal

Make product visualization easy to access from the UI.

### Acceptance Criteria

- Product Map is accessible from the Activity Bar container.
- Product Map action is available in Command Palette.
- Context menu contains useful actions for specs.

---

## TASK-0007 Implement create child specification flow

Status: done  
Priority: medium  
Agent: codex  
DependsOn: TASK-0006

### Goal

Create child specifications from a selected parent spec.

### Acceptance Criteria

- Parent-child creation flow exists.
- Child spec is created under the parent folder.
- Scanner preserves hierarchy.

---

## TASK-0008 Add tests for spec creation and product map data

Status: done  
Priority: high  
Agent: codex  
DependsOn: TASK-0007

### Goal

Cover the new wizard, generators, and map data with tests.

### Acceptance Criteria

- Helper and factory tests exist.
- Scanner still passes after creation.
- Build and test stay green.

---

## TASK-0009 Update SDD templates and docs for UI-first workflow

Status: done  
Priority: medium  
Agent: codex  
DependsOn: TASK-0008

### Goal

Document the UI-first flow and new product map behavior.

### Acceptance Criteria

- README mentions Create Specification and Product Map.
- Manual tests are documented.
- Review checklist updated.

---

## TASK-0010 Package VSIX 0.0.3

Status: done  
Priority: high  
Agent: codex  
DependsOn: TASK-0009

### Goal

Ship the new functionality in a versioned VSIX package.

### Acceptance Criteria

- Version is bumped to `0.0.3`.
- `npm run package` outputs `specflow-vscode-0.0.3.vsix`.
- Build/tests pass.
