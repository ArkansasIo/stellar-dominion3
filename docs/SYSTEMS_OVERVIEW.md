# Systems Overview

Complete reference of all game systems with source file links.

---

## Table of Contents

1. [Turn System](#turn-system)
2. [Resource Economy](#resource-economy)
3. [Combat](#combat)
4. [Research](#research)
5. [Fleet](#fleet)
6. [Alliances](#alliances)
7. [Trading](#trading)
8. [Government](#government)
9. [Civilization](#civilization)
10. [Commander](#commander)
11. [Megastructures](#megastructures)
12. [Orbital Stations](#orbital-stations)
13. [Life Support](#life-support)
14. [Espionage](#espionage)
15. [Expeditions](#expeditions)
16. [Achievements](#achievements)
17. [Guilds](#guilds)
18. [Leaderboard](#leaderboard)
19. [Live Ops](#live-ops)
20. [Universe Generation](#universe-generation)
21. [Blueprint System](#blueprint-system)
22. [Smithy](#smithy)
23. [High Command](#high-command)
24. [Durability](#durability)
25. [Spore Drive](#spore-drive)
26. [Army System](#army-system)
27. [Kardashev Scale](#kardashev-scale)
28. [Interplanetary Power Grid](#interplanetary-power-grid)
29. [Warp Network](#warp-network)
30. [Artifacts & Relics](#artifacts--relics)
31. [Skills System](#skills-system)

---

## Turn System

The turn system advances the game at regular intervals, triggering resource production, fleet movement, research progress, and all time-based mechanics.

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/turnSystemConfig.ts` | Turn timing, intervals, progression rules |
| Server | `server/services/turnSystemService.ts` | Turn system management & advancement |
| Routes | `server/routes-turnsystem.ts` | Turn system API endpoints |
| Engine | `server/gameEngine.ts` | Turn processing (production, movement, research) |

> **Source:** `shared/config/turnSystemConfig.ts`
> **Source:** `server/services/turnSystemService.ts`
> **Source:** `server/routes-turnsystem.ts`
> **Source:** `server/gameEngine.ts`

---

## Resource Economy

Resource production, storage, consumption, and trading across planetary colonies.

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/gameConfig.ts` | Core game settings including resource definitions |
| Config | `shared/config/resourceConfig.ts` | Resource types, base production rates |
| Config | `shared/config/resourceElementsConfig.ts` | Resource element definitions |
| Config | `shared/config/economy/resourceSettings.ts` | Economy resource settings |
| Config | `shared/config/economy/devicePrices.ts` | Device pricing |
| Config | `shared/config/autoBuyResourcesConfig.ts` | Auto-buy resource configuration |
| Server | `server/gameEngine.ts` | Resource production processing per turn |
| Server | `server/services/resourceService.ts` | Resource calculation & management |
| Server | `server/services/autoBuyResourcesService.ts` | Auto-buy resource purchases |
| Server | `server/routes-autobuyresources.ts` | Auto-buy resource API endpoints |
| Client | `client/src/lib/resourceMath.ts` | Client-side resource calculations |
| Client | `client/src/pages/Resources.tsx` | Resource management UI |

> **Source:** `shared/config/gameConfig.ts`
> **Source:** `shared/config/resourceConfig.ts`
> **Source:** `shared/config/resourceElementsConfig.ts`
> **Source:** `shared/config/autoBuyResourcesConfig.ts`
> **Source:** `server/services/resourceService.ts`
> **Source:** `server/services/autoBuyResourcesService.ts`
> **Source:** `client/src/lib/resourceMath.ts`
> **Source:** `client/src/pages/Resources.tsx`

---

## Combat

Space and ground combat resolution including fleet battles, raid operations, and empire combat.

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/combatConfig.ts` | Combat formulas, damage modifiers, battle parameters |
| Config | `shared/config/combat/combatSettings.ts` | Combat settings |
| Config | `shared/config/combat/fleet/fleetCommandSystem.ts` | Fleet command system config |
| Config | `shared/config/combat/army/` | Army combat configs (armyCategories, armySubsystems, armyManagement, armyBuildingStructures, unitConfig, unitsProgression, unitSystems, unitJobTaxonomy, unitResearch) |
| Config | `shared/config/weaponsAndDefenseConfig.ts` | Weapons & defense stats |
| Config | `shared/config/enemyRacesConfig.ts` | Enemy race definitions |
| Config | `shared/config/empireCombatUniverseSystemsConfig.ts` | Empire combat universe |
| Server | `server/combatEngine.ts` | Combat resolution engine |
| Server | `server/routes-combat.ts` | Combat API endpoints |
| Server | `server/routes-empire-combat-universe.ts` | Empire combat endpoints |
| Server | `server/routes-army-system.ts` | Army system endpoints |
| Server | `server/routes-army-building-structures.ts` | Army building structure endpoints |
| Server | `server/services/raidOperationsService.ts` | Raid operations logic |
| Server | `server/services/armySystemService.ts` | Army system management |
| Server | `server/services/armyBuildingStructuresService.ts` | Army building structures |
| Client | `client/src/lib/combatEngine.ts` | Client-side combat simulation |
| Client | `client/src/lib/combatSystem.ts` | Combat system utilities |
| Client | `client/src/lib/militaryData.ts` | Military data definitions |
| Client | `client/src/lib/militaryAttributes.ts` | Military attribute modifiers |
| Client | `client/src/pages/Combat.tsx` | Combat UI |
| Client | `client/src/pages/GroundCombat.tsx` | Ground combat UI |
| Client | `client/src/pages/Army.tsx` | Army view |
| Client | `client/src/pages/ArmyManagement.tsx` | Army management UI |

> **Source:** `shared/config/combatConfig.ts`
> **Source:** `shared/config/combat/combatSettings.ts`
> **Source:** `shared/config/weaponsAndDefenseConfig.ts`
> **Source:** `shared/config/enemyRacesConfig.ts`
> **Source:** `server/combatEngine.ts`
> **Source:** `server/routes-combat.ts`
> **Source:** `server/services/raidOperationsService.ts`
> **Source:** `server/services/armySystemService.ts`
> **Source:** `client/src/lib/combatEngine.ts`
> **Source:** `client/src/pages/Combat.tsx`

---

## Research

Technology research tree with prerequisites, queues, research labs, and XP progression.

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/technologyTreeConfig.ts` | Tech tree structure, unlock conditions |
| Config | `shared/config/technologyTreeExpandedConfig.ts` | Expanded tech tree |
| Config | `shared/config/technologyTreeCustomConfig.ts` | Custom tech tree extensions |
| Config | `shared/config/technologyTreeQuickReference.ts` | Tech tree quick reference |
| Config | `shared/config/researchProgression.ts` | Research progression rules |
| Config | `shared/config/researchQueueConfig.ts` | Research queue configuration |
| Config | `shared/config/researchTechnologyLibraryConfig.ts` | Research technology library |
| Config | `shared/config/researchTechnologyOperationsConfig.ts` | Research operations config |
| Config | `shared/config/researchTradingConfig.ts` | Research trading config |
| Config | `shared/config/researchXPConfig.ts` | Research XP configuration |
| Config | `shared/config/customLabConfig.ts` | Custom lab configuration |
| Server | `server/routes-research.ts` | Research API endpoints |
| Server | `server/routes-researchlab.ts` | Research lab endpoints |
| Server | `server/routes-researchxp.ts` | Research XP endpoints |
| Server | `server/routes-recommendations.ts` | AI recommendation endpoints |
| Server | `server/routes-customlabs.ts` | Custom lab endpoints |
| Server | `server/services/technologyService.ts` | Technology research processing |
| Server | `server/services/researchLabService.ts` | Research lab management |
| Server | `server/services/researchRecommendationsService.ts` | AI research recommendations |
| Server | `server/services/researchTradingService.ts` | Research trading |
| Server | `server/services/researchXPService.ts` | Research XP calculation |
| Client | `client/src/lib/researchTechnologyTreeCatalog.ts` | Research tree catalog |
| Client | `client/src/lib/researchLabAdministration.ts` | Research lab admin |
| Client | `client/src/lib/researchData.ts` | Research data |
| Client | `client/src/lib/techData.ts` | Technology data |
| Client | `client/src/pages/Research.tsx` | Research tree UI |
| Client | `client/src/pages/ResearchLab.tsx` | Research lab UI |
| Client | `client/src/pages/ResearchAnalyticsDashboard.tsx` | Research analytics |
| Client | `client/src/pages/TechnologyTree.tsx` | Technology tree view |
| Client | `client/src/pages/TechTree.tsx` | Tech tree view |

> **Source:** `shared/config/technologyTreeConfig.ts`
> **Source:** `shared/config/researchProgression.ts`
> **Source:** `shared/config/researchQueueConfig.ts`
> **Source:** `server/services/technologyService.ts`
> **Source:** `server/routes-research.ts`
> **Source:** `server/services/researchLabService.ts`
> **Source:** `client/src/lib/researchTechnologyTreeCatalog.ts`
> **Source:** `client/src/pages/Research.tsx`
> **Source:** `client/src/pages/ResearchLab.tsx`

---

## Fleet

Fleet management, ship construction, ship fitting, and fleet movement.

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/staryardConfig.ts` | Shipyard/starship building config |
| Config | `shared/config/shipClassificationSystem.ts` | Ship class definitions |
| Config | `shared/config/starshipSystemsAndStructuresTaxonomyConfig.ts` | Ship systems taxonomy |
| Config | `shared/config/starRaritySystem.ts` | Star rarity system |
| Config | `shared/config/starfleetBiomeCatalogConfig.ts` | Starfleet biome catalog |
| Server | `server/services/fleetService.ts` | Fleet management & movement |
| Server | `server/routes-gameactions.ts` | Game actions including fleet deployment |
| Server | `server/routes-travel.ts` | Fleet travel endpoints |
| Client | `client/src/lib/unitData.ts` | Fleet unit definitions |
| Client | `client/src/lib/unitPersonnelGenClone.ts` | Unit personnel generation |
| Client | `client/src/lib/shipFittingModules.ts` | Ship fitting modules |
| Client | `client/src/lib/ogameShips.ts` | OGame-style ship definitions |
| Client | `client/src/lib/starshipLineCatalog.ts` | Starship line catalog |
| Client | `client/src/pages/Fleet.tsx` | Fleet management UI |
| Client | `client/src/pages/Shipyard.tsx` | Shipyard UI |
| Client | `client/src/pages/Fitting.tsx` | Ship fitting UI |
| Client | `client/src/pages/FittingEnhanced.tsx` | Enhanced fitting UI |

> **Source:** `shared/config/staryardConfig.ts`
> **Source:** `shared/config/shipClassificationSystem.ts`
> **Source:** `server/services/fleetService.ts`
> **Source:** `server/routes-gameactions.ts`
> **Source:** `client/src/lib/unitData.ts`
> **Source:** `client/src/pages/Fleet.tsx`
> **Source:** `client/src/pages/Shipyard.tsx`

---

## Alliances

Alliance creation, membership, diplomacy, and multiplayer bonuses.

| Layer | File | Purpose |
|-------|------|---------|
| Schema | `shared/schema.ts` | `alliances`, `allianceMembers` tables |
| Server | `server/routes-alliances.ts` | Alliance API endpoints |
| Server | `server/services/multiplayerBonusesService.ts` | Alliance bonus calculation |
| Server | `server/routes-multiplayerbonuses.ts` | Multiplayer bonus endpoints |
| Client | `client/src/lib/allianceSystems.ts` | Alliance management logic |
| Client | `client/src/lib/allianceData.ts` | Alliance data definitions |
| Client | `client/src/pages/Alliance.tsx` | Alliance management UI |

> **Source:** `shared/schema.ts`
> **Source:** `server/routes-alliances.ts`
> **Source:** `server/services/multiplayerBonusesService.ts`
> **Source:** `client/src/lib/allianceSystems.ts`
> **Source:** `client/src/pages/Alliance.tsx`

---

## Trading

Resource trading, market operations, merchant system, and trade routes.

| Layer | File | Purpose |
|-------|------|---------|
| Server | `server/routes-resource-trading.ts` | Resource trading endpoints |
| Server | `server/routes-trading.ts` | Trading system endpoints |
| Server | `server/routes-trades.ts` | Trade route endpoints |
| Client | `client/src/pages/Market.tsx` | Market UI |
| Client | `client/src/pages/Merchants.tsx` | Merchant UI |
| Client | `client/src/lib/marketData.ts` | Market data definitions |

> **Source:** `server/routes-resource-trading.ts`
> **Source:** `server/routes-trading.ts`
> **Source:** `server/routes-trades.ts`
> **Source:** `client/src/pages/Market.tsx`
> **Source:** `client/src/pages/Merchants.tsx`

---

## Government

Government progression tree, leaders, and building structures.

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/governmentProgressionTreeConfig.ts` | Government advancement paths |
| Config | `shared/config/governmentLeadersConfig.ts` | Government leader definitions |
| Config | `shared/config/governmentBuildingStructuresConfig.ts` | Government building definitions |
| Config | `shared/config/framingBuildingStructuresConfig.ts` | Framing building structures |
| Server | `server/routes-government-progression.ts` | Government progression endpoints |
| Server | `server/routes-government-leaders.ts` | Government leader endpoints |
| Server | `server/routes-government-buildings.ts` | Government building endpoints |
| Server | `server/services/governmentProgressionService.ts` | Government advancement logic |
| Client | `client/src/lib/governmentSystems.ts` | Government system logic |
| Client | `client/src/lib/governmentData.ts` | Government data definitions |
| Client | `client/src/pages/Government.tsx` | Government UI |

> **Source:** `shared/config/governmentProgressionTreeConfig.ts`
> **Source:** `shared/config/governmentLeadersConfig.ts`
> **Source:** `server/routes-government-progression.ts`
> **Source:** `server/services/governmentProgressionService.ts`
> **Source:** `client/src/lib/governmentSystems.ts`
> **Source:** `client/src/pages/Government.tsx`

---

## Civilization

Colony management, civilization jobs, subsystems, and planetary occupation.

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/civilizationJobsConfig.ts` | Colony job definitions |
| Config | `shared/config/civilizationSubsystemsConfig.ts` | Civilization subsystem configs |
| Config | `shared/config/civilizationMilitaryJobConfig.ts` | Military job definitions |
| Config | `shared/config/civilianStructuresConfig.ts` | Civilian structure definitions |
| Config | `shared/config/planetsProgression.ts` | Planet progression rules |
| Config | `shared/config/moonsProgression.ts` | Moon progression rules |
| Config | `shared/config/buildingsProgression.ts` | Building progression rules |
| Server | `server/routes-civilization-system.ts` | Civilization system endpoints |
| Server | `server/routes-civilization.ts` | Civilization management endpoints |
| Server | `server/routes-planets.ts` | Planet management endpoints |
| Server | `server/routes-moons.ts` | Moon endpoints |
| Server | `server/services/civilizationSystemService.ts` | Civilization system logic |
| Client | `client/src/lib/colonySystems.ts` | Colony management logic |
| Client | `client/src/lib/planetUtils.ts` | Planet utility functions |
| Client | `client/src/lib/planetDossier.ts` | Planet dossier data |
| Client | `client/src/pages/Colonies.tsx` | Colony management UI |
| Client | `client/src/pages/PlanetDetail.tsx` | Planet detail UI |
| Client | `client/src/pages/PlanetCommand.tsx` | Planet command center UI |
| Client | `client/src/pages/CivilizationSystems.tsx` | Civilization systems UI |
| Client | `client/src/pages/CivilizationManagement.tsx` | Civilization management UI |
| Client | `client/src/pages/PlanetaryOccupation.tsx` | Planetary occupation UI |

> **Source:** `shared/config/civilizationJobsConfig.ts`
> **Source:** `shared/config/civilizationSubsystemsConfig.ts`
> **Source:** `server/routes-civilization-system.ts`
> **Source:** `server/services/civilizationSystemService.ts`
> **Source:** `client/src/lib/colonySystems.ts`
> **Source:** `client/src/pages/Colonies.tsx`

---

## Commander

Commander recruitment, skill trees, talent trees, mastery, gacha system, and bank vault.

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/commander/skills/commanderSkillTreeSystem.ts` | Commander skill tree |
| Config | `shared/config/commander/talent-tree/commanderTalentTree.ts` | Commander talent tree |
| Config | `shared/config/commander/talent-tree/commanderTalentTreeConfig.ts` | Talent tree config |
| Config | `shared/config/commander/mastery/commanderMasteryConfig.ts` | Commander mastery config |
| Config | `shared/config/commander/gacha/commanderGachaCommandNexus.ts` | Commander gacha system |
| Config | `shared/config/commander/vault/commanderBankVault.ts` | Commander bank vault |
| Config | `shared/config/commander/vault/vaultBankSystem.ts` | Vault bank system |
| Server | `server/routes-commanders.ts` | Commander API endpoints |
| Server | `server/routes-bank-vault.ts` | Bank vault endpoints |
| Client | `client/src/lib/commanderTypes.ts` | Commander type definitions |
| Client | `client/src/lib/commanderSystems.ts` | Commander system logic |
| Client | `client/src/pages/Commander.tsx` | Commander UI |

> **Source:** `shared/config/commander/skills/commanderSkillTreeSystem.ts`
> **Source:** `shared/config/commander/talent-tree/commanderTalentTree.ts`
> **Source:** `shared/config/commander/mastery/commanderMasteryConfig.ts`
> **Source:** `shared/config/commander/gacha/commanderGachaCommandNexus.ts`
> **Source:** `server/routes-commanders.ts`
> **Source:** `client/src/lib/commanderTypes.ts`
> **Source:** `client/src/pages/Commander.tsx`

---

## Megastructures

Megastructure construction and management — planetary scale engineering projects.

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/megastructuresConfig.ts` | Megastructure definitions & requirements |
| Server | `server/routes-megastructures.ts` | Megastructure API endpoints |
| Server | `server/services/megastructureService.ts` | Megastructure construction logic |
| Client | `client/src/lib/megaStructures.ts` | Megastructure client logic |
| Client | `client/src/lib/megastructureExpansionCatalog.ts` | Megastructure expansion catalog |
| Client | `client/src/pages/MegaStructures.tsx` | Megastructure UI |

> **Source:** `shared/config/megastructuresConfig.ts`
> **Source:** `server/routes-megastructures.ts`
> **Source:** `server/services/megastructureService.ts`
> **Source:** `client/src/lib/megaStructures.ts`
> **Source:** `client/src/pages/MegaStructures.tsx`

---

## Orbital Stations

Orbital station construction and management.

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/orbitalStationsConfig.ts` | Orbital station definitions |
| Config | `shared/config/orbitalStationsSystem.ts` | Orbital station system |
| Server | `server/routes-orbital-stations.ts` | Orbital station API endpoints |
| Client | `client/src/lib/stationData.ts` | Station data definitions |
| Client | `client/src/pages/Stations.tsx` | Station management UI |

> **Source:** `shared/config/orbitalStationsConfig.ts`
> **Source:** `shared/config/orbitalStationsSystem.ts`
> **Source:** `server/routes-orbital-stations.ts`
> **Source:** `client/src/pages/Stations.tsx`

---

## Life Support

Life support systems required for colony habitability.

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/lifeSupportSystemsConfig.ts` | Life support definitions |
| Server | `server/routes-lifesupport.ts` | Life support API endpoints |

> **Source:** `shared/config/lifeSupportSystemsConfig.ts`
> **Source:** `server/routes-lifesupport.ts`

---

## Espionage

Espionage operations — spy missions, intelligence gathering.

| Layer | File | Purpose |
|-------|------|---------|
| Server | `server/routes-espionage.ts` | Espionage API endpoints |

> **Source:** `server/routes-espionage.ts`

---

## Expeditions

Expedition events — space anomalies, exploration missions, rewards.

| Layer | File | Purpose |
|-------|------|---------|
| Data | `shared/expeditionData.ts` | Expedition event definitions |
| Types | `shared/types/expeditions.ts` | Expedition type definitions |
| Server | `server/routes-expeditions.ts` | Expedition API endpoints |
| Server | `server/services/missingFeatureService.ts` | Missing feature tracking |
| Client | `client/src/pages/Expeditions.tsx` | Expedition UI |
| Client | `client/src/pages/Exploration.tsx` | Exploration UI |
| Client | `client/src/lib/spaceAnomalies.ts` | Space anomaly definitions |

> **Source:** `shared/expeditionData.ts`
> **Source:** `shared/types/expeditions.ts`
> **Source:** `server/routes-expeditions.ts`
> **Source:** `server/services/missingFeatureService.ts`
> **Source:** `client/src/pages/Expeditions.tsx`

---

## Achievements

Achievement tracking, unlock conditions, and rewards.

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/achievementsConfig.ts` | Achievement definitions |
| Config | `shared/config/achievementSystemConfig.ts` | Achievement system config |
| Server | `server/routes-achievements.ts` | Achievement API endpoints |
| Server | `server/services/achievementService.ts` | Achievement processing logic |
| Client | `client/src/lib/achievementsSystem.ts` | Achievement tracking |
| Client | `client/src/pages/Achievements.tsx` | Achievement UI |

> **Source:** `shared/config/achievementsConfig.ts`
> **Source:** `shared/config/achievementSystemConfig.ts`
> **Source:** `server/routes-achievements.ts`
> **Source:** `server/services/achievementService.ts`
> **Source:** `client/src/lib/achievementsSystem.ts`
> **Source:** `client/src/pages/Achievements.tsx`

---

## Guilds

Guild system — guild creation, membership, guild activities.

| Layer | File | Purpose |
|-------|------|---------|
| Schema | `shared/schema.ts` | `guilds`, `guildMembers` tables |
| Server | `server/routes-guilds.ts` | Guild API endpoints |
| Client | `client/src/pages/Guilds.tsx` | Guild UI |

> **Source:** `shared/schema.ts`
> **Source:** `server/routes-guilds.ts`
> **Source:** `client/src/pages/Guilds.tsx`

---

## Leaderboard

Player and empire rankings.

| Layer | File | Purpose |
|-------|------|---------|
| Server | `server/routes-leaderboard.ts` | Leaderboard API endpoints |
| Client | `client/src/pages/Leaderboard.tsx` | Leaderboard UI |

> **Source:** `server/routes-leaderboard.ts`
> **Source:** `client/src/pages/Leaderboard.tsx`

---

## Live Ops

Live operations — events, seasonal content, time-limited activities.

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/liveOpsContentConfig.ts` | Live ops content definitions |
| Server | `server/routes-liveops.ts` | Live ops API endpoints |
| Client | `client/src/pages/BattlePass.tsx` | Battle pass UI |
| Client | `client/src/pages/SeasonPass.tsx` | Season pass UI |

> **Source:** `shared/config/liveOpsContentConfig.ts`
> **Source:** `server/routes-liveops.ts`
> **Source:** `client/src/pages/BattlePass.tsx`
> **Source:** `client/src/pages/SeasonPass.tsx`

---

## Universe Generation

Procedural universe, galaxy, star system, and planet generation.

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/universeGenerationConfig.ts` | Universe generation parameters |
| Config | `shared/config/universeStructureConfig.ts` | Universe structure config |
| Config | `shared/config/universeConfig.ts` | Universe config |
| Config | `shared/config/planetTypesConfig.ts` | Planet type definitions |
| Config | `shared/config/entityArchetypesConfig.ts` | Entity archetype definitions |
| Config | `shared/config/entitiesExpansionConfig.ts` | Entity expansion config |
| Server | `server/routes-universe-seed.ts` | Universe seed API endpoints |
| Server | `server/services/universeSeedService.ts` | Universe generation logic |
| Server | `server/services/universeResetService.ts` | Universe reset logic |
| Client | `client/src/lib/universeSeed.ts` | Client universe generation |
| Client | `client/src/lib/celestialObjects.ts` | Celestial object definitions |
| Client | `client/src/lib/startingColonies.ts` | Starting colony definitions |
| Client | `client/src/pages/UniverseGenerator.tsx` | Universe generator UI |
| Client | `client/src/pages/Universe.tsx` | Universe view UI |
| Client | `client/src/pages/CelestialBrowser.tsx` | Celestial browser UI |

> **Source:** `shared/config/universeGenerationConfig.ts`
> **Source:** `shared/config/universeStructureConfig.ts`
> **Source:** `shared/config/planetTypesConfig.ts`
> **Source:** `server/routes-universe-seed.ts`
> **Source:** `server/services/universeSeedService.ts`
> **Source:** `client/src/lib/universeSeed.ts`
> **Source:** `client/src/pages/UniverseGenerator.tsx`

---

## Blueprint System

Blueprint-based crafting — learn blueprints, gather materials, craft items.

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/eveBlueprintSystem.ts` | Blueprint definitions & crafting recipes |
| Client | `client/src/lib/blueprintSystem.ts` | Blueprint crafting logic |
| Client | `client/src/pages/Blueprints.tsx` | Blueprint crafting UI |

> **Source:** `shared/config/eveBlueprintSystem.ts`
> **Source:** `client/src/lib/blueprintSystem.ts`
> **Source:** `client/src/pages/Blueprints.tsx`

---

## Smithy

Smithy crafting system — equipment crafting and upgrading.

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/smithySystem.ts` | Smithy system definitions |
| Config | `shared/config/economy/crafting/smithySystem.ts` | Economy smithy system |
| Config | `shared/config/economy/crafting/equipmentTemperingSystem.ts` | Equipment tempering |
| Config | `shared/config/economy/crafting/equipmentLoadoutSystem.ts` | Equipment loadout |
| Server | `server/routes-smithy.ts` | Smithy API endpoints |

> **Source:** `shared/config/smithySystem.ts`
> **Source:** `shared/config/economy/crafting/smithySystem.ts`
> **Source:** `shared/config/economy/crafting/equipmentTemperingSystem.ts`
> **Source:** `server/routes-smithy.ts`

---

## High Command

High command strategic layer — fleet command coordination.

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/highCommandSystem.ts` | High command system definitions |
| Server | `server/routes-high-command.ts` | High command API endpoints |

> **Source:** `shared/config/highCommandSystem.ts`
> **Source:** `server/routes-high-command.ts`

---

## Durability

Equipment, fleet, and building durability system — wear, repair, degradation.

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/durabilityConfig.ts` | Durability rules & parameters |
| Schema | `shared/schema.ts` | `equipment_durability`, `fleet_durability`, `building_durability` tables |

> **Source:** `shared/config/durabilityConfig.ts`
> **Source:** `shared/schema.ts`

---

## Spore Drive

Spore drive mechanics — advanced FTL travel system.

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/sporeDriveSystem.ts` | Spore drive definitions |
| Server | `server/routes-spore-drive.ts` | Spore drive API endpoints |

> **Source:** `shared/config/sporeDriveSystem.ts`
> **Source:** `server/routes-spore-drive.ts`

---

## Army System

Ground army management, recruitment, deployment, and building structures.

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/combat/army/armyCategoriesConfig.ts` | Army categories |
| Config | `shared/config/combat/army/armySubsystemsConfig.ts` | Army subsystems |
| Config | `shared/config/combat/army/armyManagementSystem.ts` | Army management system |
| Config | `shared/config/combat/army/armyBuildingStructuresConfig.ts` | Army building structures |
| Config | `shared/config/combat/army/unitConfig.ts` | Unit configuration |
| Config | `shared/config/combat/army/unitsProgression.ts` | Unit progression |
| Config | `shared/config/combat/army/unitSystemsConfig.ts` | Unit systems |
| Config | `shared/config/combat/army/unitJobTaxonomyConfig.ts` | Unit job taxonomy |
| Config | `shared/config/combat/army/unitResearchConfig.ts` | Unit research |
| Config | `shared/config/combat/fleet/fleetCommandSystem.ts` | Fleet command system |
| Types | `shared/types/armyUnitTypes.ts` | Army unit type definitions |
| Server | `server/routes-army-system.ts` | Army system endpoints |
| Server | `server/routes-army-building-structures.ts` | Army building structure endpoints |
| Server | `server/routes-unitsystems.ts` | Unit system endpoints |
| Server | `server/routes-unit-taxonomy.ts` | Unit taxonomy endpoints |
| Server | `server/services/armySystemService.ts` | Army system logic |
| Server | `server/services/armyBuildingStructuresService.ts` | Army building structures |
| Client | `client/src/hooks/useCivilizationArmy.ts` | Civilization army hook |
| Client | `client/src/pages/Army.tsx` | Army UI |
| Client | `client/src/pages/ArmyManagement.tsx` | Army management UI |

> **Source:** `shared/config/combat/army/armyCategoriesConfig.ts`
> **Source:** `shared/config/combat/army/armyManagementSystem.ts`
> **Source:** `shared/config/combat/army/unitConfig.ts`
> **Source:** `server/routes-army-system.ts`
> **Source:** `server/services/armySystemService.ts`
> **Source:** `client/src/pages/Army.tsx`

---

## Kardashev Scale

Kardashev scale progression — civilization energy advancement levels.

| Layer | File | Purpose |
|-------|------|---------|
| Client | `client/src/lib/kardashevScale.ts` | Kardashev scale logic |
| Client | `client/src/lib/kardashevUpgradeCatalog.ts` | Kardashev upgrade catalog |

> **Source:** `client/src/lib/kardashevScale.ts`
> **Source:** `client/src/lib/kardashevUpgradeCatalog.ts`

---

## Interplanetary Power Grid

Power grid system across planets and orbital facilities.

| Layer | File | Purpose |
|-------|------|---------|
| Client | `client/src/lib/interplanetaryPowerGrid.ts` | Power grid logic |
| Client | `client/src/lib/interplanetaryPowerSimulation.ts` | Power grid simulation |
| Client | `client/src/pages/PowerGrid.tsx` | Power grid UI |

> **Source:** `client/src/lib/interplanetaryPowerGrid.ts`
> **Source:** `client/src/lib/interplanetaryPowerSimulation.ts`
> **Source:** `client/src/pages/PowerGrid.tsx`

---

## Warp Network

Warp gate network for faster-than-light travel.

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/navigationConfig.ts` | Navigation config |
| Client | `client/src/lib/warpNetwork.ts` | Warp network logic |
| Client | `client/src/pages/WarpNetwork.tsx` | Warp network UI |
| Client | `client/src/pages/Navigation.tsx` | Navigation UI |

> **Source:** `shared/config/navigationConfig.ts`
> **Source:** `client/src/lib/warpNetwork.ts`
> **Source:** `client/src/pages/WarpNetwork.tsx`

---

## Artifacts & Relics

Artifact discovery, relic collection, and artifact management.

| Layer | File | Purpose |
|-------|------|---------|
| Server | `server/routes-artifacts.ts` | Artifact API endpoints |
| Client | `client/src/lib/artifactRelicSystems.ts` | Artifact/relic system logic |
| Client | `client/src/lib/artifactData.ts` | Artifact data definitions |
| Client | `client/src/pages/Artifacts.tsx` | Artifact UI |
| Client | `client/src/pages/Relics.tsx` | Relic UI |

> **Source:** `server/routes-artifacts.ts`
> **Source:** `client/src/lib/artifactRelicSystems.ts`
> **Source:** `client/src/pages/Artifacts.tsx`
> **Source:** `client/src/pages/Relics.tsx`

---

## Skills System

Player skills and skill progression.

| Layer | File | Purpose |
|-------|------|---------|
| Client | `client/src/lib/skillsData.ts` | Skills data definitions |
| Client | `client/src/lib/skills90System.ts` | 90-level skills system |
| Client | `client/src/pages/Skills.tsx` | Skills UI |

> **Source:** `client/src/lib/skillsData.ts`
> **Source:** `client/src/lib/skills90System.ts`
> **Source:** `client/src/pages/Skills.tsx`

---

## Additional Systems

### OGame Integration

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/ogameCatalogConfig.ts` | OGame catalog |
| Config | `shared/config/ogamexAssetsConfig.ts` | OGameX assets |
| Server | `server/routes-ogame.ts` | OGame endpoints |
| Server | `server/services/ogameMissionService.ts` | OGame missions |
| Server | `server/services/ogameCatalogService.ts` | OGame catalog |
| Client | `client/src/lib/ogameShips.ts` | OGame ships |
| Client | `client/src/lib/ogameResearch.ts` | OGame research |
| Client | `client/src/lib/ogameBuildings.ts` | OGame buildings |
| Client | `client/src/pages/OgameCompendium.tsx` | OGame compendium UI |

> **Source:** `shared/config/ogameCatalogConfig.ts`
> **Source:** `server/routes-ogame.ts`
> **Source:** `client/src/lib/ogameShips.ts`

### Interstellar Travel

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/interstellarTravelConfig.ts` | Interstellar travel rules |
| Client | `client/src/lib/interstellarData.ts` | Interstellar data |
| Client | `client/src/pages/Interstellar.tsx` | Interstellar UI |

> **Source:** `shared/config/interstellarTravelConfig.ts`
> **Source:** `client/src/pages/Interstellar.tsx`

### Facilities

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/facilitiesConfig.ts` | Facility definitions |
| Client | `client/src/lib/facilityOperationsCatalog.ts` | Facility operations |
| Client | `client/src/lib/facilityExpansionCatalog.ts` | Facility expansion |
| Client | `client/src/pages/Facilities.tsx` | Facility management UI |

> **Source:** `shared/config/facilitiesConfig.ts`
> **Source:** `client/src/pages/Facilities.tsx`

### Constructor Yard

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/constructorYardSystemsConfig.ts` | Constructor yard config |
| Server | `server/routes-constructor-yard.ts` | Constructor yard endpoints |
| Server | `server/services/constructorYardService.ts` | Constructor yard logic |

> **Source:** `shared/config/constructorYardSystemsConfig.ts`
> **Source:** `server/routes-constructor-yard.ts`
> **Source:** `server/services/constructorYardService.ts`

### Refinery

| Layer | File | Purpose |
|-------|------|---------|
| Client | `client/src/lib/refinerySystemsCatalog.ts` | Refinery systems catalog |

> **Source:** `client/src/lib/refinerySystemsCatalog.ts`

### Custom Research Labs

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/customLabConfig.ts` | Custom lab config |
| Server | `server/routes-customlabs.ts` | Custom lab endpoints |
| Server | `server/services/customLabService.ts` | Custom lab logic |

> **Source:** `shared/config/customLabConfig.ts`
> **Source:** `server/routes-customlabs.ts`
> **Source:** `server/services/customLabService.ts`

### Enhanced Moon System

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/enhancedMoonSystem.ts` | Enhanced moon system config |
| Server | `server/routes-moons.ts` | Moon endpoints |

> **Source:** `shared/config/enhancedMoonSystem.ts`
> **Source:** `server/routes-moons.ts`

### Satellite Network

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/satelliteNetworkConfig.ts` | Satellite network config |

> **Source:** `shared/config/satelliteNetworkConfig.ts`

### Theme System

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/themeSystemConfig.ts` | Theme system config |
| Client | `client/src/lib/utils.ts` | UI utility functions |

> **Source:** `shared/config/themeSystemConfig.ts`
> **Source:** `client/src/lib/utils.ts`

### Status System

| Layer | File | Purpose |
|-------|------|---------|
| Config | `shared/config/statusConfig.ts` | Status config |
| Server | `server/routes-status.ts` | Server status endpoints |
| Server | `server/services/serverStatusService.ts` | Server status logic |

> **Source:** `shared/config/statusConfig.ts`
> **Source:** `server/routes-status.ts`
> **Source:** `server/services/serverStatusService.ts`

### Forums & Social

| Layer | File | Purpose |
|-------|------|---------|
| Server | `server/routes-forums.ts` | Forum endpoints |
| Server | `server/routes-messages.ts` | Message endpoints |
| Server | `server/routes-friends.ts` | Friends list endpoints |
| Client | `client/src/pages/Forums.tsx` | Forums UI |
| Client | `client/src/pages/Messages.tsx` | Messages UI |
| Client | `client/src/pages/FriendsList.tsx` | Friends list UI |

> **Source:** `server/routes-forums.ts`
> **Source:** `server/routes-messages.ts`
> **Source:** `server/routes-friends.ts`
> **Source:** `client/src/pages/Forums.tsx`
> **Source:** `client/src/pages/Messages.tsx`

### Story Mode & Factions

| Layer | File | Purpose |
|-------|------|---------|
| Client | `client/src/lib/factionData.ts` | Faction data |
| Client | `client/src/pages/StoryMode.tsx` | Story mode UI |
| Client | `client/src/pages/Factions.tsx` | Factions UI |

> **Source:** `client/src/lib/factionData.ts`
> **Source:** `client/src/pages/StoryMode.tsx`
> **Source:** `client/src/pages/Factions.tsx`

### Raids

| Layer | File | Purpose |
|-------|------|---------|
| Server | `server/services/raidOperationsService.ts` | Raid operations logic |
| Client | `client/src/pages/Raids.tsx` | Raids UI |
| Client | `client/src/pages/RaidFinder.tsx` | Raid finder UI |
| Client | `client/src/pages/RaidBosses.tsx` | Raid bosses UI |

> **Source:** `server/services/raidOperationsService.ts`
> **Source:** `client/src/pages/Raids.tsx`
> **Source:** `client/src/pages/RaidFinder.tsx`
