import * as vscode from "vscode";
import { SpecTreeNode } from "../model";

export function openSpecDashboard(context: vscode.ExtensionContext, node: SpecTreeNode): void {
  const panel = vscode.window.createWebviewPanel(
    "specflow.specDashboard",
    `Spec Dashboard: ${node.spec.title}`,
    vscode.ViewColumn.One,
    { enableScripts: true, enableCommandUris: true }
  );

  panel.webview.html = renderDashboardHtml(node);
  panel.webview.onDidReceiveMessage(async (message) => {
    if (message?.type !== "generatePrompt") {
      return;
    }
    await vscode.commands.executeCommand("specflow.generatePrompt", node.folderPath);
  }, undefined, context.subscriptions);
}

function renderDashboardHtml(node: SpecTreeNode): string {
  const nonce = String(Date.now());
  const documents = [
    ["SPEC", node.spec.documents.spec],
    ["PLAN", node.spec.documents.plan],
    ["TASKS", node.spec.documents.tasks],
    ["DESIGN", node.spec.documents.design],
    ["ARCHITECTURE", node.spec.documents.architecture]
  ].filter((item) => Boolean(item[1]));

  const docList = documents
    .map(([label, fullPath]) => {
      const commandUri = buildCommandUri(fullPath as string);
      return `<li><strong>${label}</strong>: <a href="${commandUri}">${escapeHtml(fullPath as string)}</a></li>`;
    })
    .join("");

  const taskSummary = node.spec.taskSummary;
  const progress = taskSummary
    ? `
      <ul>
        <li>Total: ${taskSummary.total}</li>
        <li>Todo: ${taskSummary.todo}</li>
        <li>Ready: ${taskSummary.ready}</li>
        <li>In progress: ${taskSummary.inProgress}</li>
        <li>Review: ${taskSummary.review}</li>
        <li>Done: ${taskSummary.done}</li>
        <li>Blocked: ${taskSummary.blocked}</li>
      </ul>
    `
    : "<p>No task summary available.</p>";

  const taskBoardAction = node.spec.documents.tasks
    ? `<a class="action" href="${buildTaskBoardCommandUri(node.folderPath)}">Open Task Board</a>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Spec Dashboard</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif; padding: 16px; }
    .meta { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-bottom: 20px; }
    .card { border: 1px solid #9994; border-radius: 8px; padding: 12px; margin-bottom: 16px; }
    button, .action { border: 1px solid #666; border-radius: 6px; padding: 8px 12px; cursor: pointer; text-decoration: none; color: inherit; display: inline-block; }
    .actions { display: flex; gap: 8px; }
  </style>
</head>
<body>
  <h2>${escapeHtml(node.spec.title)}</h2>
  <div class="meta">
    <div><strong>ID:</strong> ${escapeHtml(node.spec.id)}</div>
    <div><strong>Status:</strong> ${escapeHtml(node.spec.status)}</div>
    <div><strong>Priority:</strong> ${escapeHtml(node.spec.priority)}</div>
    <div><strong>Type:</strong> ${escapeHtml(node.spec.type)}</div>
  </div>

  <div class="card">
    <h3>Documents</h3>
    <ul>${docList}</ul>
  </div>

  <div class="card">
    <h3>Task Progress</h3>
    ${progress}
  </div>

  <div class="actions">
    <button id="generatePromptButton">Generate Prompt</button>
    ${taskBoardAction}
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const button = document.getElementById('generatePromptButton');
    button?.addEventListener('click', () => {
      vscode.postMessage({ type: 'generatePrompt' });
    });
  </script>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildCommandUri(filePath: string): string {
  const args = encodeURIComponent(JSON.stringify([filePath]));
  return `command:specflow.openSpecFile?${args}`;
}

function buildTaskBoardCommandUri(folderPath: string): string {
  const args = encodeURIComponent(JSON.stringify([folderPath]));
  return `command:specflow.openTaskBoard?${args}`;
}
