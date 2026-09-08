# GitHub Copilot Instructions

## Project Overview

This repository is an npm workspaces monorepo for a Confluence-like application.

- `apps/backend`: NestJS 12 REST API using TypeScript, Prisma 7, and SQLite.
- `apps/frontend`: Angular 22 application using standalone components.
- `docs`: Product specifications and revision notes. Treat the latest relevant revision as the source of truth when implementing a documented feature.

Keep changes inside the application that owns the behavior. Do not introduce shared packages or new abstractions unless they remove proven duplication.

## General Conventions

- Follow the existing file structure, naming, formatting, and dependency choices.
- Keep changes focused; do not refactor unrelated code.
- Use strict TypeScript and avoid `any`. Prefer explicit domain types at API boundaries.
- Validate untrusted input and handle expected failures explicitly.
- Never commit secrets, tokens, `.env` files, generated build output, or local database files.
- Add or update focused tests when behavior changes.
- Use npm workspace commands from the repository root.

## Backend Conventions

- Keep features organized as NestJS modules with controllers, services, guards, and DTOs.
- Controllers should handle HTTP concerns; business logic belongs in services.
- Validate request payloads with `class-validator` DTOs. The global `ValidationPipe` rejects unknown properties.
- This backend uses ESM. Include `.js` extensions in relative TypeScript imports, matching the existing source.
- Access the database through `PrismaService`; do not create ad hoc `PrismaClient` instances.
- Import Prisma types and models from `apps/backend/src/generated/prisma`.
- Never edit generated Prisma client files manually.
- Change the data model in `apps/backend/prisma/schema.prisma`, create a migration, and regenerate the client.
- Preserve authentication boundaries: public endpoints must be intentional, protected endpoints must use the existing JWT guard, and passwords or reset tokens must never be returned.

## Frontend Conventions

- Use standalone Angular components and functional providers, interceptors, and guards where the project already does so.
- Prefer Angular signals and built-in template control flow for new state and templates when appropriate.
- Keep API access and authentication state in services rather than page components.
- Use reactive forms for non-trivial forms and surface validation errors accessibly.
- Preserve route protection and the existing authentication interceptor behavior.
- Keep component styles scoped to their component unless a style is genuinely global.
- Build responsive, keyboard-accessible interfaces with semantic HTML and visible focus states.

## API And Data Contracts

- Keep frontend models aligned with backend DTOs and response shapes.
- Do not expose Prisma records directly when they contain private fields; map them to safe response objects.
- Use appropriate HTTP status codes and stable, actionable error messages.
- When changing an API contract, update both applications and their relevant tests in the same change.

## Verification

Run the narrowest relevant checks first, then broaden when the change crosses boundaries.

- Backend tests: `npm run test --workspace=apps/backend`
- Backend end-to-end tests: `npm run test:e2e --workspace=apps/backend`
- Backend lint: `npm run lint --workspace=apps/backend`
- Backend build: `npm run build --workspace=apps/backend`
- Frontend tests: `npm run test --workspace=apps/frontend`
- Frontend build: `npm run build --workspace=apps/frontend`

Do not claim a check passed unless it was actually run. Report checks that could not be run and why.
