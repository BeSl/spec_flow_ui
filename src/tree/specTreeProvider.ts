import * as vscode from "vscode";
import { SpecTreeNode } from "../model";
import { scanSpecTree } from "../services/specScannerService";

export class SpecTreeProvider implements vscode.TreeDataProvider<SpecTreeItem> {
  private readonly onDidChangeTreeDataEmitter = new vscode.EventEmitter<SpecTreeItem | undefined>();

  readonly onDidChangeTreeData = this.onDidChangeTreeDataEmitter.event;

  refresh(): void {
    this.onDidChangeTreeDataEmitter.fire(undefined);
  }

  async getChildren(element?: SpecTreeItem): Promise<SpecTreeItem[]> {
    if (element) {
      return element.node.children.map((child) => new SpecTreeItem(child));
    }

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      return [];
    }

    const tree = await scanSpecTree(workspaceFolder.uri.fsPath);
    return tree.map((node) => new SpecTreeItem(node));
  }

  getTreeItem(element: SpecTreeItem): vscode.TreeItem {
    return element;
  }
}

export class SpecTreeItem extends vscode.TreeItem {
  constructor(readonly node: SpecTreeNode) {
    super(node.spec.title, node.children.length > 0 ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);

    this.id = node.spec.id;
    this.description = node.spec.status;
    this.tooltip = `${node.spec.id} (${node.spec.status})`;
    this.contextValue = "specNode";
    this.iconPath = new vscode.ThemeIcon(node.children.length > 0 ? "folder-library" : "file-code");
    this.command = {
      command: "specflow.openDashboard",
      title: "Open Dashboard",
      arguments: [node.folderPath]
    };
  }
}
