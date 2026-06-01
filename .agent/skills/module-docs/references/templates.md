# Module Documentation Templates

Use these templates to populate the required documentation files.

## README.md

```markdown
# {ModuleName} Module

## Overview
Brief description of what this module does and its main responsibilities.

## Setup
Steps to configure or enable the module (environment variables, platform requirements, etc).

## Usage
Code examples showing how to use the module's public APIs.

## Related Docs
[Architecture](Architecture.md) | [API](API.md) | [Conventions](Conventions.md) | [Data Model](DataModel.md) | [NFRs](NonFunctionalRequirements.md)
```

## Architecture.md

```markdown
# {ModuleName} Architecture

## Layers
- Domain layer: entities, interfaces
- Application layer: notifiers, use cases
- Infrastructure layer: implementations, clients, repositories
- Presentation layer: widgets, pages

## Key Components
List of main classes, notifiers, repositories and their roles.

## Data Flow
How data moves through the module (diagrams or descriptions).

## Module Boundaries
What this module owns vs what it delegates to other modules.
```

## API.md

```markdown
# {ModuleName} Public API

## Repositories
### RepositoryName
- Method signature and description
- Parameters and return types

## Notifiers
### NotifierName
- Key methods and state management

## Services
### ServiceName
- Public methods and contracts
```

## Conventions.md

```markdown
# {ModuleName} Conventions

## Coding Conventions
- DDD folder structure
- Entity/DTO patterns
- Dependency injection rules
- Layer isolation principles

## Naming
- File naming: snake_case
- Class naming: PascalCase

## UI & State
- State management patterns (Riverpod, Freezed)
- Widget organization
```

## DataModel.md

```markdown
# Data Model

## Entities
### EntityName
| Field | Type | Description |
|-------|------|-------------|

## DTOs
### DtoName
- Maps to: EntityName
- JSON serialization notes

## Relationships
- Entity relationships
- Cross-module dependencies
```

## NonFunctionalRequirements.md

```markdown
# Non-Functional Requirements

## Performance
- Load time targets
- Caching strategies

## Security
- Data protection measures
- Authentication/authorization

## Compatibility
- Supported platforms and versions
```

## TestingStrategy.md

```markdown
# Testing Strategy

## Unit Tests
- Repository mapping and API error handling
- Notifier state transitions

## Widget Tests
- Key widgets and their UI states

## Integration Tests
- API integration flows
```
