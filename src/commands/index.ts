import * as vscode from "vscode";
import { promises as fs } from "node:fs";
import { initializeSddWorkspace } from "../services/sddWorkspaceService";
import { findSpecNodeByFolderPath, scanSpecTree } from "../services/specScannerService";
import { SpecTreeNode } from "../model";
import { SpecTreeProvider } from "../tree/specTreeProvider";
import { openSpecDashboard } from "../webview/specDashboardPanel";
import { parseTasksMarkdown } from "../parser/taskParser";
import { openTaskBoard } from "../webview/taskBoardPanel";
import { buildTaskPrompt } from "../services/promptService";
import { validateWorkspace } from "../services/validationService";
import { detectCompatibility } from "../services/compatibilityService";
import { runReleaseQaChecks } from "../services/releaseQaService";
import { runCreateSpecificationWizard } from "../wizard/createSpecificationWizard";
import { createSpecificationInWorkspace } from "../services/specCreationFlow";
import { openProductMap } from "../webview/productMapPanel";

type CommandRegistration = [string, (...args: unknown[]) => Promise<void>];

export function registerCommands(context: vscode.ExtensionContext, specTreeProvider: SpecTreeProvider): void {
  const commands: CommandRegistration[] = [
    ["specflow.hello", async () => {
      await vscode.window.showInformationMessage("SpecFlow extension is active.");
    }],
    [
      "specflow.initializeProject",
      async () => {
        await initializeSddWorkspace();
      }
    ],
    ["specflow.createSpecification", async () => {
      await runCreateSpecificationCommand(context, specTreeProvider);
    }],
    ["specflow.createChildSpecification", async (specArg?: unknown) => {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        await vscode.window.showErrorMessage("Open a workspace folder before creating a child specification.");
        return;
      }

      const parentNode = isSpecTreeNodeArgument(specArg)
        ? specArg.node
        : await pickSpecNode(workspaceFolder.uri.fsPath);

      if (!parentNode) {
        return;
      }

      await runCreateSpecificationCommand(context, specTreeProvider, parentNode.folderPath);
    }],
    ["specflow.openDashboard", async (folderPathOrNode?: unknown) => {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        await vscode.window.showErrorMessage("Open a workspace folder before opening a dashboard.");
        return;
      }

      let targetFolderPath: string | undefined;
      if (typeof folderPathOrNode === "string") {
        targetFolderPath = folderPathOrNode;
      } else if (isSpecTreeNodeArgument(folderPathOrNode)) {
        targetFolderPath = folderPathOrNode.node.folderPath;
      }

      if (!targetFolderPath) {
        const tree = await scanSpecTree(workspaceFolder.uri.fsPath);
        const flat = flattenSpecTree(tree);
        if (flat.length === 0) {
          await vscode.window.showWarningMessage("No specifications found in .sdd/SPECS.");
          return;
        }

        const picked = await vscode.window.showQuickPick(
          flat.map((node) => ({ label: node.spec.title, description: node.spec.id, detail: node.folderPath })),
          { title: "Select specification" }
        );

        targetFolderPath = picked?.detail;
      }

      if (!targetFolderPath) {
        await vscode.window.showWarningMessage("No specification selected. Pick a spec from the SpecFlow tree.");
        return;
      }

      const node = await findSpecNodeByFolderPath(workspaceFolder.uri.fsPath, targetFolderPath);
      if (!node) {
        await vscode.window.showWarningMessage("Specification not found. Refresh the tree and try again.");
        return;
      }

      openSpecDashboard(context, node);
    }],
    ["specflow.validateProject", async () => {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        await vscode.window.showErrorMessage("Open a workspace folder before validation.");
        return;
      }

      const output = vscode.window.createOutputChannel("SpecFlow Validation");
      output.clear();
      output.appendLine("SpecFlow validation started...");

      const issues = await validateWorkspace(workspaceFolder.uri.fsPath);
      if (issues.length === 0) {
        output.appendLine("No validation issues found.");
        await vscode.window.showInformationMessage("Validation passed: no issues found.");
        output.show(true);
        return;
      }

      for (const issue of issues) {
        const pathSuffix = issue.filePath ? ` (${issue.filePath})` : "";
        output.appendLine(`[${issue.severity.toUpperCase()}] ${issue.code}: ${issue.message}${pathSuffix}`);
      }

      output.appendLine(`Total issues: ${issues.length}`);
      output.show(true);
      await vscode.window.showWarningMessage(`Validation completed with ${issues.length} issue(s). See 'SpecFlow Validation' output.`);
    }],
    ["specflow.refreshSpecs", async () => {
      specTreeProvider.refresh();
    }],
    ["specflow.openSpecFile", async (specPathOrNode?: unknown) => {
      let specPath: string | undefined;
      if (typeof specPathOrNode === "string") {
        specPath = specPathOrNode;
      } else if (isSpecTreeNodeArgument(specPathOrNode)) {
        specPath = specPathOrNode.node.spec.documents.spec;
      }

      if (!specPath) {
        return;
      }

      const document = await vscode.workspace.openTextDocument(vscode.Uri.file(specPath));
      await vscode.window.showTextDocument(document);
    }],
    ["specflow.generatePrompt", async (folderPath?: unknown) => {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        await vscode.window.showErrorMessage("Open a workspace folder before generating prompts.");
        return;
      }

      const targetFolderPath = typeof folderPath === "string" ? folderPath : undefined;
      const specNode = targetFolderPath
        ? await findSpecNodeByFolderPath(workspaceFolder.uri.fsPath, targetFolderPath)
        : await pickSpecNode(workspaceFolder.uri.fsPath);

      if (!specNode) {
        return;
      }

      const tasksPath = specNode.spec.documents.tasks;
      const specPath = specNode.spec.documents.spec;
      if (!tasksPath) {
        await vscode.window.showWarningMessage("TASKS.md not found for selected specification.");
        return;
      }

      const tasksContent = await fs.readFile(tasksPath, "utf8");
      const tasks = parseTasksMarkdown(tasksContent);
      if (tasks.length === 0) {
        await vscode.window.showWarningMessage("No tasks found in TASKS.md.");
        return;
      }

      const pickedTask = await vscode.window.showQuickPick(
        tasks.map((task) => ({
          label: task.title,
          description: task.id,
          detail: `${task.status} • ${task.priority}`,
          task
        })),
        { title: "Select task for prompt" }
      );

      if (!pickedTask) {
        return;
      }

      const workflowPath = vscode.Uri.joinPath(workspaceFolder.uri, ".sdd", "WORKFLOW.md").fsPath;
      const [workflowContent, specContent] = await Promise.all([
        fs.readFile(workflowPath, "utf8"),
        fs.readFile(specPath, "utf8")
      ]);

      const prompt = buildTaskPrompt({
        workflowContent,
        specContent,
        task: pickedTask.task
      });

      await vscode.env.clipboard.writeText(prompt);
      await vscode.window.showInformationMessage(`Prompt for ${pickedTask.task.id} copied to clipboard.`);
    }],
    ["specflow.openTaskBoard", async (folderPath?: unknown) => {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        await vscode.window.showErrorMessage("Open a workspace folder before opening task board.");
        return;
      }

      const targetFolderPath = typeof folderPath === "string" ? folderPath : undefined;
      const specNode = targetFolderPath
        ? await findSpecNodeByFolderPath(workspaceFolder.uri.fsPath, targetFolderPath)
        : await pickSpecNode(workspaceFolder.uri.fsPath);

      if (!specNode) {
        return;
      }

      const tasksPath = specNode.spec.documents.tasks;
      if (!tasksPath) {
        await vscode.window.showWarningMessage("TASKS.md not found for selected specification.");
        return;
      }

      const content = await fs.readFile(tasksPath, "utf8");
      const tasks = parseTasksMarkdown(content);
      openTaskBoard(tasksPath, tasks);
    }],
    ["specflow.openTaskSource", async (tasksPath?: unknown, taskId?: unknown) => {
      if (typeof tasksPath !== "string") {
        return;
      }

      const document = await vscode.workspace.openTextDocument(vscode.Uri.file(tasksPath));
      const editor = await vscode.window.showTextDocument(document);

      if (typeof taskId === "string") {
        const line = document.getText().split("\n").findIndex((value) => value.startsWith(`## ${taskId} `));
        if (line >= 0) {
          const position = new vscode.Position(line, 0);
          editor.selection = new vscode.Selection(position, position);
          editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.InCenter);
        }
      }
    }],
    ["specflow.detectCompatibility", async () => {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        await vscode.window.showErrorMessage("Open a workspace folder before compatibility detection.");
        return;
      }

      const output = vscode.window.createOutputChannel("SpecFlow Compatibility");
      output.clear();
      output.appendLine("Compatibility detection started...");

      const findings = await detectCompatibility(workspaceFolder.uri.fsPath);
      if (findings.length === 0) {
        output.appendLine("No compatible structures detected.");
        output.show(true);
        await vscode.window.showInformationMessage("No compatibility hints found.");
        return;
      }

      for (const finding of findings) {
        output.appendLine(`[${finding.confidence.toUpperCase()}] ${finding.label}: ${finding.matchedPath}`);
      }
      output.appendLine(`Total findings: ${findings.length}`);
      output.show(true);
      await vscode.window.showInformationMessage(`Compatibility detection found ${findings.length} hint(s).`);
    }],
    ["specflow.runReleaseQa", async () => {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        await vscode.window.showErrorMessage("Open a workspace folder before running release QA.");
        return;
      }

      const output = vscode.window.createOutputChannel("SpecFlow Release QA");
      output.clear();
      output.appendLine("Release QA checks started...");

      const results = await runReleaseQaChecks(workspaceFolder.uri.fsPath);
      let passedCount = 0;

      for (const result of results) {
        const mark = result.passed ? "PASS" : "FAIL";
        output.appendLine(`[${mark}] ${result.name}: ${result.details}`);
        if (result.passed) {
          passedCount += 1;
        }
      }

      output.appendLine(`Summary: ${passedCount}/${results.length} checks passed.`);
      output.show(true);

      if (passedCount === results.length) {
        await vscode.window.showInformationMessage("Release QA checks passed.");
      } else {
        await vscode.window.showWarningMessage("Release QA checks found issues. See 'SpecFlow Release QA' output.");
      }
    }],
    ["specflow.openProductMap", async () => {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        await vscode.window.showErrorMessage("Open a workspace folder before opening the product map.");
        return;
      }

      const tree = await scanSpecTree(workspaceFolder.uri.fsPath);
      const flat = flattenSpecTree(tree);
      openProductMap(context, flat);
    }]
  ];

  for (const [commandId, handler] of commands) {
    context.subscriptions.push(vscode.commands.registerCommand(commandId, handler));
  }
}

