import { Task } from "../model";

export type PromptContext = {
  workflowContent: string;
  specContent: string;
  task: Task;
};

export function buildTaskPrompt(context: PromptContext): string {
  const criteria = context.task.acceptanceCriteria.length > 0
    ? context.task.acceptanceCriteria.map((item) => `- ${item}`).join("\n")
    : "- No explicit acceptance criteria provided.";

  return [
    "# SpecFlow Task Prompt",
    "",
    "## Workflow (.sdd/WORKFLOW.md)",
    context.workflowContent.trim(),
    "",
    "## Specification (SPEC.md)",
    context.specContent.trim(),
    "",
    "## Selected Task (TASKS.md)",
    `- ID: ${context.task.id}`,
    `- Title: ${context.task.title}`,
    `- Status: ${context.task.status}`,
    `- Priority: ${context.task.priority}`,
    `- Agent: ${context.task.agent}`,
    `- DependsOn: ${context.task.dependsOn}`,
    "",
    "### Goal",
    context.task.goal || "No goal provided.",
    "",
    "### Acceptance Criteria",
    criteria,
    "",
    "## Instructions",
    "Implement only this task and keep changes scoped to relevant files.",
    "Do not modify unrelated files.",
    "Run tests/build and report what was changed."
  ].join("\n");
}
