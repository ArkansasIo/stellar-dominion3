# EVE-Style Government Progression Tree

**Unlock governance nodes in sequence to strengthen Stability, Law, and Economic Doctrine.**

## Overview

The Government Progression Tree is a hierarchical system where players unlock governance nodes to enhance their empire's capabilities. It's inspired by EVE Online's faction philosophies but tailored for StellarDominion's game mechanics.

Three core pillars guide progression:

- **🛡️ Stability** - Authority, Control, Security (Red)
- **⚖️ Law** - Rules, Justice, Legitimacy (Blue)
- **📈 Economic** - Trade, Commerce, Prosperity (Green)

## System Architecture

### Files Created

1. **Config File** - `shared/config/governmentProgressionTreeConfig.ts`
   - Defines all governance nodes and their properties
   - Contains helper functions for node operations
   - Exports tree definition and utility functions

2. **Service File** - `server/services/governmentProgressionService.ts`
   - Manages user government progression state
   - Handles node unlocking and ranking up
   - Calculates effects and progression
   - Stores progression in persistent storage

3. **API Routes** - `server/routes-government-progression.ts`
   - REST endpoints for progression management
   - Endpoints for fetching tree, status, and available nodes
   - Node unlock, rank up, and XP addition endpoints

4. **Frontend Component** - `frontend/src/components/GovernmentProgressionTree.tsx`
   - Displays progression tree UI
   - Shows node cards and pillar overviews
   - Handles node unlock/rank-up interactions

5. **Updated Page** - `frontend/src/pages/Government.tsx`
   - Integrated progression tree into government page
   - Added tab system for management vs progression views

## Core Concepts

### Government Nodes

Each node has:
- **ID**: Unique identifier (e.g., `gov-stability-t1-n1`)
- **Name**: Display name
- **Description**: Effect explanation
- **Pillar**: Related pillar (stability, law, economic)
- **Tier**: Node tier (1-3 in current setup)
- **Requirements**: Level and pillar points needed
- **Rank System**: Nodes can be ranked up to 5 times
- **Effects**: Various game modifiers (military, resources, etc.)
- **Costs**: Resource costs to unlock
- **Unlock Time**: Time to activate a node

### Progression Mechanics

```
Level-Based: Players advance through government levels by earning XP
  └─ Max Level: 100
  └─ Tiers: 10 (10 levels per tier)

Pillar Points: Earned by:
  └─ Unlocking nodes (10 points per rank)
  └─ Ranking up nodes (5 bonus points)
  └─ Government XP with pillar bonus

Node Effects: Applied when nodes are unlocked
  └─ Scale by rank (5% per rank)
  └─ Stack with other node effects
  └─ Affect gameplay mechanics directly
```

## Available Nodes

### Stability Pillar (🛡️)

| Node | Tier | Level | Effects |
|------|------|-------|---------|
| Martial Authority | 1 | 5 | +5% Military Power, Stability +0.1 |
| Provincial Control | 1 | 10 | +8% Infrastructure, Stability +0.15 |
| Absolute Authority | 2 | 15 | +12% Military Power, Stability +0.25 |
| Security Apparatus | 2 | 20 | +25% Law Enforcement, Morale -0.05 |
| Iron Fist Doctrine | 3 | 30 | +25% Military Power, Stability +0.4 |

### Law Pillar (⚖️)

| Node | Tier | Level | Effects |
|------|------|-------|---------|
| Legal Foundation | 1 | 5 | +10% Law Enforcement, Trade +3% |
| Civic Rights | 1 | 10 | +12% Population Morale, Resources +5% |
| Democratic Assembly | 2 | 15 | +20% Population Morale, Trade +10%, Science +8% |
| Commercial Law | 2 | 20 | +25% Trade Benefit, Economic +15% |
| Justice Perfect | 3 | 30 | +40% Law Enforcement, Trade +15% |

### Economic Pillar (📈)

| Node | Tier | Level | Effects |
|------|------|-------|---------|
| Free Market Initiative | 1 | 5 | +8% Trade, Resources +5%, Economic +10% |
| Commercial Networks | 1 | 10 | +15% Trade, Resources +10%, Economic +18% |
| Capitalist Expansion | 2 | 15 | +30% Economic, Resources +20%, Trade +20% |
| Production Optimization | 2 | 20 | +15% Infrastructure, Resources +15%, Economic +20% |
| Economic Dominance | 3 | 30 | +50% Economic, Resources +35%, Trade +30% |

