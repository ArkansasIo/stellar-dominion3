// Comprehensive Facilities and Buildings System
// Multiple types and classes for all building categories

export interface FacilityProgressionConfig {
  tiers: {
    max: number;
  };
  levels: {
    max: number;
  };
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  type: "resource" | "energy" | "storage" | "military" | "research" | "civilian" | "special" | "infrastructure" | "orbital";
  class: "common" | "rare" | "epic" | "legendary" | "mythic";
  tier: number;
  level: number;
  progressionConfig: FacilityProgressionConfig;
  cost: { metal: number; crystal: number; deuterium: number };
  time: number; // construction time in seconds
  production?: { metal?: number; crystal?: number; deuterium?: number; energy?: number };
  storage?: number;
  defense?: number;
  offense?: number;
  population?: number;
  bonuses?: { [key: string]: number };
  requirements?: { building?: string; tech?: string; tier?: number };
}

// RESOURCE PRODUCTION FACILITIES (8 types x 5 classes = 40 variants)
export const RESOURCE_FACILITIES: Facility[] = [
  // Metal Mines
  { id: "metalMineCom", name: "Basic Metal Mine", description: "Common metal extraction facility", type: "resource", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 60, crystal: 15, deuterium: 0 }, time: 30, production: { metal: 30, energy: -10 } },
  { id: "metalMineRare", name: "Advanced Metal Mine", description: "Rare metal mining technology", type: "resource", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 150, crystal: 50, deuterium: 25 }, time: 25, production: { metal: 60, energy: -15 } },
  { id: "metalMineEpic", name: "Precision Metal Extractor", description: "Epic-tier metal extraction", type: "resource", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 400, crystal: 150, deuterium: 75 }, time: 20, production: { metal: 120, energy: -20 } },
  { id: "metalMineLeg", name: "Legendary Metal Harvester", description: "Legendary mining technology", type: "resource", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 1000, crystal: 500, deuterium: 250 }, time: 15, production: { metal: 250, energy: -30 } },
  { id: "metalMineMy", name: "Mythic Metal Nexus", description: "Ultimate metal production", type: "resource", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 3000, crystal: 2000, deuterium: 1000 }, time: 10, production: { metal: 500, energy: -40 } },

  // Crystal Mines
  { id: "crystalMineCom", name: "Basic Crystal Mine", description: "Common crystal extraction", type: "resource", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 48, crystal: 24, deuterium: 0 }, time: 30, production: { crystal: 15, energy: -10 } },
  { id: "crystalMineRare", name: "Advanced Crystal Mine", description: "Rare crystal mining", type: "resource", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 120, crystal: 60, deuterium: 20 }, time: 25, production: { crystal: 30, energy: -15 } },
  { id: "crystalMineEpic", name: "Precision Crystal Extractor", description: "Epic crystal extraction", type: "resource", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 320, crystal: 180, deuterium: 60 }, time: 20, production: { crystal: 60, energy: -20 } },
  { id: "crystalMineLeg", name: "Legendary Crystal Harvester", description: "Legendary crystal mining", type: "resource", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 800, crystal: 600, deuterium: 200 }, time: 15, production: { crystal: 125, energy: -30 } },
  { id: "crystalMineMy", name: "Mythic Crystal Nexus", description: "Ultimate crystal production", type: "resource", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2400, crystal: 2400, deuterium: 800 }, time: 10, production: { crystal: 250, energy: -40 } },

  // Deuterium Synthesizers
  { id: "deutSynCom", name: "Basic Deuterium Synthesizer", description: "Common deuterium production", type: "resource", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 225, crystal: 75, deuterium: 0 }, time: 30, production: { deuterium: 10, energy: -20 } },
  { id: "deutSynRare", name: "Advanced Deuterium Synthesizer", description: "Rare deuterium synthesis", type: "resource", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 450, crystal: 180, deuterium: 45 }, time: 25, production: { deuterium: 20, energy: -25 } },
  { id: "deutSynEpic", name: "Precision Deuterium Lab", description: "Epic deuterium production", type: "resource", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 1200, crystal: 500, deuterium: 150 }, time: 20, production: { deuterium: 40, energy: -30 } },
  { id: "deutSynLeg", name: "Legendary Deuterium Forge", description: "Legendary deuterium synthesis", type: "resource", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 3000, crystal: 1500, deuterium: 500 }, time: 15, production: { deuterium: 80, energy: -40 } },
  { id: "deutSynMy", name: "Mythic Deuterium Nexus", description: "Ultimate deuterium production", type: "resource", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 9000, crystal: 5000, deuterium: 2000 }, time: 10, production: { deuterium: 160, energy: -50 } },
];

