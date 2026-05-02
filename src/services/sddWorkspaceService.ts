import * as vscode from "vscode";
import { TemplateFile, writeTemplateFiles } from "./templateWriterService";

const TEMPLATE_FILES: TemplateFile[] = [
  {
    relativePath: ".sdd/WORKFLOW.md",
    content: "# SDD Workflow\n\nDefine your workflow rules here.\n"
  },
  {
    relativePath: ".sdd/CONFIG.md",
    content: "# SDD Config\n\nProject-level SDD configuration.\n"
  }
];

const REQUIRED_DIRECTORIES = [".sdd", ".sdd/SPECS", ".sdd/TEMPLATES", ".sdd/AGENTS"];

export async function initializeSddWorkspace(): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    await vscode.window.showErrorMessage("Open a workspace folder before running SDD initialization.");
    return;
  }

  const createdDirectories: string[] = [];

  for (const directory of REQUIRED_DIRECTORIES) {
    const directoryUri = vscode.Uri.joinPath(workspaceFolder.uri, ...directory.split("/"));
    await vscode.workspace.fs.createDirectory(directoryUri);
    createdDirectories.push(directory);
  }

  const fileWriteResult = await writeTemplateFiles(workspaceFolder.uri, TEMPLATE_FILES);
  if (fileWriteResult.cancelled) {
    await vscode.window.showInformationMessage("SDD initialization cancelled.");
    return;
  }

  const createdCount = createdDirectories.length + fileWriteResult.created.length;

  await vscode.window.showInformationMessage(
    `SDD initialized. Created: ${createdCount}, overwritten: ${fileWriteResult.overwritten.length}, skipped: ${fileWriteResult.skipped.length}.`
  );
}