## API Endpoints

### Get Full Tree
```
GET /api/government-progression/tree
```
Returns the complete progression tree definition.

### Get User Status
```
GET /api/government-progression/status
```
Returns user's progression, unlocked nodes, available nodes, and active effects.

### Get Pillar Status
```
GET /api/government-progression/pillars
```
Returns breakdown of pillar levels and unlocked nodes.

### Get Available Nodes
```
GET /api/government-progression/available-nodes
```
Nodes the user can unlock right now.

### Get Pillar Nodes
```
GET /api/government-progression/pillar/:pillar
```
All nodes for a specific pillar (stability, law, economic).

### Get Node Details
```
GET /api/government-progression/node/:nodeId
```
Detailed info about a specific node including costs and unlock status.

### Unlock Node
```
POST /api/government-progression/unlock
Body: { nodeId: string, rank?: number }
```
Unlocks a governance node at specified rank (default 1).

### Rank Up Node
```
POST /api/government-progression/rankup
Body: { nodeId: string }
```
Increases rank of an unlocked node (max 5).

### Add Government XP
```
POST /api/government-progression/add-xp
Body: { amount: number, pillar?: 'stability' | 'law' | 'economic' }
```
Adds XP and optionally awards pillar points.

### Reset Progression
```
POST /api/government-progression/reset
```
Resets user's government progression (use with caution!).

## Game Effects

Active nodes provide bonuses in these categories:

- **Military Power** - Combat effectiveness
- **Resource Modifiers** - Production output
- **Infrastructure** - Building speed and capacity
- **Population Morale** - Citizen happiness
- **Trade Benefit** - Trading route efficiency
- **Science Bonus** - Research speed
- **Law Enforcement** - Crime/espionage prevention
- **Economic Growth** - Wealth accumulation
- **Stability Generation** - Passive stability increase

## Frontend Usage

The component is integrated into the Government page:

```tsx
import GovernmentProgressionTree from "@/components/GovernmentProgressionTree";

// Used in tabs within Government.tsx
<TabsContent value="progression">
  <GovernmentProgressionTree />
</TabsContent>
```

## State Management

User progression is stored with:
- Current level and tier
- Total XP accumulated
- Pillar points (stability, law, economic)
- List of unlocked nodes
- Rank for each unlocked node
- Active effects from all nodes

## Progression Formulas

### Cost Scaling
```
Cost = Base Cost × (1.1)^rank
```

### Time Scaling
```
Time = Base Time × (1.08)^rank
```

### Effect Scaling
```
Effect = Base Effect × (1.05)^rank
```

### Pillar Level
```
Pillar Level = Pillar Points ÷ 50
```

## Implementation Notes

1. **Prerequisites**: Nodes can require other nodes to be unlocked first
2. **Level Gating**: Nodes require minimum character level to unlock
3. **Pillar Points**: Acts as a secondary unlock requirement for specialization
4. **Rank System**: Allows deepening commitment to a node (1-5 ranks)
5. **Effect Stacking**: All active effects combine additively

## Future Enhancements

Potential additions:
- Visual tree graph display
- Node slot system (limited active nodes)
- Pillar mastery events
- Prestige/reset system with rewards
- PvP pillars for faction conflict
- Legendary nodes at level 50+
- Dynasty systems where governments pass to successors

## Testing Endpoints

Create initial test progression:
```
GET /api/government-progression/init
```

Add XP to level up:
```
POST /api/government-progression/add-xp
Body: { amount: 1000, pillar: "stability" }
```

Available nodes after leveling:
```
GET /api/government-progression/available-nodes
```

Unlock a node:
```
POST /api/government-progression/unlock
Body: { nodeId: "gov-stability-t1-n1", rank: 1 }
```

## Integration Checklist

- [x] Config file created (governmentProgressionTreeConfig.ts)
- [x] Service file created (governmentProgressionService.ts)
- [x] API routes created (routes-government-progression.ts)
- [x] Frontend component created (GovernmentProgressionTree.tsx)
- [x] Government page updated with tabs
- [x] Routes registered in server/index.ts
- [x] Exports added to shared/config/index.ts
- [ ] Database schema (if using persistent DB instead of storage)
- [ ] Gameplay integration (award XP from activities)
- [ ] UI/UX refinements based on testing
- [ ] Balance pass (cost, time, effects)