// ENERGY PRODUCTION FACILITIES (6 types x 5 classes = 30 variants)
export const ENERGY_FACILITIES: Facility[] = [
  // Solar Plants
  { id: "solarCom", name: "Basic Solar Plant", description: "Harnesses solar energy", type: "energy", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 75, crystal: 30, deuterium: 0 }, time: 30, production: { energy: 20 } },
  { id: "solarRare", name: "Advanced Solar Array", description: "Rare solar technology", type: "energy", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 180, crystal: 90, deuterium: 30 }, time: 25, production: { energy: 45 } },
  { id: "solarEpic", name: "Precision Solar Collector", description: "Epic solar collection", type: "energy", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 500, crystal: 250, deuterium: 100 }, time: 20, production: { energy: 90 } },
  { id: "solarLeg", name: "Legendary Solar Generator", description: "Legendary solar power", type: "energy", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 1500, crystal: 750, deuterium: 300 }, time: 15, production: { energy: 180 } },
  { id: "solarMy", name: "Mythic Solar Nexus", description: "Ultimate solar power", type: "energy", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 4500, crystal: 2500, deuterium: 1000 }, time: 10, production: { energy: 360 } },

  // Fusion Reactors
  { id: "fusionCom", name: "Basic Fusion Reactor", description: "Fusion energy production", type: "energy", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 300, crystal: 150, deuterium: 75 }, time: 40, production: { energy: 50 }, requirements: { building: "deutSynCom" } },
  { id: "fusionRare", name: "Advanced Fusion Reactor", description: "Rare fusion technology", type: "energy", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 750, crystal: 400, deuterium: 200 }, time: 35, production: { energy: 110 }, requirements: { building: "deutSynRare" } },
  { id: "fusionEpic", name: "Precision Fusion Engine", description: "Epic fusion reactor", type: "energy", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2000, crystal: 1200, deuterium: 600 }, time: 30, production: { energy: 220 }, requirements: { building: "deutSynEpic" } },
  { id: "fusionLeg", name: "Legendary Fusion Forge", description: "Legendary fusion power", type: "energy", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 6000, crystal: 4000, deuterium: 2000 }, time: 25, production: { energy: 440 }, requirements: { building: "deutSynLeg" } },
  { id: "fusionMy", name: "Mythic Fusion Nexus", description: "Ultimate fusion power", type: "energy", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 18000, crystal: 12000, deuterium: 6000 }, time: 20, production: { energy: 880 }, requirements: { building: "deutSynMy" } },
];

// STORAGE FACILITIES (3 types x 5 classes = 15 variants)
export const STORAGE_FACILITIES: Facility[] = [
  // Metal Storage
  { id: "metalStorCom", name: "Basic Metal Storage", description: "Stores metal resources", type: "storage", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 1000, crystal: 0, deuterium: 0 }, time: 30, storage: 100000 },
  { id: "metalStorRare", name: "Advanced Metal Vault", description: "Rare storage facility", type: "storage", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 3000, crystal: 1000, deuterium: 500 }, time: 25, storage: 500000 },
  { id: "metalStorEpic", name: "Precision Metal Repository", description: "Epic storage capacity", type: "storage", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 10000, crystal: 4000, deuterium: 2000 }, time: 20, storage: 2000000 },
  { id: "metalStorLeg", name: "Legendary Metal Archive", description: "Legendary storage", type: "storage", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 30000, crystal: 15000, deuterium: 7500 }, time: 15, storage: 10000000 },
  { id: "metalStorMy", name: "Mythic Metal Nexus", description: "Ultimate storage", type: "storage", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 100000, crystal: 50000, deuterium: 25000 }, time: 10, storage: 50000000 },

  // Crystal Storage
  { id: "crystalStorCom", name: "Basic Crystal Storage", description: "Stores crystal resources", type: "storage", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 1000, crystal: 500, deuterium: 0 }, time: 30, storage: 100000 },
  { id: "crystalStorRare", name: "Advanced Crystal Vault", description: "Rare crystal storage", type: "storage", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2500, crystal: 1500, deuterium: 500 }, time: 25, storage: 500000 },
  { id: "crystalStorEpic", name: "Precision Crystal Repository", description: "Epic crystal storage", type: "storage", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 8000, crystal: 5000, deuterium: 2000 }, time: 20, storage: 2000000 },
  { id: "crystalStorLeg", name: "Legendary Crystal Archive", description: "Legendary crystal storage", type: "storage", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 25000, crystal: 18000, deuterium: 7500 }, time: 15, storage: 10000000 },
  { id: "crystalStorMy", name: "Mythic Crystal Nexus", description: "Ultimate crystal storage", type: "storage", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 80000, crystal: 60000, deuterium: 25000 }, time: 10, storage: 50000000 },

  // Deuterium Storage
  { id: "deutStorCom", name: "Basic Deuterium Tank", description: "Stores deuterium safely", type: "storage", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 1000, crystal: 1000, deuterium: 0 }, time: 30, storage: 50000 },
  { id: "deutStorRare", name: "Advanced Deuterium Vault", description: "Rare deuterium storage", type: "storage", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2500, crystal: 2500, deuterium: 500 }, time: 25, storage: 250000 },
  { id: "deutStorEpic", name: "Precision Deuterium Repository", description: "Epic deuterium storage", type: "storage", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 8000, crystal: 8000, deuterium: 2000 }, time: 20, storage: 1000000 },
  { id: "deutStorLeg", name: "Legendary Deuterium Archive", description: "Legendary deuterium storage", type: "storage", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 25000, crystal: 25000, deuterium: 10000 }, time: 15, storage: 5000000 },
  { id: "deutStorMy", name: "Mythic Deuterium Nexus", description: "Ultimate deuterium storage", type: "storage", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 80000, crystal: 80000, deuterium: 40000 }, time: 10, storage: 25000000 },
];

