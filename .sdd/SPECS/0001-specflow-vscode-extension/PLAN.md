# Implementation Plan

## Phase 1: Extension foundation

Goal: Create a working VSCode extension skeleton.

Tasks:

- TASK-0001 Create VSCode extension skeleton
- TASK-0002 Register basic SDD commands

## Phase 2: SDD workspace initialization

Goal: Create `.sdd/` structure from templates.

Tasks:

- TASK-0003 Implement SDD project initializer
- TASK-0004 Add template writer with safe overwrite behavior

## Phase 3: Specification model and parser

Goal: Read specifications from Markdown folders.

Tasks:

- TASK-0005 Implement spec model
- TASK-0006 Implement metadata/frontmatter parser
- TASK-0007 Implement spec scanner

## Phase 4: VSCode UI

Goal: Visualize SDD workspace inside VSCode.

Tasks:

- TASK-0008 Implement Spec TreeView
- TASK-0009 Implement Spec Dashboard WebView
- TASK-0010 Implement Task Board WebView

## Phase 5: Prompt generation and validation

Goal: Help users work with local Codex/Claude without direct API integration.

Tasks:

- TASK-0011 Implement LLM prompt generator
- TASK-0012 Implement SDD validation service

## Phase 6: Compatibility layer

Goal: Prepare GitHub Spec Kit compatibility.

Tasks:

- TASK-0013 Add compatibility detection service
- TASK-0014 Add import/mapping design for compatible specs
