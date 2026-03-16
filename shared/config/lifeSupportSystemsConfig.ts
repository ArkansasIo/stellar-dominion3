export type PopulationClass = 'workers' | 'scientists' | 'engineers' | 'military' | 'administrators' | 'civilians';
export type ResourcePressureState = 'surplus' | 'stable' | 'strained' | 'critical';
export type PlanetType = 'terrestrial' | 'ocean' | 'desert' | 'ice' | 'volcanic' | 'toxic' | 'gas-giant' | 'ice-giant' | 'lava' | 'exotic';

export interface FrameSystemTier {
  tier: number;
  name: string;
  populationCapacityBonus: number;
  foodEfficiencyBonus: number;
  waterEfficiencyBonus: number;
  stabilityBonus: number;
}

export const FRAME_SYSTEMS = {
  categories: {
    habitat: {
      name: 'Habitat Frames',
      description: 'Population housing and life-support frames',
      subCategories: ['residential-frame', 'arcology-frame', 'orbital-habitat-frame'],
    },
    industrial: {
      name: 'Industrial Frames',
      description: 'Manufacturing and utility structural frames',
      subCategories: ['factory-frame', 'refinery-frame', 'power-frame'],
    },
    defense: {
      name: 'Defense Frames',
      description: 'Fortification and military support frames',
      subCategories: ['bastion-frame', 'shield-frame', 'command-frame'],
    },
  },
  tiers: [
    { tier: 1, name: 'Baseline Frame', populationCapacityBonus: 0, foodEfficiencyBonus: 0, waterEfficiencyBonus: 0, stabilityBonus: 0 },
    { tier: 2, name: 'Reinforced Frame', populationCapacityBonus: 0.08, foodEfficiencyBonus: 0.03, waterEfficiencyBonus: 0.03, stabilityBonus: 0.02 },
    { tier: 3, name: 'Adaptive Frame', populationCapacityBonus: 0.18, foodEfficiencyBonus: 0.07, waterEfficiencyBonus: 0.07, stabilityBonus: 0.05 },
    { tier: 4, name: 'Smart Frame', populationCapacityBonus: 0.32, foodEfficiencyBonus: 0.12, waterEfficiencyBonus: 0.12, stabilityBonus: 0.09 },
    { tier: 5, name: 'Quantum Frame', populationCapacityBonus: 0.5, foodEfficiencyBonus: 0.18, waterEfficiencyBonus: 0.18, stabilityBonus: 0.14 },
  ] as FrameSystemTier[],
} as const;

export const POPULATION_SYSTEM = {
  base: {
    growthRatePerHour: 0.004,
    baseCapacity: 10000,
    overcrowdingPenaltyStart: 0.9,
    unrestThreshold: 0.45,
    idealStability: 0.7,
  },
  classes: {
    workers: { name: 'Workers', productivityWeight: 1.0, foodNeed: 1.0, waterNeed: 1.0, housingNeed: 1.0 },
    scientists: { name: 'Scientists', productivityWeight: 1.35, foodNeed: 1.1, waterNeed: 1.1, housingNeed: 1.2 },
    engineers: { name: 'Engineers', productivityWeight: 1.25, foodNeed: 1.1, waterNeed: 1.05, housingNeed: 1.15 },
    military: { name: 'Military', productivityWeight: 1.15, foodNeed: 1.2, waterNeed: 1.15, housingNeed: 1.1 },
    administrators: { name: 'Administrators', productivityWeight: 1.2, foodNeed: 1.05, waterNeed: 1.05, housingNeed: 1.2 },
    civilians: { name: 'Civilians', productivityWeight: 0.8, foodNeed: 0.95, waterNeed: 0.95, housingNeed: 0.9 },
  },
  happinessModifiers: {
    housingAdequacy: 0.3,
    foodSecurity: 0.25,
    waterSecurity: 0.25,
    safety: 0.2,
  },
} as const;