// MILITARY FACILITIES (5 types x 5 classes = 25 variants)
export const MILITARY_FACILITIES: Facility[] = [
  // Shipyards
  { id: "shipyardCom", name: "Basic Shipyard", description: "Constructs ships", type: "military", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 400, crystal: 200, deuterium: 100 }, time: 30, bonuses: { buildSpeed: 1.0 } },
  { id: "shipyardRare", name: "Advanced Shipyard", description: "Rare shipbuilding facility", type: "military", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 1000, crystal: 600, deuterium: 300 }, time: 25, bonuses: { buildSpeed: 1.5 } },
  { id: "shipyardEpic", name: "Precision Shipyard", description: "Epic fleet construction", type: "military", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 3000, crystal: 2000, deuterium: 1000 }, time: 20, bonuses: { buildSpeed: 2.0 } },
  { id: "shipyardLeg", name: "Legendary Shipyard", description: "Legendary vessel construction", type: "military", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 10000, crystal: 7000, deuterium: 3500 }, time: 15, bonuses: { buildSpeed: 3.0 } },
  { id: "shipyardMy", name: "Mythic Shipyard", description: "Ultimate fleet construction", type: "military", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 30000, crystal: 25000, deuterium: 12500 }, time: 10, bonuses: { buildSpeed: 5.0 } },

  // Barracks
  { id: "barracksCom", name: "Basic Barracks", description: "Trains ground units", type: "military", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 300, crystal: 150, deuterium: 75 }, time: 30, population: 100 },
  { id: "barracksRare", name: "Advanced Barracks", description: "Rare troop training", type: "military", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 750, crystal: 500, deuterium: 250 }, time: 25, population: 300 },
  { id: "barracksEpic", name: "Precision Training Center", description: "Epic unit training", type: "military", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2500, crystal: 1500, deuterium: 750 }, time: 20, population: 750 },
  { id: "barracksLeg", name: "Legendary War Academy", description: "Legendary troop training", type: "military", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 8000, crystal: 5000, deuterium: 2500 }, time: 15, population: 1500 },
  { id: "barracksMy", name: "Mythic War Nexus", description: "Ultimate troop production", type: "military", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 25000, crystal: 18000, deuterium: 9000 }, time: 10, population: 3000 },

  // Defense Towers
  { id: "defenseCom", name: "Basic Defense Tower", description: "Defends against attacks", type: "military", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 300, crystal: 100, deuterium: 0 }, time: 30, defense: 80 },
  { id: "defenseRare", name: "Advanced Defense Battery", description: "Rare defense structure", type: "military", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 800, crystal: 400, deuterium: 200 }, time: 25, defense: 250 },
  { id: "defenseEpic", name: "Precision Defense Array", description: "Epic defensive capability", type: "military", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2500, crystal: 1500, deuterium: 750 }, time: 20, defense: 750 },
  { id: "defenseLeg", name: "Legendary Fortress", description: "Legendary defensive position", type: "military", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 8000, crystal: 5000, deuterium: 2500 }, time: 15, defense: 2000 },
  { id: "defenseMy", name: "Mythic Fortress Nexus", description: "Ultimate defense", type: "military", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 25000, crystal: 18000, deuterium: 9000 }, time: 10, defense: 5000 },

  // Shield Generators
  { id: "shieldCom", name: "Basic Shield Generator", description: "Generates protective shield", type: "military", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2000, crystal: 2000, deuterium: 500 }, time: 40, defense: 1000 },
  { id: "shieldRare", name: "Advanced Shield Generator", description: "Rare shield technology", type: "military", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 5000, crystal: 5000, deuterium: 1500 }, time: 35, defense: 3000 },
  { id: "shieldEpic", name: "Precision Shield System", description: "Epic shield projection", type: "military", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 15000, crystal: 15000, deuterium: 5000 }, time: 30, defense: 10000 },
  { id: "shieldLeg", name: "Legendary Shield Dome", description: "Legendary protective barrier", type: "military", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 50000, crystal: 50000, deuterium: 15000 }, time: 25, defense: 30000 },
  { id: "shieldMy", name: "Mythic Shield Nexus", description: "Ultimate shield technology", type: "military", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 150000, crystal: 150000, deuterium: 50000 }, time: 20, defense: 100000 },
];

// RESEARCH FACILITIES (4 types x 5 classes = 20 variants)
export const RESEARCH_FACILITIES: Facility[] = [
  // Research Labs
  { id: "labCom", name: "Basic Research Lab", description: "Conducts scientific research", type: "research", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 200, crystal: 400, deuterium: 200 }, time: 30, bonuses: { researchSpeed: 1.0 } },
  { id: "labRare", name: "Advanced Research Lab", description: "Rare research facilities", type: "research", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 600, crystal: 1000, deuterium: 500 }, time: 25, bonuses: { researchSpeed: 1.5 } },
  { id: "labEpic", name: "Precision Research Institute", description: "Epic research capability", type: "research", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2000, crystal: 3500, deuterium: 1500 }, time: 20, bonuses: { researchSpeed: 2.5 } },
  { id: "labLeg", name: "Legendary Research Academy", description: "Legendary research center", type: "research", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 7000, crystal: 12000, deuterium: 5000 }, time: 15, bonuses: { researchSpeed: 4.0 } },
  { id: "labMy", name: "Mythic Research Nexus", description: "Ultimate research facility", type: "research", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 21000, crystal: 40000, deuterium: 15000 }, time: 10, bonuses: { researchSpeed: 7.0 } },

  // Observatories
  { id: "obsCom", name: "Basic Observatory", description: "Observes space phenomena", type: "research", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 250, crystal: 300, deuterium: 100 }, time: 35, bonuses: { spyCapacity: 100 } },
  { id: "obsRare", name: "Advanced Observatory", description: "Rare observation technology", type: "research", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 700, crystal: 900, deuterium: 300 }, time: 30, bonuses: { spyCapacity: 300 } },
  { id: "obsEpic", name: "Precision Observatory Array", description: "Epic observation network", type: "research", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2500, crystal: 3000, deuterium: 1000 }, time: 25, bonuses: { spyCapacity: 750 } },
  { id: "obsLeg", name: "Legendary Observation Center", description: "Legendary scanning capability", type: "research", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 9000, crystal: 12000, deuterium: 4000 }, time: 20, bonuses: { spyCapacity: 2000 } },
  { id: "obsMy", name: "Mythic Observatory Nexus", description: "Ultimate observation", type: "research", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 27000, crystal: 40000, deuterium: 12000 }, time: 15, bonuses: { spyCapacity: 5000 } },
];

