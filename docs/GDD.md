<!-- FILE: GDD.md -->
<!-- STATUS: REWRITTEN | UPDATED: 2026-06-18 -->
# Game Design Document (Condensed) - Stellar Dominion

> A concise GDD linking to all major game systems.

---

## Overview

Stellar Dominion is a 4X Space Strategy MMORPG where players build empires, research technologies, forge alliances, and conquer the galaxy.

## Core Pillars

### 1. Empire Building
- Build and upgrade 7 building types
- Manage 3 orbital building categories
- Colonize planets across star systems
- Construct megastructures (Dyson spheres, ring worlds)

> **Source:** server/gameEngine.ts, shared/config/gameConfig.ts

### 2. Military & Combat
- 10+ ship classes with tactical fitting
- 90+ fitting modules (weapons, defense, propulsion, electronic, engineering, utility)
- PvP and PvE combat modes with flange formations
- Orbital defense platforms and stations

> **Source:** server/combatEngine.ts, shared/config/combatConfig.ts, shared/config/weaponsAndDefenseConfig.ts

### 3. Research & Technology
- 900+ technologies across 11 branches
- 13 research sub-branches
- Tier 1-99, Level 1-999 progression
- Custom research labs with specializations

> **Source:** shared/config/technologyTreeConfig.ts, shared/config/researchProgression.ts

### 4. Economy & Trading
- 7 resource types (metal, crystal, deuterium, energy, credits, food, water)
- 3-tier currency (silver, gold, platinum)
- Market orders, auction house, player-to-player trading
- Banking system with interest

> **Source:** shared/config/gameConfig.ts, shared/config/economy/, shared/schema.ts:1864-1955

### 5. Social & Guilds
- Alliances with shared resources
- Guilds with custom roles and permissions
- 6-player raid teams
- Friends list with online status

> **Source:** shared/schema.ts (alliances, guilds, teams, friends tables)

### 6. Government & Politics
- 3-pillar government tree (Stability, Law, Economic Doctrine)
- 23 leader types with unique bonuses
- 18 building categories, 32 sub-categories
- Government progression nodes with effects

> **Source:** shared/config/governmentProgressionTreeConfig.ts, shared/config/governmentLeadersConfig.ts

### 7. Universe & Exploration
- Procedural universe generation (4 presets)
- 50+ planet types with full physics simulation
- Wormhole network and FTL travel
- Expeditions and anomalies

> **Source:** shared/config/universeGenerationConfig.ts, shared/config/planetTypesConfig.ts

### 8. Ship Fitting
- EVE Online-style fitting system
- 5 slot types (high, mid, low, rig, subsystem)
- 6 module categories
- CPU, powergrid, capacitor management

> **Source:** client/src/lib/shipFittingModules.ts (1891 lines, 90+ modules)

### 9. Power Grid Management
- Interplanetary power transmission
- 6 energy source types
- 6 transmission systems
- 5 AI doctrines
- 16 power technologies

> **Source:** client/src/lib/interplanetaryPowerGrid.ts, client/src/lib/interplanetaryPowerSimulation.ts

### 10. Orbital Defense
- 8 orbital platform classes
- 7 module categories
- 5 orbital doctrines
- Automated patrol and interception

> **Source:** client/src/lib/orbitalDefenseSystem.ts (1039 lines)

## Database

72 PostgreSQL tables via Drizzle ORM covering all game systems.

> **Source:** shared/schema.ts (2020 lines)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Query, Tailwind |
| Backend | Express.js, TypeScript |
| Database | PostgreSQL, Drizzle ORM |
| Auth | Basic Auth, session-based |
| Shared | TypeScript configs, Zod schemas |

---

*Condensed game design document.*