export const FOOD_SYSTEM = {
  production: {
    basePerWorkerPerHour: 1.8,
    hydroponicsMultiplier: 1.25,
    agriDroneMultiplier: 1.15,
    planetFertilityBonusCap: 0.5,
  },
  consumption: {
    basePerPopulationPerHour: 1,
    militaryMultiplier: 1.2,
    rationingModes: {
      generous: { modifier: 1.1, happinessDelta: 0.05 },
      normal: { modifier: 1.0, happinessDelta: 0 },
      strict: { modifier: 0.85, happinessDelta: -0.05 },
      emergency: { modifier: 0.7, happinessDelta: -0.12 },
    },
  },
  storage: {
    baseCapacity: 5000,
    spoilagePerHour: 0.002,
    coldStorageReduction: 0.75,
  },
} as const;

export const WATER_SYSTEM = {
  production: {
    basePerWorkerPerHour: 2.2,
    recyclerMultiplier: 1.3,
    purificationMultiplier: 1.2,
    atmosphericCollectorBonusCap: 0.45,
  },
  consumption: {
    basePerPopulationPerHour: 1,
    industrialUsagePerWorkerPerHour: 0.15,
    emergencyConservationFactor: 0.75,
  },
  storage: {
    baseCapacity: 6000,
    leakagePerHour: 0.001,
    reservoirReduction: 0.8,
  },
} as const;

export function computeResourcePressure(productionPerHour: number, consumptionPerHour: number): ResourcePressureState {
  if (productionPerHour >= consumptionPerHour * 1.15) return 'surplus';
  if (productionPerHour >= consumptionPerHour * 0.98) return 'stable';
  if (productionPerHour >= consumptionPerHour * 0.85) return 'strained';
  return 'critical';
}

// Population class distribution weights. The first 5 classes sum to 0.92;
// civilians receive the remainder (0.08) to ensure the total is always 1.0.
const POP_CLASS_RATIOS = {
  workers: 0.42,
  scientists: 0.12,
  engineers: 0.14,
  military: 0.16,
  administrators: 0.08,
} as const;

export function estimatePopulationGrowth(
  currentPopulation: number,
  capacity: number,
  happiness: number,
  frameTier = 1,
): number {
  if (currentPopulation <= 0 || capacity <= 0) return 0;

  const tierConfig = FRAME_SYSTEMS.tiers.find(tier => tier.tier === frameTier) ?? FRAME_SYSTEMS.tiers[0];
  const utilization = currentPopulation / capacity;
  const overcrowdingPenalty = utilization > POPULATION_SYSTEM.base.overcrowdingPenaltyStart
    ? Math.max(0, 1 - (utilization - POPULATION_SYSTEM.base.overcrowdingPenaltyStart) * 2)
    : 1;

  const happinessFactor = Math.max(0.4, 0.7 + happiness * 0.6);
  const frameFactor = 1 + tierConfig.populationCapacityBonus * 0.35;
  const growthRate = POPULATION_SYSTEM.base.growthRatePerHour * overcrowdingPenalty * happinessFactor * frameFactor;

  return Math.floor(currentPopulation * growthRate);
}

export function estimateFoodDemand(populationByClass: Partial<Record<PopulationClass, number>>): number {
  return Object.entries(populationByClass).reduce((sum, [populationClass, count]) => {
    if (!count || count <= 0) return sum;

    const classConfig = POPULATION_SYSTEM.classes[populationClass as PopulationClass];
    return sum + count * classConfig.foodNeed * FOOD_SYSTEM.consumption.basePerPopulationPerHour;
  }, 0);
}

export function estimateWaterDemand(populationByClass: Partial<Record<PopulationClass, number>>, workerCount: number): number {
  const domesticDemand = Object.entries(populationByClass).reduce((sum, [populationClass, count]) => {
    if (!count || count <= 0) return sum;

    const classConfig = POPULATION_SYSTEM.classes[populationClass as PopulationClass];
    return sum + count * classConfig.waterNeed * WATER_SYSTEM.consumption.basePerPopulationPerHour;
  }, 0);

  const industrialDemand = Math.max(0, workerCount) * WATER_SYSTEM.consumption.industrialUsagePerWorkerPerHour;
  return domesticDemand + industrialDemand;
}

// ============================================================================
// FARMING SYSTEM CONFIG
// ============================================================================

