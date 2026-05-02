import * as vscode from "vscode";
import { SpecTreeNode } from "../model";

export function openSpecDashboard(context: vscode.ExtensionContext, node: SpecTreeNode): void {
  const isRussian = vscode.env.language.toLowerCase().startsWith("ru");
  const panel = vscode.window.createWebviewPanel(
    "specflow.specDashboard",
    `${isRussian ? "Панель спецификации" : "Spec Dashboard"}: ${node.spec.title}`,
    vscode.ViewColumn.One,
    { enableScripts: true, enableCommandUris: true }
  );

  panel.webview.html = renderDashboardHtml(node, isRussian);
  panel.webview.onDidReceiveMessage(async (message) => {
    if (message?.type !== "generatePrompt") {
      return;
    }
    await vscode.commands.executeCommand("specflow.generatePrompt", node.folderPath);
  }, undefined, context.subscriptions);
}

function renderDashboardHtml(node: SpecTreeNode, isRussian: boolean): string {
  const nonce = String(Date.now());
  const t = {
    title: isRussian ? "Панель спецификации" : "Spec Dashboard",
    id: isRussian ? "Идентификатор" : "ID",
    status: isRussian ? "Статус" : "Status",
    priority: isRussian ? "Приоритет" : "Priority",
    type: isRussian ? "Тип" : "Type",
    documents: isRussian ? "Документы" : "Documents",
    taskProgress: isRussian ? "Прогресс задач" : "Task Progress",
    total: isRussian ? "Всего" : "Total",
    todo: isRussian ? "К выполнению" : "Todo",
    ready: isRussian ? "Готово к работе" : "Ready",
    inProgress: isRussian ? "В работе" : "In progress",
    review: isRussian ? "Проверка" : "Review",
    done: isRussian ? "Выполнено" : "Done",
    blocked: isRussian ? "Заблокировано" : "Blocked",
    noSummary: isRussian ? "Сводка задач недоступна." : "No task summary available.",
    generatePrompt: isRussian ? "Сгенерировать промпт" : "Generate Prompt",
    openTaskBoard: isRussian ? "Открыть доску задач" : "Open Task Board",
    source: isRussian ? "Файл" : "Source"
  };

  const documents = [
    ["SPEC", node.spec.documents.spec],
    ["PLAN", node.spec.documents.plan],
    ["TASKS", node.spec.documents.tasks],
    ["DESIGN", node.spec.documents.design],
    ["ARCHITECTURE", node.spec.documents.architecture]
  ].filter((item) => Boolean(item[1]));

  const docList = documents
    .map(([label, fullPath]) => {
      const labelValue = label as string;
      const pathValue = fullPath as string;
      const commandUri = buildCommandUri(pathValue);
      const shortPath = escapeHtml(pathValue.replace(`${node.folderPath}/`, ""));
      return `<li class="doc-item"><div class="doc-entity">${escapeHtml(labelValue)}</div><a class="doc-path" href="${commandUri}">${t.source}: ${shortPath}</a></li>`;
    })
    .join("");

  const taskSummary = node.spec.taskSummary;
  const progress = taskSummary
    ? `
      <ul>
        <li>${t.total}: ${taskSummary.total}</li>
        <li>${t.todo}: ${taskSummary.todo}</li>
        <li>${t.ready}: ${taskSummary.ready}</li>
        <li>${t.inProgress}: ${taskSummary.inProgress}</li>
        <li>${t.review}: ${taskSummary.review}</li>
        <li>${t.done}: ${taskSummary.done}</li>
        <li>${t.blocked}: ${taskSummary.blocked}</li>
      </ul>
    `
    : `<p>${t.noSummary}</p>`;

  const taskBoardAction = node.spec.documents.tasks
    ? `<a class="action" href="${buildTaskBoardCommandUri(node.folderPath)}">${t.openTaskBoard}</a>`
    : "";

  return `<!DOCTYPE html>
<html lang="${isRussian ? "ru" : "en"}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${t.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
  <style>
    body { font-family: Roboto, "Segoe UI", sans-serif; padding: 20px; background: var(--vscode-editor-background); color: var(--vscode-editor-foreground); }
    .meta { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-bottom: 20px; }
    .card { border: 1px solid var(--vscode-panel-border); border-radius: 14px; padding: 14px; margin-bottom: 16px; box-shadow: 0 2px 6px rgba(0,0,0,.18); background: var(--vscode-editorWidget-background); }
    .doc-item { margin-bottom: 8px; }
    .doc-entity { font-weight: 700; }
    .doc-path { font-size: 12px; opacity: .85; text-decoration: none; }
    button, .action { border: 0; border-radius: 20px; padding: 9px 14px; cursor: pointer; text-decoration: none; color: white; background: #1976d2; display: inline-block; font-weight: 500; }
    .action { background: #455a64; }
    .actions { display: flex; gap: 8px; }
  </style>
</head>
<body>
  <h2>${escapeHtml(node.spec.title)}</h2>
  <div class="meta">
    <div><strong>${t.id}:</strong> ${escapeHtml(node.spec.id)}</div>
    <div><strong>${t.status}:</strong> ${escapeHtml(node.spec.status)}</div>
    <div><strong>${t.priority}:</strong> ${escapeHtml(node.spec.priority)}</div>
    <div><strong>${t.type}:</strong> ${escapeHtml(node.spec.type)}</div>
  </div>

  <div class="card">
    <h3>${t.documents}</h3>
    <ul>${docList}</ul>
  </div>

  <div class="card">
    <h3>${t.taskProgress}</h3>
    ${progress}
  </div>

  <div class="actions">
    <button id="generatePromptButton">${t.generatePrompt}</button>
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
