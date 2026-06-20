This file provides guidance for AI agents working in this repository.

## How to investigate

1.  **Configuration and Manifests:** Start by examining `README*` files, root manifests, workspace configuration, and lockfiles.
2.  **Build and Test Config:** Inspect build, test, lint, formatter, typecheck, and codegen configurations.
3.  **CI and Pre-commit Hooks:** Review CI workflows and pre-commit or task runner configurations.
4.  **Existing Instructions:** Check for any existing instruction files such as `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md`.
5.  **OpenCode Config:** Look for repo-local OpenCode configurations like `opencode.json`.
6.  **Code Inspection:** If the architecture remains unclear, inspect a few representative code files to identify entry points, package boundaries, and execution flow. Prioritize files that explain system wiring over isolated files.

**Preference:** Favor executable sources of truth (config, scripts) over prose. If documentation conflicts with executable sources, trust the executable source.

## What to extract

Focus on high-signal facts crucial for agents in this repository:

*   **Developer Commands:** Exact commands, especially non-obvious ones.
*   **Focused Verification:** How to run a single test, a single package, or a focused verification step.
*   **Command Order:** Significant command sequences (e.g., `lint -> typecheck -> test`).
*   **Monorepo/Package Structure:** Monorepo or multi-package boundaries, directory ownership, and main application/library entry points.
*   **Toolchain Quirks:** Details about generated code, migrations, codegen, build artifacts, special environment loading, development servers, and infrastructure deployment.
*   **Repo-Specific Conventions:** Style or workflow conventions that deviate from defaults.
*   **Testing Quirks:** Fixtures, integration test prerequisites, snapshot workflows, required services, or awareness of flaky/expensive test suites.
*   **Key Constraints:** Important limitations from existing instruction files.

**Guidance:** Prioritize information that required significant effort to discover (e.g., inferring from multiple files).

## Writing Rules

*   **Inclusions:**
    *   High-signal, repo-specific guidance.
    *   Exact commands and shortcuts an agent might guess incorrectly.
    *   Architecture notes not evident from filenames.
    *   Conventions differing from language/framework defaults.
    *   Setup requirements, environment quirks, and operational gotchas.
    *   References to important existing instruction sources.
*   **Exclusions:**
    *   Generic software advice.
    *   Long tutorials or exhaustive file listings.
    *   Obvious language conventions.
    *   Speculative claims or unverified information.
    *   Content better suited for `opencode.json` `instructions`.

**Formatting:** Prefer short sections and bullet points. Keep the file concise for simple repos; summarize key structural facts for large repos.

**Preservation:** If `AGENTS.md` exists, improve it in place. Keep verified guidance, remove fluff or stale information, and reconcile with the current codebase.