export interface FarmingTier {
  tier: number;
  name: string;
  foodProductionMultiplier: number;
  waterConsumptionPerFoodUnit: number;
  workerEfficiencyBonus: number;
  buildingRequirements: string[];
}

export const FARMING_SYSTEM = {
  tiers: [
    { tier: 1, name: 'Subsistence Farming', foodProductionMultiplier: 1.0, waterConsumptionPerFoodUnit: 1.5, workerEfficiencyBonus: 0, buildingRequirements: [] },
    { tier: 2, name: 'Commercial Farming', foodProductionMultiplier: 1.6, waterConsumptionPerFoodUnit: 1.2, workerEfficiencyBonus: 0.05, buildingRequirements: ['farmCom'] },
    { tier: 3, name: 'Industrial Farming', foodProductionMultiplier: 2.5, waterConsumptionPerFoodUnit: 1.0, workerEfficiencyBonus: 0.12, buildingRequirements: ['farmRare', 'hydropCom'] },
    { tier: 4, name: 'Precision Agriculture', foodProductionMultiplier: 4.0, waterConsumptionPerFoodUnit: 0.75, workerEfficiencyBonus: 0.22, buildingRequirements: ['farmEpic', 'hydropRare'] },
    { tier: 5, name: 'Quantum Agri-Network', foodProductionMultiplier: 7.0, waterConsumptionPerFoodUnit: 0.5, workerEfficiencyBonus: 0.40, buildingRequirements: ['farmMy', 'hydropMy'] },
  ] as FarmingTier[],
  research: {
    baselineFoodBonus: 0,
    perLevelBonus: 0.03,
    perTierBonus: 0.15,
    hydroponicsBonusMultiplier: 1.25,
    agriDroneBonusMultiplier: 1.15,
  },
} as const;

// ============================================================================
// PLANET-SPECIFIC FOOD / WATER / POPULATION MODIFIERS
// ============================================================================

export interface PlanetLifeSupportModifiers {
  foodProductionMultiplier: number;
  waterProductionMultiplier: number;
  populationCapacityMultiplier: number;
  foodConsumptionMultiplier: number;
  waterConsumptionMultiplier: number;
  baseHabitabilityScore: number;
}

export const PLANET_LIFE_SUPPORT_MODIFIERS: Record<PlanetType, PlanetLifeSupportModifiers> = {
  terrestrial: {
    foodProductionMultiplier: 1.0,
    waterProductionMultiplier: 1.0,
    populationCapacityMultiplier: 1.0,
    foodConsumptionMultiplier: 1.0,
    waterConsumptionMultiplier: 1.0,
    baseHabitabilityScore: 80,
  },
  ocean: {
    foodProductionMultiplier: 1.4,
    waterProductionMultiplier: 2.5,
    populationCapacityMultiplier: 0.8,
    foodConsumptionMultiplier: 0.9,
    waterConsumptionMultiplier: 0.8,
    baseHabitabilityScore: 75,
  },
  desert: {
    foodProductionMultiplier: 0.5,
    waterProductionMultiplier: 0.3,
    populationCapacityMultiplier: 0.6,
    foodConsumptionMultiplier: 1.1,
    waterConsumptionMultiplier: 1.4,
    baseHabitabilityScore: 40,
  },
  ice: {
    foodProductionMultiplier: 0.4,
    waterProductionMultiplier: 1.8,
    populationCapacityMultiplier: 0.5,
    foodConsumptionMultiplier: 1.2,
    waterConsumptionMultiplier: 1.1,
    baseHabitabilityScore: 30,
  },
  volcanic: {
    foodProductionMultiplier: 0.2,
    waterProductionMultiplier: 0.1,
    populationCapacityMultiplier: 0.3,
    foodConsumptionMultiplier: 1.3,
    waterConsumptionMultiplier: 1.5,
    baseHabitabilityScore: 20,
  },
  toxic: {
    foodProductionMultiplier: 0.1,
    waterProductionMultiplier: 0.2,
    populationCapacityMultiplier: 0.2,
    foodConsumptionMultiplier: 1.5,
    waterConsumptionMultiplier: 1.6,
    baseHabitabilityScore: 10,
  },
  'gas-giant': {
    foodProductionMultiplier: 0,
    waterProductionMultiplier: 0,
    populationCapacityMultiplier: 0,
    foodConsumptionMultiplier: 2.0,
    waterConsumptionMultiplier: 2.0,
    baseHabitabilityScore: 0,
  },
  'ice-giant': {
    foodProductionMultiplier: 0,
    waterProductionMultiplier: 0,
    populationCapacityMultiplier: 0,
    foodConsumptionMultiplier: 2.0,
    waterConsumptionMultiplier: 2.0,
    baseHabitabilityScore: 0,
  },
  lava: {
    foodProductionMultiplier: 0.05,
    waterProductionMultiplier: 0.05,
    populationCapacityMultiplier: 0.15,
    foodConsumptionMultiplier: 1.6,
    waterConsumptionMultiplier: 1.8,
    baseHabitabilityScore: 5,
  },
  exotic: {
    foodProductionMultiplier: 1.2,
    waterProductionMultiplier: 1.5,
    populationCapacityMultiplier: 1.3,
    foodConsumptionMultiplier: 0.8,
    waterConsumptionMultiplier: 0.7,
    baseHabitabilityScore: 50,
  },
};

