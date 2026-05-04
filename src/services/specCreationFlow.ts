import { promises as fs } from "node:fs";
import path from "node:path";
import { CreateSpecInput } from "../model/createSpec";
import { buildSpecDocumentBundle } from "./specDocumentFactory";
import { buildSpecFolderPath, createSpecPlan } from "./specCreationService";

export type CreateSpecResult = {
  specId: string;
  folderPath: string;
};

export async function createSpecificationInWorkspace(
  workspaceRoot: string,
  input: CreateSpecInput,
  parentFolderPath?: string
): Promise<CreateSpecResult> {
  const specsRoot = path.join(workspaceRoot, ".sdd", "SPECS");
  await ensureDirectory(specsRoot);

  const plan = await createSpecPlan(specsRoot, input);
  const baseFolder = parentFolderPath ?? specsRoot;
  const folderPath = buildSpecFolderPath(baseFolder, plan.specId);

  if (await exists(folderPath)) {
    throw new Error(`Specification folder already exists: ${folderPath}`);
  }

  await fs.mkdir(folderPath, { recursive: true });

  const bundle = buildSpecDocumentBundle(input, plan);
  await Promise.all(
    Object.entries(bundle).map(async ([fileName, content]) => {
      const filePath = path.join(folderPath, fileName);
      await fs.writeFile(filePath, content, "utf8");
    })
  );

  return {
    specId: plan.specId,
    folderPath
  };
}

async function ensureDirectory(targetPath: string): Promise<void> {
  await fs.mkdir(targetPath, { recursive: true });
}

async function exists(targetPath: string): Promise<boolean> {
  try {
    await fs.stat(targetPath);
    return true;
  } catch {
    return false;
  }
}
