import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { runReleaseQaChecks } from "./releaseQaService";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.map(async (dir) => fs.rm(dir, { recursive: true, force: true })));
  tempDirs.length = 0;
});

describe("runReleaseQaChecks", () => {
  it("passes when required artifacts exist", async () => {
    const root = await mkWorkspace();
    await fs.mkdir(path.join(root, ".vscode"), { recursive: true });
    await fs.mkdir(path.join(root, ".sdd", "SPECS", "0002-specflow-vscode-release-readiness"), { recursive: true });
    await fs.writeFile(path.join(root, ".vscode", "launch.json"), "{}");
    await fs.writeFile(path.join(root, "package.json"), JSON.stringify({ scripts: { package: "vsce package" } }));
    await fs.writeFile(path.join(root, ".sdd", "SPECS", "0002-specflow-vscode-release-readiness", "TESTS.md"), "# Tests");

    const results = await runReleaseQaChecks(root);
    expect(results.every((item) => item.passed)).toBe(true);
  });

  it("fails checks when artifacts are missing", async () => {
    const root = await mkWorkspace();
    await fs.writeFile(path.join(root, "package.json"), JSON.stringify({ scripts: {} }));

    const results = await runReleaseQaChecks(root);
    expect(results.some((item) => !item.passed)).toBe(true);
  });
});

async function mkWorkspace(): Promise<string> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "specflow-release-qa-"));
  tempDirs.push(root);
  return root;
}