function isSpecTreeNodeArgument(value: unknown): value is { node: SpecTreeNode } {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as { node?: SpecTreeNode };
  return Boolean(candidate.node?.spec?.documents?.spec);
}

function flattenSpecTree(nodes: SpecTreeNode[]): SpecTreeNode[] {
  const result: SpecTreeNode[] = [];
  for (const node of nodes) {
    result.push(node);
    result.push(...flattenSpecTree(node.children));
  }
  return result;
}

async function pickSpecNode(workspaceRoot: string): Promise<SpecTreeNode | undefined> {
  const tree = await scanSpecTree(workspaceRoot);
  const flat = flattenSpecTree(tree);
  if (flat.length === 0) {
    await vscode.window.showWarningMessage("No specifications found in .sdd/SPECS.");
    return undefined;
  }

  const picked = await vscode.window.showQuickPick(
    flat.map((node) => ({ label: node.spec.title, description: node.spec.id, detail: node.folderPath })),
    { title: "Select specification" }
  );

  if (!picked?.detail) {
    return undefined;
  }

  return findSpecNodeByFolderPath(workspaceRoot, picked.detail);
}

async function runCreateSpecificationCommand(
  context: vscode.ExtensionContext,
  specTreeProvider: SpecTreeProvider,
  parentFolderPath?: string
): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    await vscode.window.showErrorMessage("Open a workspace folder before creating a specification.");
    return;
  }

  const input = await runCreateSpecificationWizard();
  if (!input) {
    return;
  }

  try {
    const result = await createSpecificationInWorkspace(workspaceFolder.uri.fsPath, input, parentFolderPath);
    specTreeProvider.refresh();

    const node = await findSpecNodeByFolderPath(workspaceFolder.uri.fsPath, result.folderPath);
    if (node) {
      openSpecDashboard(context, node);
    }

    await vscode.window.showInformationMessage(`Specification created: ${result.specId}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create specification.";
    await vscode.window.showErrorMessage(message);
  }
}
