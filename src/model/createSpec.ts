import { Priority, SpecType } from "./spec";

export interface CreateSpecInput {
  title: string;
  type: SpecType;
  priority: Priority;
  owner: string;
  problem: string;
  goal: string;
  acceptanceCriteria: string[];
  createStarterTask: boolean;
}

export interface CreateSpecPlan {
  specNumber: number;
  specId: string;
  folderName: string;
  slug: string;
}
