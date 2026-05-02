# SDD Config

## Project

Name: SpecFlow for VSCode
Mode: strict-but-simple

## Storage

SpecRoot: `.sdd/SPECS`
DecisionRoot: `.sdd/DECISIONS`
TemplatesRoot: `.sdd/TEMPLATES`
StateRoot: `.sdd/STATE`

## Status Model

SpecStatuses:
- draft
- approved
- in-progress
- review
- done
- blocked

TaskStatuses:
- todo
- ready
- in-progress
- review
- done
- blocked

## Workflow Rules

RequireSpecApprovalBeforeImplementation: true
RequireAcceptanceCriteriaForTasks: true
RequireTestsBeforeDone: true
RequireADRForArchitectureTasks: true
RequireAllowedFilesForAgentPrompt: true

## Compatibility

GitHubSpecKitCompatibility: true

## Integrations

GitLab: planned
GitHub: planned
Claude: clipboard
Codex: clipboard
Copilot: clipboard
LocalLLM: clipboard
