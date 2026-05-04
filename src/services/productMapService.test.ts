import { describe, expect, it } from "vitest";
import { buildProductMapEntries, flattenSpecTree } from "./productMapService";

describe("productMapService", () => {
  it("flattens nested specs", () => {
    const nodes = [
      {
        folderPath: "/root/parent",
        spec: {
          id: "parent",
          title: "Parent",
          type: "feature",
          status: "approved",
          priority: "high",
          documents: { spec: "/root/parent/SPEC.md" }
        },
        children: [
          {
            folderPath: "/root/parent/child",
            spec: {
              id: "child",
              title: "Child",
              type: "feature",
              status: "draft",
              priority: "medium",
              documents: { spec: "/root/parent/child/SPEC.md" }
            },
            children: []
          }
        ]
      }
    ] as any;

    expect(flattenSpecTree(nodes)).toHaveLength(2);
  });

  it("builds product map entries", () => {
    const entries = buildProductMapEntries([
      {
        folderPath: "/root/spec",
        spec: {
          id: "spec",
          title: "Spec",
          type: "feature",
          status: "approved",
          priority: "high",
          documents: { spec: "/root/spec/SPEC.md", tasks: "/root/spec/TASKS.md" },
          taskSummary: { total: 3, todo: 0, ready: 1, inProgress: 1, review: 0, done: 1, blocked: 0 }
        },
        children: []
      }
    ] as any);

    expect(entries[0].taskProgress).toBe("1/3");
    expect(entries[0].hasTasks).toBe(true);
  });
});
