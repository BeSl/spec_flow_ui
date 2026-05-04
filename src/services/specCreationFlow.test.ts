import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createSpecificationInWorkspace } from "./specCreationFlow";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.map(async (dir) => fs.rm(dir, { recursive: true, force: true })));
  tempDirs.length = 0;
});

describe("createSpecificationInWorkspace", () => {
  it("creates a root spec bundle", async () => {
    const root = await mkWorkspace();
    const result = await createSpecificationInWorkspace(root, sampleInput());

    expect(result.specId).toBe("0001-search-filters");
    expect(await exists(path.join(root, ".sdd", "SPECS", result.specId, "SPEC.md"))).toBe(true);
  });

  it("creates a child spec bundle under parent folder", async () => {
    const root = await mkWorkspace();
    const parentPath = path.join(root, ".sdd", "SPECS", "0001-parent");
    await fs.mkdir(parentPath, { recursive: true });

    const result = await createSpecificationInWorkspace(root, sampleInput("Child Feature"), parentPath);

    expect(result.folderPath.startsWith(parentPath)).toBe(true);
    expect(await exists(path.join(parentPath, result.specId, "SPEC.md"))).toBe(true);
  });
});

function sampleInput(title = "Search Filters") {
  return {
    title,
    type: "feature" as const,
    priority: "high" as const,
    owner: "slava",
    problem: "Users cannot filter results.",
    goal: "Add filters.",
    acceptanceCriteria: ["Filters exist", "Results update"],
    createStarterTask: true
  };
}

async function mkWorkspace(): Promise<string> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "specflow-create-flow-"));
  tempDirs.push(root);
  return root;
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.stat(filePath);
    return true;
  } catch {
    return false;
  }
}
