<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

# AGENTS.md — Execution Log

## Context

Static personal portfolio: **semantic HTML, plain CSS and native TypeScript** on
Vite+ and Cloudflare Workers. No UI framework, no scroll animation, no dependency
that cannot be justified. The budget is **1.19 kB of JavaScript**: that is a
design decision, not a number to relax. Single maintainer; agents must not guess
the tooling.

**The voice is the most important thing about this project.** The explanatory
comments in the source and the copy on the page are the repo's identity, not
filler (S7 in `odd/tasks/portfolio-repositioning.md`). Every versioned artifact —
code, comments, commits, docs, tests — is written in neutral Spanish: no slang,
no persona.

**Stack:** Vite+ (Vite, Rolldown, Vitest, Oxlint, Oxfmt) · native TypeScript ·
happy-dom · wrangler · pnpm · Codegraph.

**Author's environment** (for the "Esto es mío" section and for writing examples
that match how they actually work): Arch Linux on xfs · GNOME · Kitty terminal ·
Nushell shell · Helix editor in modal, selections-first mode.

### What is data and what is invention

Do not mix the two categories when reporting or proposing. When you state a fact
about the portfolio (commits, pages, metrics, versions), cite where it comes
from: the repository, `package.json`, `git rev-list`, or a `curl`. If you do not
know it, ask. Do not fill a value in so a screen looks complete.

## Patterns and Execution Guide

### Code search and indexing

- **At the start of the session, run `codegraph status` and read the version
  notice.** If it says `⚠ Index was built by vX.Y.Z; re-index to pick up this
  engine's improvements`, the index was built by an older Codegraph even though
  it says "Index is up to date". Ask the maintainer for authorization to reindex
  (`codegraph index` for a full rebuild, or `codegraph sync` if the notice itself
  suggests it) and wait for the answer. Indexing is theirs: do not run it on your
  own, and do not keep using a stale index as if it were current.
- Whenever you need to look for any piece of code, make **Codegraph** your
  primary and preferred method. It indexes and searches large chunks of code
  semantically, in natural language.
- For a narrower search with a specific scope, use _ripgrep_ (`rg`), an
  exponential improvement over `grep`.
- As a last resort, use _grep_.
- `.codegraph/` already excludes itself from git: its `.gitignore` ignores
  everything except itself, so the database never gets committed while the
  `.gitignore` does.

### Data & privacy

- Whenever you are going to handle personal data, ask the maintainer what should
  be done with it: uploading it remotely is a serious privacy risk.
- Comply with the above even when the data does not look fully personal or when
  it involves third parties.
- `~/Trabajo` holds client repositories that pay. **Capturing or publishing their
  material requires explicit maintainer authorization every time** — a public
  site is not the same as permission.

### Commands: use the ones that exist

| Command          | What it does                                                         |
| ---------------- | -------------------------------------------------------------------- |
| `vp check`       | Format, lint and types in one gate. **The default before closing.**  |
| `vp check --fix` | The same, writing the fixes back.                                    |
| `vp test`        | Vitest with `happy-dom`. 15 tests pinning the page's copy and shape. |
| `vp build`       | Production bundle. Confirms JS is still 1.19 kB.                     |
| `vp dev`         | Development server.                                                  |
| `vp install`     | After pulling remote changes, and before starting.                   |

`vp` is the single CLI: `vp dev` and `vp run dev` **may not be the same thing**.
The `package.json` scripts (`build`, `preview`, `deploy`) exist and are not
overridden. A recipe that does not appear there does not exist and must not be
invented in a report.

### Remote operations are forbidden

`pnpm deploy` and `wrangler deploy` ship to production. They require explicit
maintainer authorization **every time**, no exceptions. Authorization from a
previous run does not authorize the next one, and "the plan asked for it" is not
authorization either.

Equally remote, even though nothing is destroyed: `git push`. Same terms. The
rest of the work is local.

### Screenshots: install nothing

Playwright's Chromium **is already on this machine** (`~/.cache/ms-playwright/`,
left there by the Hotel-Casa-Noria and OpenSIM repos). This repo does not depend
on Playwright and must not add it. Screenshots with:

```bash
CHROME=~/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome
"$CHROME" --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
  --virtual-time-budget=4000 --screenshot=out.png --window-size=1280,800 URL
```

**Trap:** that mode does not fire `IntersectionObserver`, so sections carrying
`.hidden` render blank. It is fine for the top of the page; anything below the
fold needs Playwright with programmatic scrolling.

### Updates & follow-up

- **Every task in this repo goes through ODD.** Read [`odd/README.md`](odd/README.md)
  before writing code: the 7 steps, the small/large criterion, the feature
  document format, the RED→GREEN policy and the mandatory `Risk:` line. A request
  for analysis or planning is **read-only** unless the author asks for
  implementation.
- Any code change goes through `vp check` and `vp test`, plus `vp build` when it
  touches the bundle. **The bundle must stay at 1.19 kB** (S10): a new dependency
  is justified against that baseline or it does not go in.
- When advancing on tasks or plans, update `odd/` if there is an ODD plan for what
  you already executed.
- Save and/or update the above in Engram memory. This step is _mandatory_ whether
  or not there is an ODD plan.

## Disclaimer

See `README.md` for the project's purpose.