// CIVILIAN FACILITIES (3 types x 5 classes = 15 variants)
export const CIVILIAN_FACILITIES: Facility[] = [
  // Residential
  { id: "resCom", name: "Basic Residential", description: "Housing for population", type: "civilian", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 100, crystal: 50, deuterium: 0 }, time: 20, population: 50 },
  { id: "resRare", name: "Advanced Housing", description: "Rare residential complex", type: "civilian", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 300, crystal: 200, deuterium: 100 }, time: 18, population: 200 },
  { id: "resEpic", name: "Precision Living Complex", description: "Epic residential space", type: "civilian", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 1000, crystal: 700, deuterium: 400 }, time: 15, population: 600 },
  { id: "resLeg", name: "Legendary Metropolis", description: "Legendary living quarters", type: "civilian", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 3500, crystal: 2500, deuterium: 1500 }, time: 12, population: 1500 },
  { id: "resMy", name: "Mythic Arcology", description: "Ultimate residential tower", type: "civilian", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 10000, crystal: 8000, deuterium: 5000 }, time: 10, population: 3500 },

  // Trade Centers
  { id: "tradeCom", name: "Basic Trade Center", description: "Enables commerce", type: "civilian", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 99 } }, cost: { metal: 200, crystal: 100, deuterium: 50 }, time: 25, bonuses: { tradeCapacity: 100, tradeFeeReduction: 0.01 } },
  { id: "tradeRare", name: "Advanced Trade Hub", description: "Rare trading facility", type: "civilian", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 99 } }, cost: { metal: 600, crystal: 400, deuterium: 200 }, time: 22, bonuses: { tradeCapacity: 300, tradeFeeReduction: 0.05 } },
  { id: "tradeEpic", name: "Precision Commerce Complex", description: "Epic trade network", type: "civilian", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 99 } }, cost: { metal: 2000, crystal: 1500, deuterium: 700 }, time: 20, bonuses: { tradeCapacity: 1000, tradeFeeReduction: 0.1 } },
  { id: "tradeLeg", name: "Legendary Trade Empire", description: "Legendary commercial hub", type: "civilian", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 99 } }, cost: { metal: 7000, crystal: 5000, deuterium: 2500 }, time: 17, bonuses: { tradeCapacity: 3000, tradeFeeReduction: 0.15 } },
  { id: "tradeMy", name: "Mythic Commerce Nexus", description: "Ultimate trading power", type: "civilian", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 99 } }, cost: { metal: 21000, crystal: 15000, deuterium: 8000 }, time: 15, bonuses: { tradeCapacity: 10000, tradeFeeReduction: 0.25 } },
];

