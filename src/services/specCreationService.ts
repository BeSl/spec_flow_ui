import { promises as fs } from "node:fs";
import path from "node:path";
import { CreateSpecInput, CreateSpecPlan } from "../model/createSpec";

const SPEC_FOLDER_PATTERN = /^(\d{4})-/;

export function slugifySpecTitle(title: string): string {
  const transliterated = transliterateCyrillic(title);
  const slug = transliterated
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");

  return slug || "untitled-spec";
}

function transliterateCyrillic(value: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y",
    к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f",
    х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya"
  };

  return value
    .split("")
    .map((char) => {
      const lower = char.toLowerCase();
      const replacement = map[lower];
      if (!replacement) {
        return char;
      }
      return char === lower ? replacement : replacement;
    })
    .join("");
}

export function formatSpecId(specNumber: number, title: string): string {
  const prefix = String(specNumber).padStart(4, "0");
  return `${prefix}-${slugifySpecTitle(title)}`;
}

export async function getNextSpecNumber(specsRoot: string): Promise<number> {
  const entries = await fs.readdir(specsRoot, { withFileTypes: true }).catch(() => [] as Awaited<ReturnType<typeof fs.readdir>>);
  let maxNumber = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const name = String(entry.name);
    const match = name.match(SPEC_FOLDER_PATTERN);
    if (!match) {
      continue;
    }

    const number = Number(match[1]);
    if (Number.isFinite(number) && number > maxNumber) {
      maxNumber = number;
    }
  }

  return maxNumber + 1;
}

export async function createSpecPlan(specsRoot: string, input: CreateSpecInput): Promise<CreateSpecPlan> {
  const specNumber = await getNextSpecNumber(specsRoot);
  const specId = formatSpecId(specNumber, input.title);
  return {
    specNumber,
    specId,
    folderName: specId,
    slug: slugifySpecTitle(input.title)
  };
}

export function buildSpecFolderPath(specsRoot: string, specId: string): string {
  return path.join(specsRoot, specId);
}

export function buildSpecMetadata(plan: CreateSpecPlan, input: CreateSpecInput) {
  const now = new Date().toISOString().split("T")[0];
  return {
    id: plan.specId,
    title: input.title,
    type: input.type,
    status: "draft",
    priority: input.priority,
    owner: input.owner,
    created: now,
    updated: now
  };
}
