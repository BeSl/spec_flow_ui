import { describe, expect, it } from "vitest";
import { buildSpecDocumentBundle } from "./specDocumentFactory";

describe("buildSpecDocumentBundle", () => {
  it("creates a full set of documents", () => {
    const bundle = buildSpecDocumentBundle(
      {
        title: "Search Filters",
        type: "feature",
        priority: "high",
        owner: "slava",
        problem: "Users cannot filter results.",
        goal: "Add filters.",
        acceptanceCriteria: ["Filters exist", "Results update"],
        createStarterTask: true
      },
      {
        specNumber: 3,
        specId: "0003-search-filters",
        folderName: "0003-search-filters",
        slug: "search-filters"
      }
    );

    expect(Object.keys(bundle).sort()).toEqual([
      "DESIGN.md",
      "PLAN.md",
      "REVIEW.md",
      "SPEC.md",
      "STATUS.md",
      "TASKS.md",
      "TESTS.md",
      "metadata.json"
    ]);
    expect(bundle["SPEC.md"]).toContain("Search Filters");
    expect(bundle["SPEC.md"]).toContain("Users cannot filter results.");
    expect(bundle["TASKS.md"]).toContain("TASK-0001 Implement Search Filters");
    expect(bundle["metadata.json"]).toContain('"id": "0003-search-filters"');
  });
});