// SPECIAL FACILITIES (5 types x 3 classes = 15 variants)
export const SPECIAL_FACILITIES: Facility[] = [
  // Jump Gates (rare to mythic only)
  { id: "jumpgateRare", name: "Basic Jump Gate", description: "Enables instant travel", type: "special", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 500000, crystal: 1000000, deuterium: 0 }, time: 120, bonuses: { travelSpeed: 1000 } },
  { id: "jumpgateEpic", name: "Advanced Jump Gate", description: "Epic dimensional transport", type: "special", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2000000, crystal: 4000000, deuterium: 1000000 }, time: 100, bonuses: { travelSpeed: 5000 } },
  { id: "jumpgateLeg", name: "Legendary Jump Gate", description: "Legendary gateway network", type: "special", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 8000000, crystal: 16000000, deuterium: 4000000 }, time: 80, bonuses: { travelSpeed: 10000 } },

  // Sensor Arrays (rare to mythic)
  { id: "sensorRare", name: "Advanced Sensor Array", description: "Rare scanning capability", type: "special", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 50000, crystal: 25000, deuterium: 10000 }, time: 60, bonuses: { detectionRange: 1000 } },
  { id: "sensorEpic", name: "Precision Sensor Network", description: "Epic detection system", type: "special", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 200000, crystal: 100000, deuterium: 50000 }, time: 50, bonuses: { detectionRange: 5000 } },
  { id: "sensorLeg", name: "Legendary Sensor Nexus", description: "Legendary scanning network", type: "special", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 800000, crystal: 500000, deuterium: 200000 }, time: 40, bonuses: { detectionRange: 10000 } },

  // Terraformers (epic to mythic)
  { id: "terraEpic", name: "Precision Terraformer", description: "Epic planetary modification", type: "special", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 100000, crystal: 200000, deuterium: 500000 }, time: 90, bonuses: { fieldExpansion: 20 } },
  { id: "terraLeg", name: "Legendary Terraformer", description: "Legendary world shaper", type: "special", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 500000, crystal: 1000000, deuterium: 2000000 }, time: 70, bonuses: { fieldExpansion: 50 } },
  { id: "terraMy", name: "Mythic Terraformer Nexus", description: "Ultimate world transformation", type: "special", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2000000, crystal: 4000000, deuterium: 8000000 }, time: 50, bonuses: { fieldExpansion: 100 } },

  // Cloaking Generators (epic to mythic)
  { id: "cloakEpic", name: "Precision Cloak Generator", description: "Epic stealth technology", type: "special", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 150000, crystal: 300000, deuterium: 100000 }, time: 75, bonuses: { stealthPower: 75 } },
  { id: "cloakLeg", name: "Legendary Cloak Field", description: "Legendary invisibility system", type: "special", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 600000, crystal: 1200000, deuterium: 400000 }, time: 60, bonuses: { stealthPower: 150 } },
  { id: "cloakMy", name: "Mythic Cloak Nexus", description: "Ultimate stealth mastery", type: "special", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2500000, crystal: 5000000, deuterium: 1500000 }, time: 45, bonuses: { stealthPower: 300 } },

  // Orbital Platforms (rare to mythic)
  { id: "orbitalRare", name: "Advanced Orbital Platform", description: "Rare orbital installation", type: "orbital", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 75000, crystal: 50000, deuterium: 25000 }, time: 70, bonuses: { orbitModifier: 1.5 } },
  { id: "orbitalEpic", name: "Precision Space Station", description: "Epic orbital capability", type: "orbital", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 300000, crystal: 200000, deuterium: 100000 }, time: 60, bonuses: { orbitModifier: 3.0 } },
  { id: "orbitalLeg", name: "Legendary Orbital Fortress", description: "Legendary space platform", type: "orbital", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 1200000, crystal: 800000, deuterium: 400000 }, time: 50, bonuses: { orbitModifier: 5.0 } },
  { id: "orbitalMy", name: "Mythic Orbital Nexus", description: "Ultimate space platform", type: "orbital", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 5000000, crystal: 3000000, deuterium: 1500000 }, time: 40, bonuses: { orbitModifier: 10.0 } },
];

