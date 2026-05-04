import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createSpecPlan, formatSpecId, getNextSpecNumber, slugifySpecTitle } from "./specCreationService";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.map(async (dir) => fs.rm(dir, { recursive: true, force: true })));
  tempDirs.length = 0;
});

describe("specCreationService", () => {
  it("slugifies spec titles", () => {
    expect(slugifySpecTitle("Hello World Feature")).toBe("hello-world-feature");
    expect(slugifySpecTitle("  Привет мир  ")).toBe("privet-mir");
  });

  it("formats spec ids", () => {
    expect(formatSpecId(3, "Hello World")).toBe("0003-hello-world");
  });

  it("detects next spec number from existing folders", async () => {
    const root = await mkWorkspace();
    const specsRoot = path.join(root, ".sdd", "SPECS");
    await fs.mkdir(path.join(specsRoot, "0001-first"), { recursive: true });
    await fs.mkdir(path.join(specsRoot, "0003-third"), { recursive: true });
    await fs.mkdir(path.join(specsRoot, "notes"), { recursive: true });

    await expect(getNextSpecNumber(specsRoot)).resolves.toBe(4);
  });

  it("builds a creation plan", async () => {
    const root = await mkWorkspace();
    const specsRoot = path.join(root, ".sdd", "SPECS");
    await fs.mkdir(path.join(specsRoot, "0001-first"), { recursive: true });

    const plan = await createSpecPlan(specsRoot, {
      title: "New Feature",
      type: "feature",
      priority: "high",
      owner: "slava",
      problem: "problem",
      goal: "goal",
      acceptanceCriteria: ["works"],
      createStarterTask: true
    });

    expect(plan.specId).toBe("0002-new-feature");
    expect(plan.folderName).toBe("0002-new-feature");
    expect(plan.slug).toBe("new-feature");
  });
});

async function mkWorkspace(): Promise<string> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "specflow-create-spec-"));
  tempDirs.push(root);
  return root;
}
