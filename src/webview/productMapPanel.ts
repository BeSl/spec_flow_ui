import * as vscode from "vscode";
import { SpecTreeNode } from "../model";
import { buildProductMapEntries } from "../services/productMapService";

export function openProductMap(context: vscode.ExtensionContext, nodes: SpecTreeNode[]): void {
  const isRussian = vscode.env.language.toLowerCase().startsWith("ru");
  const panel = vscode.window.createWebviewPanel(
    "specflow.productMap",
    isRussian ? "Карта продукта SpecFlow" : "SpecFlow Product Map",
    vscode.ViewColumn.One,
    { enableScripts: true, enableCommandUris: true }
  );

  panel.webview.html = renderProductMapHtml(nodes, isRussian);
  panel.webview.onDidReceiveMessage(async (message) => {
    if (message?.type !== "openDashboard" || typeof message.folderPath !== "string") {
      return;
    }
    await vscode.commands.executeCommand("specflow.openDashboard", message.folderPath);
  }, undefined, context.subscriptions);
}

function renderProductMapHtml(nodes: SpecTreeNode[], isRussian: boolean): string {
  const t = {
    title: isRussian ? "Карта продукта" : "Product Map",
    all: isRussian ? "Все" : "All",
    status: isRussian ? "Статус" : "Status",
    type: isRussian ? "Тип" : "Type",
    priority: isRussian ? "Приоритет" : "Priority",
    progress: isRussian ? "Прогресс" : "Progress",
    documents: isRussian ? "Документы" : "Documents",
    dashboard: isRussian ? "Панель" : "Dashboard",
    taskBoard: isRussian ? "Доска" : "Task Board",
    source: isRussian ? "Источник" : "Source",
    noSpecs: isRussian ? "Спецификации не найдены" : "No specifications found",
    filterHint: isRussian ? "Фильтры" : "Filters"
  };

  const specs = buildProductMapEntries(nodes);
  const statusFilters = ["all", "draft", "approved", "in-progress", "review", "done", "blocked"];
  const typeFilters = ["all", "feature", "enhancement", "bugfix", "refactor", "research"];

  const cards = specs
    .map((node) => {
      const status = escapeHtml(node.status);
      const type = escapeHtml(node.type);
      const title = escapeHtml(node.title);
      const folderPath = escapeHtml(node.folderPath);

      return `
      <article class="card" data-status="${status}" data-type="${type}">
        <div class="card__header">
          <div>
            <div class="card__title">${title}</div>
            <div class="card__subtitle">${escapeHtml(node.specId)}</div>
          </div>
          <button class="icon-btn" data-open-dashboard="${folderPath}">${t.dashboard}</button>
        </div>
        <div class="meta">
          <span>${t.status}: ${status}</span>
          <span>${t.type}: ${type}</span>
          <span>${t.priority}: ${escapeHtml(node.priority)}</span>
          <span>${t.progress}: ${escapeHtml(node.taskProgress)}</span>
        </div>
        <div class="links">
          <a href="${buildOpenSpecUri(`${node.folderPath}/SPEC.md`)}">${t.source}</a>
          ${node.hasTasks ? `<a href="${buildOpenTaskBoardUri(node.folderPath)}">${t.taskBoard}</a>` : ""}
        </div>
      </article>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="${isRussian ? "ru" : "en"}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${t.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
  <style>
    body { font-family: Roboto, "Segoe UI", sans-serif; margin: 0; padding: 20px; background: var(--vscode-editor-background); color: var(--vscode-editor-foreground); }
    .toolbar { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
    .chip { border: 0; border-radius: 999px; padding: 8px 12px; cursor: pointer; background: rgba(25, 118, 210, .12); color: inherit; }
    .chip.is-active { background: #1976d2; color: white; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; }
    .card { border: 1px solid var(--vscode-panel-border); border-radius: 16px; padding: 14px; background: var(--vscode-editorWidget-background); box-shadow: 0 2px 6px rgba(0,0,0,.18); }
    .card__header { display: flex; gap: 12px; justify-content: space-between; align-items: start; margin-bottom: 10px; }
    .card__title { font-size: 16px; font-weight: 700; }
    .card__subtitle { font-size: 12px; opacity: .75; }
    .meta { display: grid; gap: 4px; font-size: 13px; opacity: .9; margin-bottom: 10px; }
    .links { display: flex; gap: 10px; flex-wrap: wrap; }
    .links a, .icon-btn { border: 0; border-radius: 999px; padding: 8px 12px; text-decoration: none; background: rgba(69, 90, 100, .18); color: inherit; cursor: pointer; }
    .empty { opacity: .7; }
  </style>
</head>
<body>
  <h2>${t.title}</h2>
  <div class="toolbar" aria-label="${t.filterHint}">
    ${renderChips("status", statusFilters, t.all)}
    ${renderChips("type", typeFilters, t.all)}
  </div>
  <div class="grid" id="grid">
    ${cards || `<p class="empty">${t.noSpecs}</p>`}
  </div>

  <script nonce="${Date.now()}">
    const vscode = acquireVsCodeApi();
    const state = { status: 'all', type: 'all' };
    const chips = Array.from(document.querySelectorAll('.chip'));
    const cards = Array.from(document.querySelectorAll('.card'));

    function sync() {
      cards.forEach(card => {
        const show = (state.status === 'all' || card.dataset.status === state.status) && (state.type === 'all' || card.dataset.type === state.type);
        card.style.display = show ? '' : 'none';
      });
      chips.forEach(chip => {
        const active = chip.dataset.group ? state[chip.dataset.group] === chip.dataset.value : false;
        chip.classList.toggle('is-active', active);
      });
    }

    chips.forEach(chip => chip.addEventListener('click', () => {
      const group = chip.dataset.group;
      const value = chip.dataset.value;
      if (group && value) {
        state[group] = value;
        sync();
      }
    }));

    document.querySelectorAll('[data-open-dashboard]').forEach(button => {
      button.addEventListener('click', () => {
        const folderPath = button.dataset.openDashboard;
        if (folderPath) {
          vscode.postMessage({ type: 'openDashboard', folderPath });
        }
      });
    });

    sync();
  </script>
</body>
</html>`;
}

function renderChips(group: string, values: string[], allLabel: string): string {
  return values
    .map((value) => `<button class="chip ${value === 'all' ? 'is-active' : ''}" data-group="${group}" data-value="${value}">${value === 'all' ? allLabel : value}</button>`)
    .join('');
}

function buildOpenSpecUri(filePath: string): string {
  return `command:specflow.openSpecFile?${encodeURIComponent(JSON.stringify([filePath]))}`;
}

function buildOpenTaskBoardUri(folderPath: string): string {
  return `command:specflow.openTaskBoard?${encodeURIComponent(JSON.stringify([folderPath]))}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
