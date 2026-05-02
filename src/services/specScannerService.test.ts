import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { scanSpecTree } from "./specScannerService";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.map(async (dir) => fs.rm(dir, { recursive: true, force: true })));
  tempDirs.length = 0;
});

describe("scanSpecTree", () => {
  it("returns empty tree when .sdd/SPECS is missing", async () => {
    const workspaceRoot = await createTempWorkspace();
    const tree = await scanSpecTree(workspaceRoot);
    expect(tree).toEqual([]);
  });

  it("detects specs by SPEC.md and builds nested hierarchy", async () => {
    const workspaceRoot = await createTempWorkspace();
    const rootSpecFolder = path.join(workspaceRoot, ".sdd", "SPECS", "0001-root");
    const childSpecFolder = path.join(rootSpecFolder, "0002-child");

    await fs.mkdir(childSpecFolder, { recursive: true });

    await fs.writeFile(path.join(rootSpecFolder, "SPEC.md"), frontmatter("root", "Root spec"));
    await fs.writeFile(path.join(rootSpecFolder, "PLAN.md"), "# Plan\n");
    await fs.writeFile(path.join(childSpecFolder, "SPEC.md"), frontmatter("child", "Child spec"));

    const tree = await scanSpecTree(workspaceRoot);
    expect(tree).toHaveLength(1);
    expect(tree[0].spec.id).toBe("root");
    expect(tree[0].children).toHaveLength(1);
    expect(tree[0].children[0].spec.id).toBe("child");
    expect(tree[0].spec.documents.plan).toBe(path.join(rootSpecFolder, "PLAN.md"));
  });

  it("ignores folders without SPEC.md", async () => {
    const workspaceRoot = await createTempWorkspace();
    const specsRoot = path.join(workspaceRoot, ".sdd", "SPECS");
    await fs.mkdir(path.join(specsRoot, "notes"), { recursive: true });
    await fs.writeFile(path.join(specsRoot, "notes", "README.md"), "no spec here");

    const tree = await scanSpecTree(workspaceRoot);
    expect(tree).toHaveLength(0);
  });
});

async function createTempWorkspace(): Promise<string> {
  const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), "specflow-scanner-"));
  tempDirs.push(workspaceRoot);
  return workspaceRoot;
}

function frontmatter(id: string, title: string): string {
  return ["---", `id: ${id}`, `title: ${title}`, "status: approved", "priority: high", "---", "# Spec"].join("\n");
}
