import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { validateWorkspace } from "./validationService";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.map(async (dir) => fs.rm(dir, { recursive: true, force: true })));
  tempDirs.length = 0;
});

describe("validateWorkspace", () => {
  it("detects missing .sdd folder", async () => {
    const root = await createWorkspace();
    const issues = await validateWorkspace(root);
    expect(issues.some((issue) => issue.code === "SDD_MISSING_ROOT")).toBe(true);
  });

  it("detects folder without SPEC.md", async () => {
    const root = await createWorkspace();
    const specFolder = path.join(root, ".sdd", "SPECS", "001-without-spec");
    await fs.mkdir(specFolder, { recursive: true });
    await fs.writeFile(path.join(specFolder, "TASKS.md"), "# Tasks\n");

    const issues = await validateWorkspace(root);
    expect(issues.some((issue) => issue.code === "SPEC_MISSING_FILE")).toBe(true);
  });

  it("detects tasks without acceptance criteria and tasks under draft spec", async () => {
    const root = await createWorkspace();
    const specFolder = path.join(root, ".sdd", "SPECS", "0001-demo");
    await fs.mkdir(specFolder, { recursive: true });
    await fs.writeFile(path.join(specFolder, "SPEC.md"), ["---", "id: demo", "title: Demo", "status: draft", "---", "# Spec"].join("\n"));
    await fs.writeFile(
      path.join(specFolder, "TASKS.md"),
      [
        "# Tasks",
        "",
        "## TASK-0001 Example",
        "",
        "Status: ready",
        "Priority: high",
        "Agent: codex",
        "DependsOn: none",
        "",
        "### Goal",
        "",
        "Implement feature"
      ].join("\n")
    );

    const issues = await validateWorkspace(root);
    expect(issues.some((issue) => issue.code === "TASK_MISSING_ACCEPTANCE")).toBe(true);
    expect(issues.some((issue) => issue.code === "TASK_UNDER_DRAFT_SPEC")).toBe(true);
  });
});

async function createWorkspace(): Promise<string> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "specflow-validation-"));
  tempDirs.push(root);
  return root;
}
