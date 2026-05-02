import { AgentType, Priority, Task } from "../model";

export function parseTasksMarkdown(content: string): Task[] {
  const lines = content.split("\n");
  const tasks: Task[] = [];
  let i = 0;

  while (i < lines.length) {
    const headerMatch = lines[i].match(/^##\s+(TASK-\d+)\s+(.+)$/);
    if (!headerMatch) {
      i += 1;
      continue;
    }

    const id = headerMatch[1].trim();
    const title = headerMatch[2].trim();
    const blockStart = i;
    i += 1;

    while (i < lines.length && !lines[i].startsWith("## TASK-")) {
      i += 1;
    }

    const block = lines.slice(blockStart, i);
    tasks.push(parseTaskBlock(id, title, block));
  }

  return tasks;
}

function parseTaskBlock(id: string, title: string, lines: string[]): Task {
  const status = parseStatus(readField(lines, "Status") ?? "todo");
  const priority = parsePriority(readField(lines, "Priority") ?? "medium");
  const agent = parseAgent(readField(lines, "Agent") ?? "codex");
  const dependsOn = readField(lines, "DependsOn") ?? "none";
  const goal = readSection(lines, "### Goal").trim();
  const acceptanceCriteria = readBulletSection(lines, "### Acceptance Criteria");

  return {
    id,
    title,
    status,
    priority,
    agent,
    dependsOn,
    goal,
    acceptanceCriteria
  };
}

function readField(lines: string[], field: string): string | undefined {
  const prefix = `${field}:`;
  const match = lines.find((line) => line.trim().startsWith(prefix));
  if (!match) {
    return undefined;
  }
  return match.slice(match.indexOf(":") + 1).trim();
}

function readSection(lines: string[], sectionHeader: string): string {
  const index = lines.findIndex((line) => line.trim() === sectionHeader);
  if (index < 0) {
    return "";
  }

  const content: string[] = [];
  for (let i = index + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.startsWith("### ")) {
      break;
    }
    if (line.startsWith("## TASK-")) {
      break;
    }
    if (line.trim() === "---") {
      break;
    }
    if (line.trim().length === 0 && content.length === 0) {
      continue;
    }
    content.push(line);
  }

  return content.join("\n").trim();
}

function readBulletSection(lines: string[], sectionHeader: string): string[] {
  const section = readSection(lines, sectionHeader);
  if (!section) {
    return [];
  }
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());
}

function parsePriority(value: string): Priority {
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }
  return "medium";
}

function parseAgent(value: string): AgentType {
  if (value === "codex" || value === "claude" || value === "copilot" || value === "local-llm" || value === "human") {
    return value;
  }
  return "codex";
}

function parseStatus(value: string): Task["status"] {
  if (value === "todo" || value === "ready" || value === "in-progress" || value === "review" || value === "done" || value === "blocked") {
    return value;
  }
  return "todo";
}
