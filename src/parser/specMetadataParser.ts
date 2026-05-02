import { Priority, Spec, SpecType } from "../model";

export type SpecMetadataInput = {
  specContent: string;
  metadataJsonContent?: string;
  documents?: Spec["documents"];
};

type RawMetadata = Record<string, string>;

export function parseSpecMetadata(input: SpecMetadataInput): Spec {
  const frontmatter = parseFrontmatter(input.specContent);
  const metadataJson = parseMetadataJson(input.metadataJsonContent);
  const merged = { ...metadataJson, ...frontmatter };

  return {
    id: merged.id ?? "unknown-spec",
    title: merged.title ?? "Untitled specification",
    type: parseSpecType(merged.type),
    status: parseSpecStatus(merged.status),
    priority: parsePriority(merged.priority),
    owner: merged.owner,
    created: merged.created,
    updated: merged.updated,
    documents: input.documents ?? { spec: "SPEC.md" }
  };
}

function parseFrontmatter(content: string): RawMetadata {
  const lines = content.split("\n");
  if (lines.length < 3 || lines[0].trim() !== "---") {
    return {};
  }

  const result: RawMetadata = {};
  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (line === "---") {
      break;
    }
    const separatorIndex = line.indexOf(":");
    if (separatorIndex <= 0) {
      continue;
    }
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (!key || !value) {
      continue;
    }
    result[key] = stripQuotes(value);
  }

  return result;
}

function parseMetadataJson(content?: string): RawMetadata {
  if (!content) {
    return {};
  }

  try {
    const parsed = JSON.parse(content) as Record<string, unknown>;
    const result: RawMetadata = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "string") {
        result[key] = value;
      }
    }
    return result;
  } catch {
    return {};
  }
}

function stripQuotes(value: string): string {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function parseSpecType(value?: string): SpecType {
  if (value === "feature" || value === "enhancement" || value === "bugfix" || value === "refactor" || value === "research") {
    return value;
  }
  return "feature";
}

function parseSpecStatus(value?: string): Spec["status"] {
  if (value === "draft" || value === "approved" || value === "in-progress" || value === "review" || value === "done" || value === "blocked") {
    return value;
  }
  return "draft";
}

function parsePriority(value?: string): Priority {
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }
  return "medium";
}
