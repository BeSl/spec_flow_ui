# Design

## Main UI Areas

1. Activity Bar item: SpecFlow.
2. Spec Tree View.
3. Task Tree / Task Board.
4. Spec Dashboard WebView.
5. Prompt Preview WebView.
6. Validation Output Panel.

## Spec Tree

The Spec Tree displays `.sdd/SPECS` hierarchically.

Each item should show:

- title;
- status;
- type;
- priority if important.

## Spec Dashboard

The dashboard should show:

- spec title;
- status;
- priority;
- summary;
- linked files;
- task progress;
- next recommended actions.

## Task Cards

Each task card should show:

- id;
- title;
- status;
- priority;
- assigned agent;
- acceptance criteria summary.

## Prompt Preview

Prompt preview should allow the user to:

- inspect generated context;
- copy to clipboard;
- open related files.

## Compatibility Import

Compatibility import uses a review-first flow.

- detect compatible source structures;
- generate mapping preview without writing files;
- allow per-file action selection (`create`, `skip`, `overwrite`);
- require explicit confirmation before write;
- generate import report after execution.

Detailed mapping is documented in `COMPATIBILITY-IMPORT.md`.
