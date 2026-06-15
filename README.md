# Universe Empire Dominions

`universe-empire-domions` is the current browser game workspace for a sci-fi empire strategy RPG built with React, Express, TypeScript, and PostgreSQL-compatible storage.

Current live version: `Alpha 1.5.0`

This repository now reflects the live game shell rather than the older upstream-branded documentation. The current build includes:

- a title screen with `Nine Realms` intelligence on the left and `Server Health` telemetry on the right of the login panel
- a shared in-game `GameLayout` with a left-side main menu, linked submenus, and a resource top bar
- mobile and touch-aware display settings for device profile, browser width, touch targets, and sticky mobile bars
- a curated imported asset pack from the vendored upstream source, exposed through the in-game assets gallery
- a TypeScript migration track for imported source logic via `shared/ogamex`, `generated/ogamex-ts`, and `script/ogamex_mass_rewrite.py`

## Current Stack

- Frontend: React 19, TypeScript, Wouter, TanStack Query, Tailwind, Radix UI
- Backend: Express, TypeScript, session auth, REST endpoints
- Data layer: Drizzle ORM with PostgreSQL-compatible storage
- Tooling: Vite, tsx, drizzle-kit

## Current Game Shape

The live project is organized around a consistent shell:

- title/auth flow in [Auth.tsx](/d:/New%20folder/StellarDominion-2/client/src/pages/Auth.tsx)
- shared left-sidebar layout in [GameLayout.tsx](/d:/New%20folder/StellarDominion-2/client/src/components/layout/GameLayout.tsx)
- page routes under [client/src/pages](/d:/New%20folder/StellarDominion-2/client/src/pages)
- shared configs and imported-source bridges under [shared](/d:/New%20folder/StellarDominion-2/shared)
- backend routes and storage under [server](/d:/New%20folder/StellarDominion-2/server)

Major active page groups include:

- Empire: command center, planets, colonies, facilities, stations, megastructures
- Research: research hub, research management, technology trees, blueprints, relics
- Military: shipyard, fleet command, army, expeditions, combat, occupation, battle logs
- Exploration: galaxy, universe, interstellar, warp network, celestial browser, biome codex
- Diplomacy: commander, government, factions, alliance, guilds, friends, messages
- Economy: market, merchants, storefront, achievements, season pass, battle pass, story mode
- System: diagnostics, assets gallery, settings, forums, about, terms, privacy

## Quick Start

```bash
npm install
npm run dev
```

Useful scripts:

```bash
npm run dev:client
npm run dev:server
npm run build
npm run start
npm run check
npm run db:push
npm run smoke:life-support
npm run admin
```

Default local entry points depend on environment:

- `npm run dev` starts the integrated app flow
- `npm run dev:client` starts the client on port `5001`

## Documentation Map

Start with:

- [docs/README.md](/d:/New%20folder/StellarDominion-2/docs/README.md)
- [docs/md-documents/GAME_DESIGN.md](/d:/New%20folder/StellarDominion-2/docs/md-documents/GAME_DESIGN.md)
- [docs/md-documents/ARCHITECTURE.md](/d:/New%20folder/StellarDominion-2/docs/md-documents/ARCHITECTURE.md)
- [docs/md-documents/SYSTEMS_OVERVIEW.md](/d:/New%20folder/StellarDominion-2/docs/md-documents/SYSTEMS_OVERVIEW.md)
- [docs/md-documents/DEVELOPER_GUIDE.md](/d:/New%20folder/StellarDominion-2/docs/md-documents/DEVELOPER_GUIDE.md)
- [docs/md-documents/UML.md](/d:/New%20folder/StellarDominion-2/docs/md-documents/UML.md)

## Imported Source Notes

This repository includes vendored upstream source in [ogamex-source](/d:/New%20folder/StellarDominion-2/ogamex-source). That folder is reference material and asset source, not the live app runtime.

The active migration path is:

- curated handwritten ports in [shared/ogamex](/d:/New%20folder/StellarDominion-2/shared/ogamex)
- bulk scaffolds in [generated/ogamex-ts](/d:/New%20folder/StellarDominion-2/generated/ogamex-ts)
- automation in [script/ogamex_mass_rewrite.py](/d:/New%20folder/StellarDominion-2/script/ogamex_mass_rewrite.py)

## Project Structure

```text
client/                 React pages, components, hooks, layout shell
server/                 Express routes, auth, storage, health, settings
shared/                 Shared configs, types, imported-source bridges
docs/                   Project documentation
generated/ogamex-ts/    Generated TypeScript migration scaffolds
ogamex-source/          Vendored upstream source and asset reference
sql/                    SQL notes and database reference files
script/                 Build, smoke-test, and migration scripts
```

## Current Documentation Goal

The Markdown set in this repository is being kept aligned to the live game instead of older placeholder counts, broken links, or outdated legacy wording. Where `OGameX` still appears, it refers only to imported upstream reference material or asset provenance.
