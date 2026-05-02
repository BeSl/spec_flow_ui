import { describe, expect, it } from "vitest";
import { buildTaskPrompt } from "./promptService";

describe("buildTaskPrompt", () => {
  it("includes workflow, spec, task and acceptance criteria", () => {
    const prompt = buildTaskPrompt({
      workflowContent: "# Workflow\nNo implementation before approved spec.",
      specContent: "# Spec\nCore feature",
      task: {
        id: "TASK-0011",
        title: "Implement prompt",
        status: "ready",
        priority: "high",
        agent: "codex",
        dependsOn: "TASK-0007",
        goal: "Generate useful prompt",
        acceptanceCriteria: ["Includes workflow", "Copies to clipboard"]
      }
    });

    expect(prompt).toContain("## Workflow (.sdd/WORKFLOW.md)");
    expect(prompt).toContain("## Specification (SPEC.md)");
    expect(prompt).toContain("## Selected Task (TASKS.md)");
    expect(prompt).toContain("TASK-0011");
    expect(prompt).toContain("- Includes workflow");
    expect(prompt).toContain("- Copies to clipboard");
  });
});
