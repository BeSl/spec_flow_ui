import { promises as fs } from "node:fs";
import path from "node:path";

export type QaCheckResult = {
  name: string;
  passed: boolean;
  details: string;
};

export async function runReleaseQaChecks(workspaceRoot: string): Promise<QaCheckResult[]> {
  const launchPath = path.join(workspaceRoot, ".vscode", "launch.json");
  const packagePath = path.join(workspaceRoot, "package.json");
  const testsPath = path.join(workspaceRoot, ".sdd", "SPECS", "0002-specflow-vscode-release-readiness", "TESTS.md");

  const [launchExists, packageData, testsExists] = await Promise.all([
    exists(launchPath),
    readJson(packagePath),
    exists(testsPath)
  ]);

  const scripts = (packageData && typeof packageData === "object" && "scripts" in packageData)
    ? (packageData as { scripts?: Record<string, string> }).scripts
    : undefined;

  const hasPackageScript = Boolean(scripts?.package);

  return [
    {
      name: "Debug config exists",
      passed: launchExists,
      details: launchExists ? launchPath : "Missing .vscode/launch.json"
    },
    {
      name: "Packaging script exists",
      passed: hasPackageScript,
      details: hasPackageScript ? `package script: ${scripts?.package}` : "Missing npm script 'package'"
    },
    {
      name: "QA checklist documented",
      passed: testsExists,
      details: testsExists ? testsPath : "Missing release readiness TESTS.md"
    }
  ];
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath: string): Promise<unknown | undefined> {
  try {
    const text = await fs.readFile(filePath, "utf8");
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}
