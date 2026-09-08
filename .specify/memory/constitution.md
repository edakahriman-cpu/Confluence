<!--
Sync Impact Report
- Version change: unratified template -> 1.0.0
- Modified principles:
  - Template Principle 1 -> I. Maintainable Simplicity
  - Template Principle 2 -> II. Explicit Ownership and Boundaries
  - Template Principle 3 -> III. Secure, Explicit Contracts
  - Template Principle 4 -> IV. Test-Backed Change
  - Template Principle 5 -> V. Accessible and Predictable Experience
- Added sections: Technology and Security Constraints; Development Workflow and Quality Gates
- Removed sections: None
- Follow-up TODOs: None
-->
# Confluence App Constitution

## Core Principles

### I. Maintainable Simplicity
Every change MUST use the smallest design that fully satisfies the documented requirement.
Code MUST have cohesive responsibilities, intention-revealing names, explicit types, and short,
readable control flow. Strict TypeScript applies; `any`, hidden side effects, speculative
abstractions, and duplicated business rules are prohibited. An abstraction MAY be introduced only
when it removes demonstrated duplication or protects a meaningful domain boundary. Comments MUST
explain non-obvious intent or constraints, not restate the code. This keeps the system inexpensive
to understand, test, and change.

### II. Explicit Ownership and Boundaries
Behavior MUST remain in the application and layer that owns it. NestJS controllers handle HTTP
concerns, services own business rules, DTOs define input contracts, and `PrismaService` owns
database access. Angular components own presentation and interaction while services own API and
authentication state. Cross-layer access, ad hoc Prisma clients, and shared packages without proven
cross-application duplication are prohibited. Dependencies MUST point toward stable domain
interfaces so each module can change and be tested independently.

### III. Secure, Explicit Contracts
Every untrusted input MUST be validated at its boundary, and every expected failure MUST produce an
explicit, stable, actionable response. API DTOs and frontend models MUST remain aligned whenever a
contract changes. Private fields, credentials, password hashes, reset tokens, and internal database
records MUST NOT cross public response boundaries. Protected endpoints MUST use the existing JWT
guard; public access MUST be deliberate and reviewable. Secrets, `.env` files, local databases, and
generated output MUST NOT be committed.

### IV. Test-Backed Change
Every behavior change MUST include focused automated coverage at the lowest level that proves the
requirement. Contract changes, authentication flows, persistence behavior, and frontend-backend
integration MUST include integration or end-to-end coverage. Tests MUST assert observable behavior
rather than implementation details and MUST fail for the defect or missing behavior before the fix
is considered proven. The narrowest relevant test MUST run first; broader lint, build, and test
checks MUST follow when a change crosses module or application boundaries.

### V. Accessible and Predictable Experience
User-facing behavior MUST be responsive, keyboard accessible, semantically structured, and provide
visible focus and validation states. Forms with non-trivial validation MUST use reactive forms and
surface errors accessibly. Route protection and authentication interceptor behavior MUST remain
consistent. Loading, empty, success, and expected failure states MUST be explicit wherever the user
can encounter them. Interface changes MUST follow the established visual language and MUST NOT
trade clarity or workflow efficiency for decoration.

## Technology and Security Constraints

- The repository MUST remain an npm workspaces monorepo with changes scoped to `apps/backend`,
  `apps/frontend`, or `docs` according to ownership.
- Backend code MUST follow NestJS 12, ESM import conventions, Prisma 7, SQLite, `class-validator`,
  strict TypeScript, and imports from the generated Prisma client where model types are needed.
- Database changes MUST begin in `apps/backend/prisma/schema.prisma`, include a migration, and
  regenerate the Prisma client; generated client files MUST NOT be edited manually.
- Frontend code MUST use Angular 22 standalone components and the repository's existing functional
  providers, interceptors, guards, signals, and built-in template control flow where appropriate.
- The latest relevant document under `docs` is the product source of truth. Implementation and API
  behavior MUST trace to that requirement or to an explicitly approved amendment.
- Dependencies MUST be justified by a concrete need, compatible with the existing toolchain, and
  reviewed for maintenance and security cost before introduction.

## Development Workflow and Quality Gates

1. Define the requirement and acceptance criteria before implementation. Resolve ambiguity that
	affects contracts, security, persistence, or user-visible behavior.
2. Identify the owning application and the smallest affected modules. Unrelated refactoring MUST
	remain outside the change.
3. Implement in reviewable increments. Each increment MUST preserve strict typing, explicit error
	handling, and the ownership boundaries in this constitution.
4. Add or update focused tests with the behavior. API contract changes MUST update backend and
	frontend models, consumers, and relevant tests in the same change.
5. Run the narrowest relevant workspace check first, then broaden according to impact. A change is
	not complete while relevant tests, lint, or builds fail.
6. Reviews MUST verify requirement traceability, security boundaries, clean-code quality, test
	evidence, and absence of unrelated churn. Any exception MUST record its rationale and follow-up.

## Governance

This constitution is the highest-priority engineering policy for this repository. Product
requirements define what to build; this document governs how changes are designed, implemented,
validated, and reviewed. Pull requests and implementation reviews MUST demonstrate compliance with
all applicable principles.

Amendments MUST be proposed as an explicit constitution change with rationale, affected principles,
migration impact, and approval from the project maintainer. Versioning follows semantic versioning:
MAJOR for incompatible principle removal or redefinition, MINOR for a new principle or materially
expanded obligation, and PATCH for non-semantic clarification. The ratification date remains fixed;
the last-amended date changes whenever governance content changes.

Temporary exceptions MUST identify the violated rule, business justification, owner, expiry or
remediation condition, and a verification plan. Complexity without a documented requirement or
approved exception MUST be rejected. Runtime development details remain in
`.github/copilot-instructions.md`, but conflicts are resolved in favor of this constitution.

**Version**: 1.0.0 | **Ratified**: 2026-09-08 | **Last Amended**: 2026-09-08
