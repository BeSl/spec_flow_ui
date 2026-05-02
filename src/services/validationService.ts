import { promises as fs } from "node:fs";
import path from "node:path";
import { parseSpecMetadata } from "../parser/specMetadataParser";
import { parseTasksMarkdown } from "../parser/taskParser";

export type ValidationSeverity = "error" | "warning";

export type ValidationIssue = {
  severity: ValidationSeverity;
  code: string;
  message: string;
  filePath?: string;
};

export async function validateWorkspace(workspaceRoot: string): Promise<ValidationIssue[]> {
  const issues: ValidationIssue[] = [];
  const sddRoot = path.join(workspaceRoot, ".sdd");
  const specsRoot = path.join(sddRoot, "SPECS");

  if (!(await exists(sddRoot))) {
    issues.push({
      severity: "error",
      code: "SDD_MISSING_ROOT",
      message: "Missing .sdd folder. Run 'SDD: Initialize Project'.",
      filePath: sddRoot
    });
    return issues;
  }

  if (!(await exists(specsRoot))) {
    issues.push({
      severity: "warning",
      code: "SDD_MISSING_SPECS",
      message: "Missing .sdd/SPECS folder.",
      filePath: specsRoot
    });
    return issues;
  }

  const specFolders = await collectSpecFolders(specsRoot);
  for (const folder of specFolders) {
    const specPath = path.join(folder, "SPEC.md");
    if (!(await exists(specPath))) {
      issues.push({
        severity: "error",
        code: "SPEC_MISSING_FILE",
        message: "Specification folder does not contain SPEC.md.",
        filePath: folder
      });
      continue;
    }

    const specContent = await fs.readFile(specPath, "utf8");
    const spec = parseSpecMetadata({ specContent, documents: { spec: specPath } });
    const tasksPath = path.join(folder, "TASKS.md");
    if (!(await exists(tasksPath))) {
      continue;
    }

    const tasksContent = await fs.readFile(tasksPath, "utf8");
    const tasks = parseTasksMarkdown(tasksContent);
    for (const task of tasks) {
      if (task.acceptanceCriteria.length === 0) {
        issues.push({
          severity: "warning",
          code: "TASK_MISSING_ACCEPTANCE",
          message: `${task.id} has no acceptance criteria.`,
          filePath: tasksPath
        });
      }

      if (spec.status === "draft" && isImplementationTaskStatus(task.status)) {
        issues.push({
          severity: "error",
          code: "TASK_UNDER_DRAFT_SPEC",
          message: `${task.id} is in '${task.status}' while spec is draft.`,
          filePath: tasksPath
        });
      }
    }
  }

  return issues;
}

function isImplementationTaskStatus(status: string): boolean {
  return status === "ready" || status === "in-progress" || status === "review" || status === "done" || status === "blocked";
}

async function collectSpecFolders(specsRoot: string): Promise<string[]> {
  const folders: string[] = [];

  async function walk(currentFolder: string): Promise<void> {
    const entries = await fs.readdir(currentFolder, { withFileTypes: true });
    const hasMarkdownArtifacts = entries.some((entry) => entry.isFile() && entry.name.endsWith(".md"));
    if (hasMarkdownArtifacts) {
      folders.push(currentFolder);
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        await walk(path.join(currentFolder, entry.name));
      }
    }
  }

  await walk(specsRoot);
  return folders;
}

async function exists(targetPath: string): Promise<boolean> {
  try {
    await fs.stat(targetPath);
    return true;
  } catch {
    return false;
  }
}
