---
name: conventional-commits
description: Generates and validates git commit messages following the Conventional Commits 1.0.0 specification. Use when writing commit messages, reviewing commits, suggesting commit text from diffs, or when the user mentions conventional commits, commit format, SemVer-aligned commits, or changelog-friendly commits.
---

# Conventional Commits (v1.0.0)

Follow the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages. Format aligns with SemVer: `fix` → PATCH, `feat` → MINOR, BREAKING CHANGE → MAJOR.

## Message structure

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

- **Type**: Required. `feat` or `fix` per spec; other types allowed (see below).
- **Scope**: Optional. Noun in parentheses, e.g. `feat(auth):`, `fix(parser):`.
- **Description**: Required. Short summary after the colon and space.
- **Body**: Optional. One blank line after description; free-form paragraphs.
- **Footer**: Optional. One blank line after body. Use `Token: value` or `Token #value`. For breaking changes use `BREAKING CHANGE: description` (uppercase).

## Types

| Type     | Use when |
|----------|----------|
| `feat`   | New feature (MINOR in SemVer) |
| `fix`    | Bug fix (PATCH in SemVer) |
| `docs`   | Documentation only |
| `style`  | Formatting, missing semicolons, etc. (no code logic change) |
| `refactor` | Code change that is neither fix nor feat |
| `perf`   | Performance improvement |
| `test`   | Adding or updating tests |
| `build`  | Build system or external dependencies |
| `ci`     | CI configuration |
| `chore`  | Other changes (e.g. tooling, config) |
| `revert` | Revert a previous commit; add footer `Refs: <commit-sha(s)>` |

## Breaking changes

- In **footer**: `BREAKING CHANGE: <description>` (uppercase). Can be used with any type.
- In **subject**: Add `!` after type/scope, e.g. `feat!: remove old API` or `feat(api)!: remove old API`. If `!` is used, BREAKING CHANGE footer is optional.

## Examples

**Feature with scope:**
```
feat(auth): add JWT-based login
```

**Fix with body:**
```
fix(api): prevent race on concurrent requests

Introduce request id and ignore responses from older requests.
```

**Breaking change (footer):**
```
feat: allow config to extend other configs

BREAKING CHANGE: `extends` in config file now extends other config files.
```

**Breaking change (subject):**
```
feat!: send email when product is shipped
```

**Revert:**
```
revert: revert user auth changes

Refs: 676104e, a215868
```

## Rules to apply

1. Prefix every commit with a type (`feat`, `fix`, etc.), optional scope in parentheses, optional `!`, then `: ` and the description.
2. Use `feat` for new features, `fix` for bug fixes.
3. Description must immediately follow `: `; keep it short and imperative.
4. Body (if any) starts one blank line after the description.
5. Footers (if any) start one blank line after the body; use `Token: value` or `Token #value`; tokens use `-` for spaces (e.g. `Acked-by`). `BREAKING CHANGE` is the exception and must be uppercase.
6. When generating commits from a diff, infer type and scope from the changes; suggest one commit per logical change when possible.

## Reference

- Full specification: [references/specification.md](references/specification.md)
- Spec source: https://www.conventionalcommits.org/en/v1.0.0/
