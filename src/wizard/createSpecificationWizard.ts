import * as os from "node:os";
import * as vscode from "vscode";
import { CreateSpecInput } from "../model/createSpec";

const SPEC_TYPES: Array<CreateSpecInput["type"]> = ["feature", "enhancement", "bugfix", "refactor", "research"];
const PRIORITIES: Array<CreateSpecInput["priority"]> = ["low", "medium", "high"];

export async function runCreateSpecificationWizard(): Promise<CreateSpecInput | undefined> {
  const isRussian = vscode.env.language.toLowerCase().startsWith("ru");
  const t = {
    createSpec: isRussian ? "Создание спецификации" : "Create Specification",
    enterTitle: isRussian ? "Введите название спецификации" : "Enter specification title",
    selectType: isRussian ? "Выберите тип спецификации" : "Select specification type",
    selectPriority: isRussian ? "Выберите приоритет" : "Select priority",
    enterOwner: isRussian ? "Введите владельца" : "Enter owner",
    describeProblem: isRussian ? "Опишите проблему" : "Describe the problem",
    describeGoal: isRussian ? "Опишите цель" : "Describe the goal",
    enterAcceptance: isRussian ? "Введите критерии приемки через точку с запятой" : "Enter acceptance criteria, separated by semicolons",
    createStarterTask: isRussian ? "Создать стартовую задачу?" : "Create starter task?",
    yes: isRussian ? "Да" : "Yes",
    no: isRussian ? "Нет" : "No",
    starterTaskYes: isRussian ? "Создать стартовую задачу в TASKS.md" : "Create a starter task in TASKS.md",
    starterTaskNo: isRussian ? "Оставить шаблон задачи" : "Leave TASKS.md with a template task",
    titleRequired: isRussian ? "Название обязательно" : "Title is required",
    ownerRequired: isRussian ? "Владелец обязателен" : "Owner is required",
    problemRequired: isRussian ? "Описание проблемы обязательно" : "Problem description is required",
    goalRequired: isRussian ? "Цель обязательна" : "Goal is required",
    acceptanceRequired: isRussian ? "Нужен хотя бы один критерий приемки" : "At least one acceptance criterion is required"
  };

  const title = await inputText({
    title: t.createSpec,
    prompt: t.enterTitle,
    placeHolder: "Search filters",
    validate: requireText(t.titleRequired)
  });
  if (!title) {
    return undefined;
  }

  const type = await pickOne(t.selectType, SPEC_TYPES);
  if (!type) {
    return undefined;
  }

  const priority = await pickOne(t.selectPriority, PRIORITIES);
  if (!priority) {
    return undefined;
  }

  const owner = await inputText({
    title: t.createSpec,
    prompt: t.enterOwner,
    value: os.userInfo().username,
    validate: requireText(t.ownerRequired)
  });
  if (!owner) {
    return undefined;
  }

  const problem = await inputText({
    title: t.createSpec,
    prompt: t.describeProblem,
    placeHolder: "Users cannot filter results",
    validate: requireText(t.problemRequired)
  });
  if (!problem) {
    return undefined;
  }

  const goal = await inputText({
    title: t.createSpec,
    prompt: t.describeGoal,
    placeHolder: "Add filtering to the list page",
    validate: requireText(t.goalRequired)
  });
  if (!goal) {
    return undefined;
  }

  const acceptanceText = await inputText({
    title: t.createSpec,
    prompt: t.enterAcceptance,
    placeHolder: "Filters can be applied; Results update immediately",
    validate: requireText(t.acceptanceRequired)
  });
  if (!acceptanceText) {
    return undefined;
  }

  const createStarterTask = await vscode.window.showQuickPick(
    [
      { label: t.yes, value: true, description: t.starterTaskYes },
      { label: t.no, value: false, description: t.starterTaskNo }
    ],
    { title: t.createStarterTask }
  );
  if (!createStarterTask) {
    return undefined;
  }

  return {
    title: title.trim(),
    type,
    priority,
    owner: owner.trim(),
    problem: problem.trim(),
    goal: goal.trim(),
    acceptanceCriteria: acceptanceText
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean),
    createStarterTask: createStarterTask.value
  };
}

async function inputText(options: {
  title: string;
  prompt: string;
  placeHolder?: string;
  value?: string;
  validate?: (value: string) => string | undefined;
}): Promise<string | undefined> {
  return vscode.window.showInputBox({
    title: options.title,
    prompt: options.prompt,
    placeHolder: options.placeHolder,
    value: options.value,
    validateInput: options.validate
  });
}

async function pickOne<T extends string>(title: string, options: readonly T[]): Promise<T | undefined> {
  const picked = await vscode.window.showQuickPick(
    options.map((item) => ({ label: item })),
    { title }
  );
  return picked?.label as T | undefined;
}

function requireText(message: string): (value: string) => string | undefined {
  return (value) => (value.trim().length > 0 ? undefined : message);
}
