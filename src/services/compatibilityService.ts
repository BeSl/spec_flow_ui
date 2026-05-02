import { promises as fs } from "node:fs";
import path from "node:path";

export type CompatibilityFinding = {
  label: string;
  matchedPath: string;
  confidence: "high" | "medium";
};

export async function detectCompatibility(workspaceRoot: string): Promise<CompatibilityFinding[]> {
  const findings: CompatibilityFinding[] = [];

  const candidates: Array<{ label: string; relPath: string; confidence: "high" | "medium" }> = [
    { label: "SpecFlow SDD structure", relPath: ".sdd/SPECS", confidence: "high" },
    { label: "GitHub Spec Kit specs", relPath: "specs", confidence: "medium" },
    { label: "Alternative specs folder", relPath: "specifications", confidence: "medium" },
    { label: "Alternative specs folder", relPath: "docs/specs", confidence: "medium" }
  ];

  for (const candidate of candidates) {
    const absolute = path.join(workspaceRoot, ...candidate.relPath.split("/"));
    if (await existsDir(absolute)) {
      findings.push({
        label: candidate.label,
        matchedPath: absolute,
        confidence: candidate.confidence
      });
    }
  }

  const markdownSpecFiles = await collectSpecMarkdownHints(workspaceRoot);
  for (const filePath of markdownSpecFiles) {
    findings.push({
      label: "Markdown spec file hint",
      matchedPath: filePath,
      confidence: "medium"
    });
  }

  return dedupeFindings(findings);
}

async function collectSpecMarkdownHints(workspaceRoot: string): Promise<string[]> {
  const result: string[] = [];
  const maxDepth = 4;

  async function walk(currentPath: string, depth: number): Promise<void> {
    if (depth > maxDepth) {
      return;
    }

    let entries;
    try {
      entries = await fs.readdir(currentPath, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const entryPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name.startsWith(".")) {
          continue;
        }
        await walk(entryPath, depth + 1);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      if (entry.name.toLowerCase() === "spec.md" || entry.name.toLowerCase() === "specification.md") {
        result.push(entryPath);
      }
    }
  }

  await walk(workspaceRoot, 0);
  return result;
}

async function existsDir(targetPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(targetPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

function dedupeFindings(findings: CompatibilityFinding[]): CompatibilityFinding[] {
  const seen = new Set<string>();
  const result: CompatibilityFinding[] = [];
  for (const item of findings) {
    const key = `${item.label}|${item.matchedPath}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(item);
  }
  return result;
}
