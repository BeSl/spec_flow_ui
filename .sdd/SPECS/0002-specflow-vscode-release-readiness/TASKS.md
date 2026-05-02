# Tasks

## TASK-0001 Add VSCode debug configuration for extension host

Status: done  
Priority: high  
Agent: codex  
DependsOn: none

### Goal

Create `.vscode/launch.json` and related debug settings so the extension can be started and tested in Extension Development Host.

### Acceptance Criteria

- `.vscode/launch.json` exists.
- Extension debug configuration runs without manual tweaks.
- README contains short debug instructions.

---

## TASK-0002 Add extension packaging workflow

Status: done  
Priority: high  
Agent: codex  
DependsOn: TASK-0001

### Goal

Add scripts and dependencies required to build a `.vsix` package locally.

### Acceptance Criteria

- Packaging dependency is added.
- `npm run package` creates `.vsix` artifact.
- Existing build/test scripts continue to pass.

---

## TASK-0003 Add release QA checklist and verification command

Status: done  
Priority: medium  
Agent: codex  
DependsOn: TASK-0002

### Goal

Document and expose repeatable release checks before marking spec done.

### Acceptance Criteria

- QA checklist is documented in spec artifacts.
- Checklist includes TreeView, Dashboard, Task Board, Prompt, Validation, Compatibility checks.
- Results are recorded in `REVIEW.md`.

---

## TASK-0004 Final review and status transition to done

Status: done  
Priority: medium  
Agent: codex  
DependsOn: TASK-0003

### Goal

Complete final review and move spec lifecycle status from `review` to `done`.

### Acceptance Criteria

- `REVIEW.md` checklist is fully checked.
- `STATUS.md` reflects completion.
- No open blockers remain.
