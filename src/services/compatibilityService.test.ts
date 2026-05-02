import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { detectCompatibility } from "./compatibilityService";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.map(async (dir) => fs.rm(dir, { recursive: true, force: true })));
  tempDirs.length = 0;
});

describe("detectCompatibility", () => {
  it("detects known spec folders", async () => {
    const root = await mkWorkspace();
    await fs.mkdir(path.join(root, ".sdd", "SPECS"), { recursive: true });
    await fs.mkdir(path.join(root, "specs"), { recursive: true });

    const findings = await detectCompatibility(root);
    expect(findings.some((f) => f.label === "SpecFlow SDD structure")).toBe(true);
    expect(findings.some((f) => f.label === "GitHub Spec Kit specs")).toBe(true);
  });

  it("detects markdown spec hints", async () => {
    const root = await mkWorkspace();
    const docFolder = path.join(root, "docs", "design");
    await fs.mkdir(docFolder, { recursive: true });
    await fs.writeFile(path.join(docFolder, "SPEC.md"), "# Spec\n");

    const findings = await detectCompatibility(root);
    expect(findings.some((f) => f.label === "Markdown spec file hint")).toBe(true);
  });
});

async function mkWorkspace(): Promise<string> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "specflow-compat-"));
  tempDirs.push(root);
  return root;
}
