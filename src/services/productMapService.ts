import { SpecTreeNode } from "../model";

export type ProductMapEntry = {
  specId: string;
  title: string;
  status: string;
  type: string;
  priority: string;
  folderPath: string;
  taskProgress: string;
  hasTasks: boolean;
};

export function buildProductMapEntries(nodes: SpecTreeNode[]): ProductMapEntry[] {
  return flattenSpecTree(nodes)
    .sort((a, b) => a.spec.title.localeCompare(b.spec.title))
    .map((node) => ({
      specId: node.spec.id,
      title: node.spec.title,
      status: node.spec.status,
      type: node.spec.type,
      priority: node.spec.priority,
      folderPath: node.folderPath,
      taskProgress: node.spec.taskSummary ? `${node.spec.taskSummary.done}/${node.spec.taskSummary.total}` : "0/0",
      hasTasks: Boolean(node.spec.documents.tasks)
    }));
}

export function flattenSpecTree(nodes: SpecTreeNode[]): SpecTreeNode[] {
  return nodes.flatMap((node) => [node, ...flattenSpecTree(node.children)]);
}
