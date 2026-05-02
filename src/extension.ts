import * as vscode from "vscode";
import { registerCommands } from "./commands";
import { SpecTreeProvider } from "./tree/specTreeProvider";

export function activate(context: vscode.ExtensionContext): void {
  const specTreeProvider = new SpecTreeProvider();
  context.subscriptions.push(vscode.window.createTreeView("specflow.specTree", { treeDataProvider: specTreeProvider }));
  registerCommands(context, specTreeProvider);
}

export function deactivate(): void {
  // No cleanup needed for the initial skeleton.
}
