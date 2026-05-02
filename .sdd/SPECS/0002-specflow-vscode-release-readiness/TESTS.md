# Tests

## Unit Tests

- Validate any new utility logic for release checks (if added).

## Integration Tests

- `npm test`
- `npm run build`
- `npm run package`

## Manual Tests

- Run extension in Extension Development Host.
- Verify Spec Tree and refresh action.
- Open Spec Dashboard from tree item.
- Open Task Board and jump to source task.
- Generate prompt and verify clipboard content.
- Run validation and compatibility detection commands.

## Release QA Checklist

- Run `SDD: Run Release QA` and verify all checks pass in `SpecFlow Release QA` output.
- Verify TreeView opens and refreshes specs.
- Verify Dashboard opens from tree click and links open source markdown.
- Verify Task Board opens and clicking a card jumps to task source.
- Verify prompt generation copies prompt to clipboard.
- Verify `SDD: Validate Project` reports to output channel.
- Verify `SDD: Detect Compatibility` reports findings to output channel.

## Acceptance Tests

- Developer can build, test, debug, and package extension from a clean clone.
