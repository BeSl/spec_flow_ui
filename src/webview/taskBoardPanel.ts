import * as vscode from "vscode";
import { Task } from "../model";

const STATUS_ORDER: Task["status"][] = ["todo", "ready", "in-progress", "review", "done", "blocked"];

export function openTaskBoard(tasksFilePath: string, tasks: Task[]): void {
  const isRussian = vscode.env.language.toLowerCase().startsWith("ru");
  const panel = vscode.window.createWebviewPanel(
    "specflow.taskBoard",
    isRussian ? "Доска задач SpecFlow" : "SpecFlow Task Board",
    vscode.ViewColumn.One,
    { enableScripts: true, enableCommandUris: true }
  );

  panel.webview.html = renderTaskBoardHtml(tasksFilePath, tasks, isRussian);
}

function renderTaskBoardHtml(tasksFilePath: string, tasks: Task[], isRussian: boolean): string {
  const t = {
    title: isRussian ? "Доска задач" : "Task Board",
    noTasks: isRussian ? "Нет задач" : "No tasks"
  };

  const statusTitles: Record<Task["status"], string> = {
    "todo": isRussian ? "К выполнению" : "Todo",
    "ready": isRussian ? "Готово" : "Ready",
    "in-progress": isRussian ? "В работе" : "In progress",
    "review": isRussian ? "Проверка" : "Review",
    "done": isRussian ? "Готово" : "Done",
    "blocked": isRussian ? "Заблокировано" : "Blocked"
  };

  const grouped = new Map<Task["status"], Task[]>();
  for (const status of STATUS_ORDER) {
    grouped.set(status, []);
  }
  for (const task of tasks) {
    grouped.get(task.status)?.push(task);
  }

  const columns = STATUS_ORDER.map((status) => {
    const cards = (grouped.get(status) ?? [])
      .map((task) => {
        const uri = buildOpenTaskUri(tasksFilePath, task.id);
        return `<a class="card" href="${uri}"><div class="title">${escapeHtml(task.id)} — ${escapeHtml(task.title)}</div><div class="meta">${escapeHtml(task.priority)} • ${escapeHtml(task.agent)}</div></a>`;
      })
      .join("");

    return `<section class="column"><h3>${escapeHtml(statusTitles[status])}</h3>${cards || `<p class="empty">${t.noTasks}</p>`}</section>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="${isRussian ? "ru" : "en"}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${t.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
  <style>
    body { font-family: Roboto, "Segoe UI", sans-serif; margin: 0; padding: 16px; background: var(--vscode-editor-background); color: var(--vscode-editor-foreground); }
    .grid { display: grid; grid-template-columns: repeat(3, minmax(220px, 1fr)); gap: 12px; }
    .column { border: 1px solid var(--vscode-panel-border); border-radius: 14px; padding: 10px; min-height: 120px; box-shadow: 0 2px 6px rgba(0,0,0,.16); background: var(--vscode-editorWidget-background); }
    .column h3 { margin: 4px 0 8px; font-size: 13px; text-transform: uppercase; letter-spacing: .4px; color: #78909c; }
    .card { display: block; border: 0; border-radius: 12px; padding: 10px; margin-bottom: 8px; text-decoration: none; color: inherit; background: rgba(25, 118, 210, .12); }
    .title { font-weight: 600; margin-bottom: 4px; }
    .meta { opacity: 0.8; font-size: 12px; }
    .empty { opacity: 0.7; font-size: 12px; }
  </style>
</head>
<body>
  <h2>${t.title}</h2>
  <div class="grid">${columns}</div>
</body>
</html>`;
}

function buildOpenTaskUri(tasksFilePath: string, taskId: string): string {
  const args = encodeURIComponent(JSON.stringify([tasksFilePath, taskId]));
  return `command:specflow.openTaskSource?${args}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