// FARMING FACILITIES (5 types x 5 classes = 25 variants)
export const FARMING_FACILITIES: Facility[] = [
  // Basic Farms (open-air agriculture)
  { id: "farmCom", name: "Basic Farm", description: "Open-air crop cultivation for food production", type: "resource", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 80, crystal: 20, deuterium: 0 }, time: 25, production: { energy: -5 }, bonuses: { foodProduction: 40 } },
  { id: "farmRare", name: "Advanced Farm", description: "Rare precision-agriculture techniques", type: "resource", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 200, crystal: 60, deuterium: 20 }, time: 22, production: { energy: -8 }, bonuses: { foodProduction: 100 } },
  { id: "farmEpic", name: "Precision Agri-Complex", description: "Epic automated farming complex", type: "resource", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 600, crystal: 200, deuterium: 80 }, time: 18, production: { energy: -12 }, bonuses: { foodProduction: 250 } },
  { id: "farmLeg", name: "Legendary Agri-Dome", description: "Legendary climate-controlled megafarm", type: "resource", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2000, crystal: 800, deuterium: 300 }, time: 14, production: { energy: -18 }, bonuses: { foodProduction: 600 } },
  { id: "farmMy", name: "Mythic Agri-Nexus", description: "Ultimate planetary food production hub", type: "resource", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 6000, crystal: 3000, deuterium: 1200 }, time: 10, production: { energy: -25 }, bonuses: { foodProduction: 1500 } },

  // Hydroponics (indoor soilless cultivation)
  { id: "hydropCom", name: "Basic Hydroponics Bay", description: "Soilless water-based crop growth", type: "resource", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 120, crystal: 60, deuterium: 0 }, time: 28, production: { energy: -8 }, bonuses: { foodProduction: 55, waterEfficiency: 0.05 } },
  { id: "hydropRare", name: "Advanced Hydroponics Lab", description: "Rare nutrient-optimized hydroponics", type: "resource", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 300, crystal: 160, deuterium: 40 }, time: 24, production: { energy: -12 }, bonuses: { foodProduction: 140, waterEfficiency: 0.08 } },
  { id: "hydropEpic", name: "Precision Hydroponics Tower", description: "Epic vertical hydroponic system", type: "resource", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 900, crystal: 500, deuterium: 150 }, time: 20, production: { energy: -18 }, bonuses: { foodProduction: 350, waterEfficiency: 0.12 } },
  { id: "hydropLeg", name: "Legendary Hydroponics Spire", description: "Legendary multi-level hydroponic megastructure", type: "resource", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 3000, crystal: 1800, deuterium: 600 }, time: 15, production: { energy: -25 }, bonuses: { foodProduction: 850, waterEfficiency: 0.18 } },
  { id: "hydropMy", name: "Mythic Hydroponics Nexus", description: "Ultimate hydroponic mega-complex", type: "resource", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 9000, crystal: 6000, deuterium: 2400 }, time: 10, production: { energy: -35 }, bonuses: { foodProduction: 2200, waterEfficiency: 0.25 } },

  // Livestock Ranches
  { id: "ranchCom", name: "Basic Livestock Ranch", description: "Animal husbandry for protein production", type: "resource", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 100, crystal: 30, deuterium: 0 }, time: 30, production: { energy: -6 }, bonuses: { foodProduction: 35 }, requirements: { building: "farmCom" } },
  { id: "ranchRare", name: "Advanced Ranch", description: "Rare selective-bred livestock facilities", type: "resource", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 250, crystal: 100, deuterium: 30 }, time: 26, production: { energy: -10 }, bonuses: { foodProduction: 90 }, requirements: { building: "farmRare" } },
  { id: "ranchEpic", name: "Precision Biofarm", description: "Epic gene-optimised livestock production", type: "resource", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 800, crystal: 350, deuterium: 120 }, time: 22, production: { energy: -15 }, bonuses: { foodProduction: 230 }, requirements: { building: "farmEpic" } },
  { id: "ranchLeg", name: "Legendary Biofarm Complex", description: "Legendary synthetic biology farms", type: "resource", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2500, crystal: 1200, deuterium: 450 }, time: 17, production: { energy: -22 }, bonuses: { foodProduction: 560 }, requirements: { building: "farmLeg" } },
  { id: "ranchMy", name: "Mythic Biofarm Nexus", description: "Ultimate synthetic protein megafactory", type: "resource", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 7500, crystal: 4000, deuterium: 1800 }, time: 12, production: { energy: -30 }, bonuses: { foodProduction: 1400 }, requirements: { building: "farmMy" } },

  // Aquaculture Centers
  { id: "aquaCom", name: "Basic Aquaculture Center", description: "Fish and aquatic crop cultivation", type: "resource", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 90, crystal: 40, deuterium: 0 }, time: 27, production: { energy: -7 }, bonuses: { foodProduction: 30 } },
  { id: "aquaRare", name: "Advanced Aquaculture Farm", description: "Rare high-yield marine cultivation", type: "resource", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 220, crystal: 110, deuterium: 35 }, time: 23, production: { energy: -11 }, bonuses: { foodProduction: 75 } },
  { id: "aquaEpic", name: "Precision Aquatic Complex", description: "Epic controlled-environment aquaculture", type: "resource", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 700, crystal: 380, deuterium: 130 }, time: 19, production: { energy: -16 }, bonuses: { foodProduction: 190 } },
  { id: "aquaLeg", name: "Legendary Aqua-Dome", description: "Legendary underwater farming habitat", type: "resource", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2200, crystal: 1400, deuterium: 520 }, time: 16, production: { energy: -23 }, bonuses: { foodProduction: 460 } },
  { id: "aquaMy", name: "Mythic Aqua-Nexus", description: "Ultimate planetary aquaculture system", type: "resource", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 6500, crystal: 4500, deuterium: 2000 }, time: 11, production: { energy: -32 }, bonuses: { foodProduction: 1200 } },

  // Vertical Farms (space-efficient urban agriculture)
  { id: "vertFarmCom", name: "Basic Vertical Farm", description: "Space-efficient stacked growing units", type: "resource", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 150, crystal: 80, deuterium: 10 }, time: 26, production: { energy: -10 }, bonuses: { foodProduction: 60 }, requirements: { building: "resCom" } },
  { id: "vertFarmRare", name: "Advanced Vertical Farm", description: "Rare AI-controlled urban farming", type: "resource", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 400, crystal: 220, deuterium: 50 }, time: 22, production: { energy: -15 }, bonuses: { foodProduction: 155 }, requirements: { building: "resRare" } },
  { id: "vertFarmEpic", name: "Precision Vertical Tower", description: "Epic fully automated food production tower", type: "resource", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 1200, crystal: 700, deuterium: 180 }, time: 18, production: { energy: -22 }, bonuses: { foodProduction: 390 }, requirements: { building: "resEpic" } },
  { id: "vertFarmLeg", name: "Legendary Arcology Farm", description: "Legendary integrated living-farming tower", type: "resource", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 4000, crystal: 2500, deuterium: 700 }, time: 13, production: { energy: -30 }, bonuses: { foodProduction: 950 }, requirements: { building: "resLeg" } },
  { id: "vertFarmMy", name: "Mythic Arcology Nexus", description: "Ultimate self-sustaining city-farm megastructure", type: "resource", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 12000, crystal: 8000, deuterium: 3000 }, time: 9, production: { energy: -40 }, bonuses: { foodProduction: 2500 }, requirements: { building: "resMy" } },
];