// ============================================================================
// PER-PLANET POPULATION SNAPSHOT
// ============================================================================

export interface PlanetPopulationSnapshot {
  planetType: PlanetType;
  population: {
    current: number;
    capacity: number;
    utilization: number;
    happiness: number;
    estimatedGrowthPerHour: number;
    classes: Record<PopulationClass, number>;
  };
  food: {
    stock: number;
    productionPerHour: number;
    demandPerHour: number;
    netPerHour: number;
    pressure: ResourcePressureState;
    hoursToDepletion: number | null;
    farmingTier: number;
  };
  water: {
    stock: number;
    productionPerHour: number;
    demandPerHour: number;
    netPerHour: number;
    pressure: ResourcePressureState;
    hoursToDepletion: number | null;
  };
  frameTier: number;
  modifiers: PlanetLifeSupportModifiers;
}

/**
 * Compute a full population/food/water snapshot for a specific planet.
 */
export function computePlanetPopulationSnapshot(params: {
  planetType: PlanetType;
  currentPopulation: number;
  basePopulationCapacity: number;
  foodStock: number;
  waterStock: number;
  buildings: Record<string, number>;
  frameTier?: number;
  farmingTier?: number;
  researchBonuses?: { foodProduction?: number; waterProduction?: number };
}): PlanetPopulationSnapshot {
  const {
    planetType,
    currentPopulation,
    basePopulationCapacity,
    foodStock,
    waterStock,
    buildings,
    frameTier = 1,
    farmingTier = 1,
    researchBonuses = {},
  } = params;

  const modifiers = PLANET_LIFE_SUPPORT_MODIFIERS[planetType];
  const frameTierConfig = FRAME_SYSTEMS.tiers.find(t => t.tier === frameTier) ?? FRAME_SYSTEMS.tiers[0];
  const farmingTierConfig = FARMING_SYSTEM.tiers.find(t => t.tier === farmingTier) ?? FARMING_SYSTEM.tiers[0];

  // Population capacity adjusted for planet type.
  // Gas-giants and ice-giants have populationCapacityMultiplier=0 (uninhabitable surfaces),
  // resulting in 0 capacity which is handled gracefully throughout.
  const populationCapacity = Math.floor(
    basePopulationCapacity *
    modifiers.populationCapacityMultiplier *
    (1 + frameTierConfig.populationCapacityBonus)
  );

  const pop = Math.min(currentPopulation, populationCapacity);

  // Population distribution using shared class ratios
  const populationByClass: Record<PopulationClass, number> = {
    workers: Math.floor(pop * POP_CLASS_RATIOS.workers),
    scientists: Math.floor(pop * POP_CLASS_RATIOS.scientists),
    engineers: Math.floor(pop * POP_CLASS_RATIOS.engineers),
    military: Math.floor(pop * POP_CLASS_RATIOS.military),
    administrators: Math.floor(pop * POP_CLASS_RATIOS.administrators),
    civilians: Math.max(0, pop - (
      Math.floor(pop * POP_CLASS_RATIOS.workers) + Math.floor(pop * POP_CLASS_RATIOS.scientists) +
      Math.floor(pop * POP_CLASS_RATIOS.engineers) + Math.floor(pop * POP_CLASS_RATIOS.military) +
      Math.floor(pop * POP_CLASS_RATIOS.administrators)
    )),
  };
  const workerCount = populationByClass.workers;

  // Food demand (adjusted for planet consumption multiplier)
  const rawFoodDemand = estimateFoodDemand(populationByClass);
  const foodDemandPerHour = rawFoodDemand * modifiers.foodConsumptionMultiplier;

  // Food production (adjusted for planet type + frame + farming tier + research)
  const researchFoodBonus = researchBonuses.foodProduction ?? 0;
  const foodProductionPerHour =
    workerCount *
    FOOD_SYSTEM.production.basePerWorkerPerHour *
    modifiers.foodProductionMultiplier *
    farmingTierConfig.foodProductionMultiplier *
    (1 + frameTierConfig.foodEfficiencyBonus + researchFoodBonus);

  // Water demand (adjusted for planet consumption multiplier)
  const rawWaterDemand = estimateWaterDemand(populationByClass, workerCount);
  const waterDemandPerHour = rawWaterDemand * modifiers.waterConsumptionMultiplier;

  // Water production (adjusted for planet type + frame + research)
  const researchWaterBonus = researchBonuses.waterProduction ?? 0;
  const waterProductionPerHour =
    workerCount *
    WATER_SYSTEM.production.basePerWorkerPerHour *
    modifiers.waterProductionMultiplier *
    (1 + frameTierConfig.waterEfficiencyBonus + researchWaterBonus);

  const foodPressure = computeResourcePressure(foodProductionPerHour, foodDemandPerHour);
  const waterPressure = computeResourcePressure(waterProductionPerHour, waterDemandPerHour);

  const happinessBase = 0.68;
  const happinessPenalty =
    (foodPressure === 'critical' ? 0.18 : foodPressure === 'strained' ? 0.08 : 0) +
    (waterPressure === 'critical' ? 0.18 : waterPressure === 'strained' ? 0.08 : 0);
  const happiness = Math.max(0.2, Math.min(0.98,
    happinessBase + frameTierConfig.stabilityBonus + (modifiers.baseHabitabilityScore / 1000) - happinessPenalty
  ));

  const estimatedGrowthPerHour = estimatePopulationGrowth(pop, populationCapacity, happiness, frameTier);

  const foodNetPerHour = foodProductionPerHour - foodDemandPerHour;
  const waterNetPerHour = waterProductionPerHour - waterDemandPerHour;
  const foodHoursToDepletion = foodNetPerHour < 0 ? Math.floor(foodStock / Math.abs(foodNetPerHour || 1)) : null;
  const waterHoursToDepletion = waterNetPerHour < 0 ? Math.floor(waterStock / Math.abs(waterNetPerHour || 1)) : null;

  return {
    planetType,
    population: {
      current: pop,
      capacity: populationCapacity,
      utilization: Number((pop / Math.max(1, populationCapacity)).toFixed(3)),
      happiness: Number(happiness.toFixed(3)),
      estimatedGrowthPerHour,
      classes: populationByClass,
    },
    food: {
      stock: foodStock,
      productionPerHour: Number(foodProductionPerHour.toFixed(2)),
      demandPerHour: Number(foodDemandPerHour.toFixed(2)),
      netPerHour: Number(foodNetPerHour.toFixed(2)),
      pressure: foodPressure,
      hoursToDepletion: foodHoursToDepletion,
      farmingTier,
    },
    water: {
      stock: waterStock,
      productionPerHour: Number(waterProductionPerHour.toFixed(2)),
      demandPerHour: Number(waterDemandPerHour.toFixed(2)),
      netPerHour: Number(waterNetPerHour.toFixed(2)),
      pressure: waterPressure,
      hoursToDepletion: waterHoursToDepletion,
    },
    frameTier,
    modifiers,
  };
}
