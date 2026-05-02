import { describe, expect, it } from "vitest";
import { parseTasksMarkdown } from "./taskParser";

describe("parseTasksMarkdown", () => {
  it("parses task blocks from markdown", () => {
    const tasks = parseTasksMarkdown(`
# Tasks

## TASK-0001 First task

Status: ready
Priority: high
Agent: codex
DependsOn: none

### Goal

Implement first thing.

### Acceptance Criteria

- It works
- It is tested

---

## TASK-0002 Second task

Status: todo
Priority: medium
Agent: claude
DependsOn: TASK-0001

### Goal

Implement second thing.

### Acceptance Criteria

- Done
`);

    expect(tasks).toHaveLength(2);
    expect(tasks[0].id).toBe("TASK-0001");
    expect(tasks[0].title).toBe("First task");
    expect(tasks[0].status).toBe("ready");
    expect(tasks[0].acceptanceCriteria).toEqual(["It works", "It is tested"]);
    expect(tasks[1].dependsOn).toBe("TASK-0001");
  });

  it("handles missing sections gracefully", () => {
    const tasks = parseTasksMarkdown("## TASK-0001 Only header");
    expect(tasks).toHaveLength(1);
    expect(tasks[0].goal).toBe("");
    expect(tasks[0].acceptanceCriteria).toEqual([]);
    expect(tasks[0].status).toBe("todo");
  });
});