// WATER MANAGEMENT FACILITIES (4 types x 5 classes = 20 variants)
export const WATER_FACILITIES: Facility[] = [
  // Water Purifiers
  { id: "waterPurCom", name: "Basic Water Purifier", description: "Removes contaminants from raw water", type: "resource", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 100, crystal: 50, deuterium: 0 }, time: 25, production: { energy: -8 }, bonuses: { waterProduction: 45 } },
  { id: "waterPurRare", name: "Advanced Purification Plant", description: "Rare multi-stage water purification", type: "resource", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 280, crystal: 140, deuterium: 40 }, time: 22, production: { energy: -12 }, bonuses: { waterProduction: 115 } },
  { id: "waterPurEpic", name: "Precision Purification Complex", description: "Epic molecular-level water treatment", type: "resource", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 900, crystal: 500, deuterium: 160 }, time: 18, production: { energy: -18 }, bonuses: { waterProduction: 290 } },
  { id: "waterPurLeg", name: "Legendary Purification Hub", description: "Legendary quantum-filtration system", type: "resource", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 3000, crystal: 1800, deuterium: 600 }, time: 14, production: { energy: -26 }, bonuses: { waterProduction: 700 } },
  { id: "waterPurMy", name: "Mythic Purification Nexus", description: "Ultimate planetary water purification system", type: "resource", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 9000, crystal: 6000, deuterium: 2400 }, time: 10, production: { energy: -36 }, bonuses: { waterProduction: 1800 } },

  // Desalination Plants
  { id: "desalCom", name: "Basic Desalination Plant", description: "Converts saline water to fresh water", type: "resource", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 120, crystal: 40, deuterium: 0 }, time: 28, production: { energy: -10 }, bonuses: { waterProduction: 50 } },
  { id: "desalRare", name: "Advanced Desalination Array", description: "Rare high-efficiency salt extraction", type: "resource", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 320, crystal: 120, deuterium: 45 }, time: 24, production: { energy: -14 }, bonuses: { waterProduction: 130 } },
  { id: "desalEpic", name: "Precision Desalination Hub", description: "Epic reverse osmosis megaplant", type: "resource", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 1000, crystal: 450, deuterium: 180 }, time: 20, production: { energy: -20 }, bonuses: { waterProduction: 320 } },
  { id: "desalLeg", name: "Legendary Desalination Forge", description: "Legendary plasma-assisted desalination", type: "resource", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 3500, crystal: 1600, deuterium: 650 }, time: 16, production: { energy: -28 }, bonuses: { waterProduction: 780 } },
  { id: "desalMy", name: "Mythic Desalination Nexus", description: "Ultimate planetary ocean-to-fresh water system", type: "resource", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 10000, crystal: 5500, deuterium: 2600 }, time: 11, production: { energy: -40 }, bonuses: { waterProduction: 2000 } },

  // Atmospheric Water Collectors
  { id: "atmWaterCom", name: "Basic Atmospheric Collector", description: "Extracts water vapor from atmosphere", type: "resource", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 80, crystal: 60, deuterium: 0 }, time: 22, production: { energy: -6 }, bonuses: { waterProduction: 30 } },
  { id: "atmWaterRare", name: "Advanced Atmospheric Collector", description: "Rare expanded-surface collection mesh", type: "resource", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 220, crystal: 160, deuterium: 30 }, time: 19, production: { energy: -9 }, bonuses: { waterProduction: 75 } },
  { id: "atmWaterEpic", name: "Precision Atmospheric Array", description: "Epic ionization-assisted water extraction", type: "resource", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 700, crystal: 550, deuterium: 120 }, time: 16, production: { energy: -14 }, bonuses: { waterProduction: 190 } },
  { id: "atmWaterLeg", name: "Legendary Atmospheric Hub", description: "Legendary orbital-enhanced vapor collection", type: "resource", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2500, crystal: 2000, deuterium: 480 }, time: 13, production: { energy: -20 }, bonuses: { waterProduction: 460 } },
  { id: "atmWaterMy", name: "Mythic Atmospheric Nexus", description: "Ultimate planetary-scale water harvesting grid", type: "resource", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 7500, crystal: 6500, deuterium: 1900 }, time: 9, production: { energy: -28 }, bonuses: { waterProduction: 1200 } },

  // Water Recyclers
  { id: "waterRecCom", name: "Basic Water Recycler", description: "Reclaims and recycles grey water", type: "resource", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 90, crystal: 45, deuterium: 0 }, time: 20, production: { energy: -5 }, bonuses: { waterProduction: 20, waterEfficiency: 0.03 } },
  { id: "waterRecRare", name: "Advanced Water Recycling Plant", description: "Rare closed-loop water recovery system", type: "resource", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 240, crystal: 130, deuterium: 35 }, time: 18, production: { energy: -8 }, bonuses: { waterProduction: 50, waterEfficiency: 0.06 } },
  { id: "waterRecEpic", name: "Precision Recycling Complex", description: "Epic nano-filtration water recovery", type: "resource", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 750, crystal: 420, deuterium: 130 }, time: 15, production: { energy: -12 }, bonuses: { waterProduction: 130, waterEfficiency: 0.10 } },
  { id: "waterRecLeg", name: "Legendary Recycling Hub", description: "Legendary zero-waste water system", type: "resource", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2600, crystal: 1500, deuterium: 500 }, time: 12, production: { energy: -17 }, bonuses: { waterProduction: 320, waterEfficiency: 0.15 } },
  { id: "waterRecMy", name: "Mythic Recycling Nexus", description: "Ultimate molecular-reconstruction water system", type: "resource", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 8000, crystal: 5000, deuterium: 2000 }, time: 9, production: { energy: -24 }, bonuses: { waterProduction: 850, waterEfficiency: 0.22 } },
];

