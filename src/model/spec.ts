import { SpecStatus, TaskStatus } from "./status";

export type Priority = "low" | "medium" | "high";

export type SpecType = "feature" | "enhancement" | "bugfix" | "refactor" | "research";

export type AgentType = "codex" | "claude" | "copilot" | "local-llm" | "human";

export type TaskDependency = "none" | string;

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: Priority;
  agent: AgentType;
  dependsOn: TaskDependency;
  goal: string;
  acceptanceCriteria: string[];
}

export interface SpecDocumentPaths {
  spec: string;
  plan?: string;
  tasks?: string;
  design?: string;
  architecture?: string;
  tests?: string;
  review?: string;
}

export interface TaskSummary {
  total: number;
  todo: number;
  ready: number;
  inProgress: number;
  review: number;
  done: number;
  blocked: number;
}

export interface Spec {
  id: string;
  title: string;
  type: SpecType;
  status: SpecStatus;
  priority: Priority;
  owner?: string;
  created?: string;
  updated?: string;
  documents: SpecDocumentPaths;
  taskSummary?: TaskSummary;
}

export interface SpecTreeNode {
  folderPath: string;
  spec: Spec;
  children: SpecTreeNode[];
}
