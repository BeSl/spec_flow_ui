import { promises as fs } from "node:fs";
import path from "node:path";
import { Spec, SpecDocumentPaths, SpecTreeNode } from "../model";
import { parseSpecMetadata } from "../parser/specMetadataParser";

type CandidateSpec = {
  folderPath: string;
  spec: Spec;
};

const SPEC_FILE = "SPEC.md";
const METADATA_FILE = "metadata.json";

export async function scanSpecTree(workspaceRoot: string): Promise<SpecTreeNode[]> {
  const specsRoot = path.join(workspaceRoot, ".sdd", "SPECS");
  const rootExists = await pathExists(specsRoot);
  if (!rootExists) {
    return [];
  }

  const candidates = await collectSpecFolders(specsRoot);
  return buildTree(candidates);
}

export async function findSpecNodeByFolderPath(workspaceRoot: string, folderPath: string): Promise<SpecTreeNode | undefined> {
  const tree = await scanSpecTree(workspaceRoot);
  return findInTree(tree, folderPath);
}

async function collectSpecFolders(specsRoot: string): Promise<CandidateSpec[]> {
  const result: CandidateSpec[] = [];

  async function walk(currentFolder: string): Promise<void> {
    const entries = await fs.readdir(currentFolder, { withFileTypes: true });
    const hasSpec = entries.some((entry) => entry.isFile() && entry.name === SPEC_FILE);

    if (hasSpec) {
      const specFilePath = path.join(currentFolder, SPEC_FILE);
      const metadataPath = path.join(currentFolder, METADATA_FILE);
      const specContent = await fs.readFile(specFilePath, "utf8");
      const metadataJsonContent = (await pathExists(metadataPath)) ? await fs.readFile(metadataPath, "utf8") : undefined;
      const documents = await resolveDocumentPaths(currentFolder);

      result.push({
        folderPath: currentFolder,
        spec: {
          ...parseSpecMetadata({ specContent, metadataJsonContent, documents }),
          taskSummary: documents.tasks ? await parseTaskSummary(documents.tasks) : undefined
        }
      });
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }
      await walk(path.join(currentFolder, entry.name));
    }
  }

  await walk(specsRoot);
  return result;
}

function buildTree(candidates: CandidateSpec[]): SpecTreeNode[] {
  const sorted = [...candidates].sort((a, b) => a.folderPath.length - b.folderPath.length);
  const nodeMap = new Map<string, SpecTreeNode>();
  const roots: SpecTreeNode[] = [];

  for (const candidate of sorted) {
    const node: SpecTreeNode = { folderPath: candidate.folderPath, spec: candidate.spec, children: [] };
    nodeMap.set(candidate.folderPath, node);

    const parent = findParentNode(candidate.folderPath, nodeMap);
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function findParentNode(folderPath: string, nodeMap: Map<string, SpecTreeNode>): SpecTreeNode | undefined {
  let current = path.dirname(folderPath);
  while (current !== folderPath) {
    const found = nodeMap.get(current);
    if (found) {
      return found;
    }
    const next = path.dirname(current);
    if (next === current) {
      break;
    }
    current = next;
  }
  return undefined;
}

async function resolveDocumentPaths(specFolder: string): Promise<SpecDocumentPaths> {
  const documents: SpecDocumentPaths = { spec: path.join(specFolder, "SPEC.md") };
  const files: Array<[keyof Omit<SpecDocumentPaths, "spec">, string]> = [
    ["plan", "PLAN.md"],
    ["tasks", "TASKS.md"],
    ["design", "DESIGN.md"],
    ["architecture", "ARCHITECTURE.md"],
    ["tests", "TESTS.md"],
    ["review", "REVIEW.md"]
  ];

  for (const [key, fileName] of files) {
    const fullPath = path.join(specFolder, fileName);
    if (await pathExists(fullPath)) {
      documents[key] = fullPath;
    }
  }

  return documents;
}

async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await fs.stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

function findInTree(nodes: SpecTreeNode[], folderPath: string): SpecTreeNode | undefined {
  for (const node of nodes) {
    if (node.folderPath === folderPath) {
      return node;
    }
    const child = findInTree(node.children, folderPath);
    if (child) {
      return child;
    }
  }
  return undefined;
}

async function parseTaskSummary(tasksFilePath: string): Promise<Spec["taskSummary"]> {
  const content = await fs.readFile(tasksFilePath, "utf8");
  const matches = [...content.matchAll(/^Status:\s*([a-z-]+)\s*$/gim)];
  const summary = {
    total: 0,
    todo: 0,
    ready: 0,
    inProgress: 0,
    review: 0,
    done: 0,
    blocked: 0
  };

  for (const match of matches) {
    const status = match[1];
    if (status === "todo") {
      summary.todo += 1;
    } else if (status === "ready") {
      summary.ready += 1;
    } else if (status === "in-progress") {
      summary.inProgress += 1;
    } else if (status === "review") {
      summary.review += 1;
    } else if (status === "done") {
      summary.done += 1;
    } else if (status === "blocked") {
      summary.blocked += 1;
    }
  }

  summary.total = summary.todo + summary.ready + summary.inProgress + summary.review + summary.done + summary.blocked;
  return summary.total > 0 ? summary : undefined;
}
