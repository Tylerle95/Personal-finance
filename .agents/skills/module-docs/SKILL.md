---
name: module-docs
description: Enforces the standard docs folder structure for Flutter feature modules. Apply when creating or updating documentation for a module under lib/src/modules/{module_name}/docs/. Requires 6 core files focused on developer implementation needs: README, Architecture, API, Conventions, DataModel, and NonFunctionalRequirements.
---

# Module Documentation Structure

This skill ensures that every feature module in the project has a consistent, developer-focused documentation suite.

## Required Documents

All module documentation MUST live at `lib/src/modules/{module_name}/docs/`. Each module is required to have the following files:

| File | Purpose | Priority |
|------|---------|----------|
| `README.md` | Module overview, setup, usage guide, quick links | 🔴 CRITICAL |
| `Architecture.md` | Module layers, components, data flow, boundaries | 🔴 CRITICAL |
| `API.md` | Public API signatures, contracts, method descriptions | 🔴 CRITICAL |
| `Conventions.md` | Coding standards, patterns, naming rules | 🟡 IMPORTANT |
| `DataModel.md` | Entities, DTOs, relationships, schemas | 🟡 IMPORTANT |
| `NonFunctionalRequirements.md` | Performance, security, platform constraints | 🟡 IMPORTANT |
| `TestingStrategy.md` | (Optional) Testing approach, scenarios, coverage | 🟢 OPTIONAL |

## File Structure

```
lib/src/modules/{module_name}/docs/
├── README.md
├── Architecture.md
├── API.md
├── Conventions.md
├── DataModel.md
├── NonFunctionalRequirements.md
└── TestingStrategy.md (optional)
```

## Implementation Guidelines

### 1. Structure
- File names MUST match exactly as listed above.
- Docs focus on **developer implementation needs**, not business requirements or user stories.

### 2. Mandatory Links
- `README.md` MUST link to all other documents in the suite.
- Update relevant documents whenever module code undergoes significant changes.

### 3. Templates
For detailed document templates, see [**Templates**](references/templates.md).

## Quality Checklist

Before finalizing module docs, verify:
- [ ] All 6 core files exist in the correct location.
- [ ] README.md links to all related docs.
- [ ] Architecture.md explains layer structure and data flow.
- [ ] API.md lists all public method signatures.
- [ ] Conventions.md captures module-specific coding patterns.
- [ ] DataModel.md reflects current entities and DTOs.
- [ ] NonFunctionalRequirements.md covers performance, security, and constraints.

## Progress And Issues Checklist

When documenting active module work, create and maintain a separate checklist
file in the same docs folder:
- `lib/src/modules/{module_name}/docs/WorkTracking.md`

Do not place these sections directly in `README.md`.
The checklist file must include:

- [ ] `## Progress Checklist`
- [ ] `## Known Issues`
- [ ] `## Pending Tasks`

### Checklist Rules
- Use checkbox format for progress items: `- [x] done` or `- [ ] pending`.
- Keep known issues explicit with impact and next action.
- Keep pending tasks actionable and short, one task per line.
- Update all three sections whenever implementation status changes.

### Suggested Template

```md
## Progress Checklist
- [x] Item completed
- [ ] Item in progress

## Known Issues
- [ ] Issue summary, impact, and next action

## Pending Tasks
- [ ] Next concrete task
```
