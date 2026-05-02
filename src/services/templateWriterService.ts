import * as vscode from "vscode";

export type TemplateFile = {
  relativePath: string;
  content: string;
};

export type TemplateWriteResult = {
  created: string[];
  overwritten: string[];
  skipped: string[];
  cancelled: boolean;
};

export async function writeTemplateFiles(
  workspaceRoot: vscode.Uri,
  files: TemplateFile[]
): Promise<TemplateWriteResult> {
  const result: TemplateWriteResult = {
    created: [],
    overwritten: [],
    skipped: [],
    cancelled: false
  };

  for (const file of files) {
    const fileUri = vscode.Uri.joinPath(workspaceRoot, ...file.relativePath.split("/"));
    const exists = await pathExists(fileUri);

    if (!exists) {
      await writeFile(fileUri, file.content);
      result.created.push(file.relativePath);
      continue;
    }

    const choice = await vscode.window.showWarningMessage(
      `${file.relativePath} already exists. Overwrite it?`,
      { modal: true },
      "Overwrite",
      "Skip",
      "Cancel"
    );

    if (choice === "Cancel") {
      result.cancelled = true;
      return result;
    }

    if (choice === "Overwrite") {
      await writeFile(fileUri, file.content);
      result.overwritten.push(file.relativePath);
      continue;
    }

    result.skipped.push(file.relativePath);
  }

  return result;
}

async function pathExists(uri: vscode.Uri): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(uri);
    return true;
  } catch {
    return false;
  }
}

async function writeFile(uri: vscode.Uri, content: string): Promise<void> {
  const bytes = new TextEncoder().encode(content);
  await vscode.workspace.fs.writeFile(uri, bytes);
}
