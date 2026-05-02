import * as vscode from "vscode";
import { Task } from "../model";

const STATUS_ORDER: Task["status"][] = ["todo", "ready", "in-progress", "review", "done", "blocked"];

export function openTaskBoard(tasksFilePath: string, tasks: Task[]): void {
  const panel = vscode.window.createWebviewPanel(
    "specflow.taskBoard",
    "SpecFlow Task Board",
    vscode.ViewColumn.One,
    { enableScripts: true, enableCommandUris: true }
  );

  panel.webview.html = renderTaskBoardHtml(tasksFilePath, tasks);
}

function renderTaskBoardHtml(tasksFilePath: string, tasks: Task[]): string {
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

    return `<section class="column"><h3>${escapeHtml(status)}</h3>${cards || "<p class=\"empty\">No tasks</p>"}</section>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Task Board</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif; margin: 0; padding: 16px; }
    .grid { display: grid; grid-template-columns: repeat(3, minmax(220px, 1fr)); gap: 12px; }
    .column { border: 1px solid #9994; border-radius: 8px; padding: 8px; min-height: 120px; }
    .column h3 { margin: 4px 0 8px; font-size: 14px; text-transform: uppercase; }
    .card { display: block; border: 1px solid #9994; border-radius: 6px; padding: 8px; margin-bottom: 8px; text-decoration: none; color: inherit; }
    .title { font-weight: 600; margin-bottom: 4px; }
    .meta { opacity: 0.8; font-size: 12px; }
    .empty { opacity: 0.7; font-size: 12px; }
  </style>
</head>
<body>
  <h2>Task Board</h2>
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