// FOOD & WATER STORAGE FACILITIES (2 types x 5 classes = 10 variants)
export const FOOD_WATER_STORAGE_FACILITIES: Facility[] = [
  // Cold Storage (food)
  { id: "coldStorCom", name: "Basic Cold Storage", description: "Chilled food preservation vault", type: "storage", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 200, crystal: 80, deuterium: 0 }, time: 20, production: { energy: -12 }, storage: 5000, bonuses: { foodStorage: 5000, spoilageReduction: 0.25 } },
  { id: "coldStorRare", name: "Advanced Cold Vault", description: "Rare cryogenic food storage", type: "storage", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 600, crystal: 280, deuterium: 80 }, time: 17, production: { energy: -20 }, storage: 25000, bonuses: { foodStorage: 25000, spoilageReduction: 0.50 } },
  { id: "coldStorEpic", name: "Precision Cryo-Depot", description: "Epic vacuum-sealed food preservation complex", type: "storage", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 2000, crystal: 1000, deuterium: 350 }, time: 14, production: { energy: -30 }, storage: 100000, bonuses: { foodStorage: 100000, spoilageReduction: 0.70 } },
  { id: "coldStorLeg", name: "Legendary Cryo-Fortress", description: "Legendary indefinite food preservation system", type: "storage", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 7000, crystal: 4000, deuterium: 1500 }, time: 11, production: { energy: -45 }, storage: 500000, bonuses: { foodStorage: 500000, spoilageReduction: 0.85 } },
  { id: "coldStorMy", name: "Mythic Cryo-Nexus", description: "Ultimate quantum-locked food storage grid", type: "storage", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 21000, crystal: 14000, deuterium: 6000 }, time: 8, production: { energy: -60 }, storage: 2500000, bonuses: { foodStorage: 2500000, spoilageReduction: 0.95 } },

  // Water Reservoirs
  { id: "waterResCom", name: "Basic Water Reservoir", description: "Open water storage tank", type: "storage", class: "common", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 150, crystal: 50, deuterium: 0 }, time: 18, production: { energy: -4 }, storage: 6000, bonuses: { waterStorage: 6000, leakageReduction: 0.20 } },
  { id: "waterResRare", name: "Advanced Water Reservoir", description: "Rare sealed pressurized water storage", type: "storage", class: "rare", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 450, crystal: 200, deuterium: 60 }, time: 15, production: { energy: -7 }, storage: 30000, bonuses: { waterStorage: 30000, leakageReduction: 0.40 } },
  { id: "waterResEpic", name: "Precision Water Depot", description: "Epic geologically-reinforced underground reservoir", type: "storage", class: "epic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 1500, crystal: 800, deuterium: 280 }, time: 12, production: { energy: -11 }, storage: 120000, bonuses: { waterStorage: 120000, leakageReduction: 0.60 } },
  { id: "waterResLeg", name: "Legendary Aquifer Hub", description: "Legendary deep-planetary aquifer network", type: "storage", class: "legendary", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 5500, crystal: 3000, deuterium: 1100 }, time: 10, production: { energy: -16 }, storage: 600000, bonuses: { waterStorage: 600000, leakageReduction: 0.75 } },
  { id: "waterResMy", name: "Mythic Aquifer Nexus", description: "Ultimate planet-core water containment system", type: "storage", class: "mythic", tier: 1, level: 1, progressionConfig: { tiers: { max: 99 }, levels: { max: 999 } }, cost: { metal: 16000, crystal: 10000, deuterium: 4500 }, time: 7, production: { energy: -22 }, storage: 3000000, bonuses: { waterStorage: 3000000, leakageReduction: 0.90 } },
];

// Combine all facilities
export const ALL_FACILITIES: Facility[] = [
  ...RESOURCE_FACILITIES,
  ...ENERGY_FACILITIES,
  ...STORAGE_FACILITIES,
  ...MILITARY_FACILITIES,
  ...RESEARCH_FACILITIES,
  ...CIVILIAN_FACILITIES,
  ...SPECIAL_FACILITIES,
  ...FARMING_FACILITIES,
  ...WATER_FACILITIES,
  ...FOOD_WATER_STORAGE_FACILITIES,
];

// Helper function to get facilities by type and class
export function getFacilitiesByTypeAndClass(type: string, facilityClass: string): Facility[] {
  return ALL_FACILITIES.filter(f => f.type === type && f.class === facilityClass);
}

// Helper function to get all facilities of a type
export function getFacilitiesByType(type: string): Facility[] {
  return ALL_FACILITIES.filter(f => f.type === type);
}

// Helper function to get farming facilities
export function getFarmingFacilities(): Facility[] {
  return FARMING_FACILITIES;
}

// Helper function to get water management facilities
export function getWaterFacilities(): Facility[] {
  return WATER_FACILITIES;
}

// Export facility statistics
export const FACILITY_STATS = {
  totalFacilities: ALL_FACILITIES.length,
  types: {
    resource: RESOURCE_FACILITIES.length,
    energy: ENERGY_FACILITIES.length,
    storage: STORAGE_FACILITIES.length,
    military: MILITARY_FACILITIES.length,
    research: RESEARCH_FACILITIES.length,
    civilian: CIVILIAN_FACILITIES.length,
    special: SPECIAL_FACILITIES.length,
    orbital: 4, // Included in special
    farming: FARMING_FACILITIES.length,
    water: WATER_FACILITIES.length,
    foodWaterStorage: FOOD_WATER_STORAGE_FACILITIES.length,
  },
};
