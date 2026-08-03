# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Repository overview
This is an angular frontend for the applications of [Perun IdM](https://gitlab.ics.muni.cz/perun/perun-idm/perun).
Especially relevant applications are `admin-gui` the webapp for management of perun instance, and `user-profile` the interface for users themselves.
This frontend calls the backend of perun using a generated openapi library from this [specification](https://gitlab.ics.muni.cz/perun/perun-idm/perun/-/raw/main/perun-openapi/openapi.yml).

### Structure

```
perun-web-apps/
├── apps/
│   ├── admin-gui/          # Perun Administration GUI app
│   ├── user-profile/       # Perun User Profile app
│   ├── password-reset/     # Perun Password Reset app
│   ├── consolidator/       # Perun Identity Consolidation tool app
│   ├── linker/             # Perun Account Linking app
│   ├── publications/       # Perun Publications Management app
│   └── *-e2e/              # End-to-end test suites for each app
├── libs/                   # Shared Libraries
│   ├── perun/              # Core business logic
│   │   ├── services/       # Shared Angular services for all apps
│   │   ├── models/         # TypeScript interfaces and types
│   │   ├── openapi/        # Generated API clients
│   │   └── components/     # Shared business-specific components
│   ├── ui/                 # Reusable UI components (loaders, alerts, etc.)
│   ├── config/             # Application configuration and initialization logic
│   └── general/            # Generic utility functions and helpers
└──  tools/                 # Build scripts, migration tools, and workspace generators
```

## Build & Lint commands
Build: `ng build {app name}`, e.g. `ng build admin-gui`

Lint: `prettier -c *` and `nx run {app name}:lint` , e.g. `nx run admin-gui:lint`

## Code style

- Use standalone components (no NgModules for new code)

## General behavioral guidelines

**Don't assume. Don't hide confusion. Surface tradeoffs.**

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.

**Touch only what you must. Clean up only your own mess.**

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
