# ADR-0002 Use a Simple Status Model

Status: accepted  
Date: 2026-04-30

## Context

A complex workflow can make SDD hard to adopt. The extension should reduce friction and remain understandable for solo developers and small teams.

## Decision

Use a small number of statuses.

Spec statuses:

```text
draft -> approved -> in-progress -> review -> done
```

Task statuses:

```text
todo -> ready -> in-progress -> review -> done
```

Both specs and tasks may also use:

```text
blocked
```

## Consequences

Pros:

- Lower entry barrier.
- Easier UI.
- Easier validation.
- Easier integration with GitLab/GitHub boards later.

Cons:

- Less precise workflow analytics.
- Some teams may need custom statuses in future versions.
