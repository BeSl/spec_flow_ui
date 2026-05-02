import { describe, expect, it } from "vitest";
import { parseSpecMetadata } from "./specMetadataParser";

describe("parseSpecMetadata", () => {
  it("parses SPEC.md frontmatter", () => {
    const content = [
      "---",
      "id: 0001-specflow-vscode-extension",
      "title: SpecFlow Core",
      "type: feature",
      "status: approved",
      "priority: high",
      "owner: slava",
      "created: 2026-04-30",
      "updated: 2026-05-01",
      "---",
      "# Body"
    ].join("\n");

    const spec = parseSpecMetadata({ specContent: content });

    expect(spec.id).toBe("0001-specflow-vscode-extension");
    expect(spec.title).toBe("SpecFlow Core");
    expect(spec.type).toBe("feature");
    expect(spec.status).toBe("approved");
    expect(spec.priority).toBe("high");
    expect(spec.owner).toBe("slava");
  });

  it("uses metadata.json when frontmatter is missing", () => {
    const spec = parseSpecMetadata({
      specContent: "# Spec without frontmatter",
      metadataJsonContent: JSON.stringify({
        id: "json-id",
        title: "JSON title",
        type: "research",
        status: "review",
        priority: "low"
      })
    });

    expect(spec.id).toBe("json-id");
    expect(spec.title).toBe("JSON title");
    expect(spec.type).toBe("research");
    expect(spec.status).toBe("review");
    expect(spec.priority).toBe("low");
  });

  it("frontmatter has priority over metadata.json", () => {
    const content = ["---", "title: Frontmatter title", "status: done", "---", "# Body"].join("\n");
    const spec = parseSpecMetadata({
      specContent: content,
      metadataJsonContent: JSON.stringify({ title: "JSON title", status: "draft" })
    });

    expect(spec.title).toBe("Frontmatter title");
    expect(spec.status).toBe("done");
  });

  it("handles missing or invalid metadata gracefully", () => {
    const spec = parseSpecMetadata({
      specContent: "# Empty",
      metadataJsonContent: "{invalid-json"
    });

    expect(spec.id).toBe("unknown-spec");
    expect(spec.title).toBe("Untitled specification");
    expect(spec.type).toBe("feature");
    expect(spec.status).toBe("draft");
    expect(spec.priority).toBe("medium");
  });
});
