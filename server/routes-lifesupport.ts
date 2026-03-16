import type { Express, Request, Response } from "express";
import { isAuthenticated } from "./basicAuth";
import { storage } from "./storage";
import {
  BUILDING_ARCHETYPES_90,
  FACTORY_JOB_ARCHETYPES_90,
  BUILDING_ARCHETYPES_GROUPED_BY_CATEGORY,
  FACTORY_JOB_ARCHETYPES_GROUPED_BY_JOB_CATEGORY,
  BUILDING_FACTORY_JOB_META,
  ENTITY_ARCHETYPES_90,
  ENTITY_ARCHETYPES_META,
  FRAME_SYSTEMS,
  POPULATION_SYSTEM,
  FOOD_SYSTEM,
  WATER_SYSTEM,
  FARMING_SYSTEM,
  PLANET_LIFE_SUPPORT_MODIFIERS,
  computeResourcePressure,
  estimatePopulationGrowth,
  estimateFoodDemand,
  estimateWaterDemand,
  computePlanetPopulationSnapshot,
  type PopulationClass,
  type LifeSupportPlanetType as PlanetType,
} from "../shared/config";

function toNumber(value: unknown, fallback = 0): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getUserId(req: Request): string {
  return (req.session as any)?.userId || "";
}

function getFrameTier(buildings: Record<string, number>): number {
  const robotics = toNumber(buildings.roboticsFactory, 0);
  const shipyard = toNumber(buildings.shipyard, 0);
  const researchLab = toNumber(buildings.researchLab, 0);
  const inferred = 1 + Math.floor((robotics + shipyard + researchLab) / 12);
  return clamp(inferred, 1, FRAME_SYSTEMS.tiers.length);
}

function buildPopulationDistribution(totalPopulation: number): Record<PopulationClass, number> {
  return {
    workers: Math.floor(totalPopulation * 0.42),
    scientists: Math.floor(totalPopulation * 0.12),
    engineers: Math.floor(totalPopulation * 0.14),
    military: Math.floor(totalPopulation * 0.16),
    administrators: Math.floor(totalPopulation * 0.08),
    civilians: Math.max(0, totalPopulation - (
      Math.floor(totalPopulation * 0.42) +
      Math.floor(totalPopulation * 0.12) +
      Math.floor(totalPopulation * 0.14) +
      Math.floor(totalPopulation * 0.16) +
      Math.floor(totalPopulation * 0.08)
    )),
  };
}

export function registerLifeSupportRoutes(app: Express) {
  app.get("/api/config/building-archetypes", (_req: Request, res: Response) => {
    res.json({
      success: true,
      total: BUILDING_ARCHETYPES_90.length,
      items: BUILDING_ARCHETYPES_90,
    });
  });

  app.get("/api/config/building-archetypes/meta", (_req: Request, res: Response) => {
    res.json({
      success: true,
      meta: BUILDING_FACTORY_JOB_META.buildings,
      groupedByCategory: BUILDING_ARCHETYPES_GROUPED_BY_CATEGORY,
    });
  });

  app.get("/api/config/factory-job-archetypes", (_req: Request, res: Response) => {
    res.json({
      success: true,
      total: FACTORY_JOB_ARCHETYPES_90.length,
      items: FACTORY_JOB_ARCHETYPES_90,
    });
  });

  app.get("/api/config/factory-job-archetypes/meta", (_req: Request, res: Response) => {
    res.json({
      success: true,
      meta: BUILDING_FACTORY_JOB_META.factoryJobs,
      groupedByJobCategory: FACTORY_JOB_ARCHETYPES_GROUPED_BY_JOB_CATEGORY,
    });
  });

  app.get("/api/config/entity-archetypes/meta", (_req: Request, res: Response) => {
    res.json({
      success: true,
      total: ENTITY_ARCHETYPES_90.length,
      meta: ENTITY_ARCHETYPES_META,
    });
  });

  app.get("/api/config/frame-systems", (_req: Request, res: Response) => {
    res.json({ success: true, frameSystems: FRAME_SYSTEMS });
  });

  app.get("/api/config/population-system", (_req: Request, res: Response) => {
    res.json({ success: true, populationSystem: POPULATION_SYSTEM });
  });

  app.get("/api/config/food-system", (_req: Request, res: Response) => {
    res.json({ success: true, foodSystem: FOOD_SYSTEM });
  });

  app.get("/api/config/water-system", (_req: Request, res: Response) => {
    res.json({ success: true, waterSystem: WATER_SYSTEM });
  });

  app.get("/api/config/farming-system", (_req: Request, res: Response) => {
    res.json({ success: true, farmingSystem: FARMING_SYSTEM });
  });

  app.get("/api/config/planet-life-support-modifiers", (_req: Request, res: Response) => {
    res.json({ success: true, modifiers: PLANET_LIFE_SUPPORT_MODIFIERS });
  });

  app.get("/api/config/life-support-systems", (_req: Request, res: Response) => {
    res.json({
      success: true,
      systems: {
        frame: FRAME_SYSTEMS,
        population: POPULATION_SYSTEM,
        food: FOOD_SYSTEM,
        water: WATER_SYSTEM,
        farming: FARMING_SYSTEM,
        planetModifiers: PLANET_LIFE_SUPPORT_MODIFIERS,
      },
    });
  });

  app.get("/api/population/snapshot", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const state = await storage.getPlayerState(userId);
      const resources = ((state?.resources || {}) as Record<string, number>);
      const buildings = ((state?.buildings || {}) as Record<string, number>);

      const frameTier = getFrameTier(buildings);
      const frameTierConfig = FRAME_SYSTEMS.tiers.find((tier) => tier.tier === frameTier) ?? FRAME_SYSTEMS.tiers[0];

      const baseCapacity = POPULATION_SYSTEM.base.baseCapacity;
      const housingCapacityFromBuildings =
        toNumber(buildings.roboticsFactory, 0) * 250 +
        toNumber(buildings.shipyard, 0) * 180 +
        toNumber(buildings.researchLab, 0) * 120;

      const populationCapacity = Math.floor((baseCapacity + housingCapacityFromBuildings) * (1 + frameTierConfig.populationCapacityBonus));

      const explicitPopulation = toNumber((state as any)?.population, -1);
      const currentPopulation = explicitPopulation > 0
        ? explicitPopulation
        : Math.floor(populationCapacity * 0.58);

      const populationByClass = buildPopulationDistribution(currentPopulation);

      const foodStock = toNumber(resources.food, 0);
      const waterStock = toNumber(resources.water, 0);

      const workerCount = populationByClass.workers;

      const foodDemandPerHour = estimateFoodDemand(populationByClass);
      const waterDemandPerHour = estimateWaterDemand(populationByClass, workerCount);

      const foodProductionPerHour =
        workerCount * FOOD_SYSTEM.production.basePerWorkerPerHour *
        (1 + frameTierConfig.foodEfficiencyBonus + toNumber(buildings.researchLab, 0) * 0.01);

      const waterProductionPerHour =
        workerCount * WATER_SYSTEM.production.basePerWorkerPerHour *
        (1 + frameTierConfig.waterEfficiencyBonus + toNumber(buildings.deuteriumSynthesizer, 0) * 0.01);

      const foodPressure = computeResourcePressure(foodProductionPerHour, foodDemandPerHour);
      const waterPressure = computeResourcePressure(waterProductionPerHour, waterDemandPerHour);

      const happinessBase = 0.68;
      const happinessPenalty =
        (foodPressure === "critical" ? 0.18 : foodPressure === "strained" ? 0.08 : 0) +
        (waterPressure === "critical" ? 0.18 : waterPressure === "strained" ? 0.08 : 0);

      const happiness = clamp(happinessBase + frameTierConfig.stabilityBonus - happinessPenalty, 0.2, 0.98);

      const estimatedGrowthPerHour = estimatePopulationGrowth(
        currentPopulation,
        populationCapacity,
        happiness,
        frameTier,
      );

      const foodNetPerHour = foodProductionPerHour - foodDemandPerHour;
      const waterNetPerHour = waterProductionPerHour - waterDemandPerHour;

      const foodHoursToDepletion = foodNetPerHour < 0 ? Math.floor(foodStock / Math.abs(foodNetPerHour || 1)) : null;
      const waterHoursToDepletion = waterNetPerHour < 0 ? Math.floor(waterStock / Math.abs(waterNetPerHour || 1)) : null;

      res.json({
        success: true,
        snapshot: {
          frameTier,
          frame: frameTierConfig,
          population: {
            current: currentPopulation,
            capacity: populationCapacity,
            utilization: Number((currentPopulation / Math.max(1, populationCapacity)).toFixed(3)),
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
          },
          water: {
            stock: waterStock,
            productionPerHour: Number(waterProductionPerHour.toFixed(2)),
            demandPerHour: Number(waterDemandPerHour.toFixed(2)),
            netPerHour: Number(waterNetPerHour.toFixed(2)),
            pressure: waterPressure,
            hoursToDepletion: waterHoursToDepletion,
          },
        },
      });
    } catch (error) {
      console.error("[population/snapshot]", error);
      res.status(500).json({ success: false, message: "Failed to build population snapshot" });
    }
  });

  // Per-planet population/food/water snapshot
  app.get("/api/planets/:planetType/population-snapshot", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const state = await storage.getPlayerState(userId);
      const resources = ((state?.resources || {}) as Record<string, number>);
      const buildings = ((state?.buildings || {}) as Record<string, number>);

      const rawPlanetType = req.params.planetType as string;
      const validPlanetTypes: PlanetType[] = [
        'terrestrial', 'ocean', 'desert', 'ice', 'volcanic', 'toxic',
        'gas-giant', 'ice-giant', 'lava', 'exotic',
      ];
      const planetType: PlanetType = validPlanetTypes.includes(rawPlanetType as PlanetType)
        ? (rawPlanetType as PlanetType)
        : 'terrestrial';

      const frameTier = getFrameTier(buildings);
      // Farming tier is inferred from the combined level of all farming facility types.
      // Every 4 total farming building levels advances one farming tier (capped at 5).
      // Supported buildings: farms, hydroponics, ranches, aquaculture centers, vertical farms.
      const totalFarmingBuildings =
        toNumber(buildings.farmCom, 0) + toNumber(buildings.farmRare, 0) +
        toNumber(buildings.hydropCom, 0) + toNumber(buildings.hydropRare, 0) +
        toNumber(buildings.ranchCom, 0) + toNumber(buildings.ranchRare, 0) +
        toNumber(buildings.aquaCom, 0) + toNumber(buildings.aquaRare, 0) +
        toNumber(buildings.vertFarmCom, 0) + toNumber(buildings.vertFarmRare, 0);
      const farmingTier = clamp(
        1 + Math.floor(totalFarmingBuildings / 4),
        1,
        FARMING_SYSTEM.tiers.length
      );

      const baseCapacity = POPULATION_SYSTEM.base.baseCapacity;
      const housingCapacityFromBuildings =
        toNumber(buildings.roboticsFactory, 0) * 250 +
        toNumber(buildings.shipyard, 0) * 180 +
        toNumber(buildings.researchLab, 0) * 120 +
        toNumber(buildings.resCom, 0) * 50 +
        toNumber(buildings.resRare, 0) * 200;
      const basePopulationCapacity = baseCapacity + housingCapacityFromBuildings;

      const explicitPopulation = toNumber((state as any)?.population, -1);
      const currentPopulation = explicitPopulation > 0
        ? explicitPopulation
        : Math.floor(basePopulationCapacity * 0.58);

      const foodStock = toNumber(resources.food, 0);
      const waterStock = toNumber(resources.water, 0);

      const snapshot = computePlanetPopulationSnapshot({
        planetType,
        currentPopulation,
        basePopulationCapacity,
        foodStock,
        waterStock,
        buildings,
        frameTier,
        farmingTier,
      });

      res.json({ success: true, snapshot });
    } catch (error) {
      console.error("[planets/:planetType/population-snapshot]", error);
      res.status(500).json({ success: false, message: "Failed to build planet population snapshot" });
    }
  });

  // Get food/water/population modifiers for a specific planet type
  app.get("/api/planets/:planetType/life-support-config", (req: Request, res: Response) => {
    const rawPlanetType = req.params.planetType as string;
    const validPlanetTypes: PlanetType[] = [
      'terrestrial', 'ocean', 'desert', 'ice', 'volcanic', 'toxic',
      'gas-giant', 'ice-giant', 'lava', 'exotic',
    ];
    if (!validPlanetTypes.includes(rawPlanetType as PlanetType)) {
      return res.status(400).json({ success: false, message: `Unknown planet type: ${rawPlanetType}` });
    }
    const planetType = rawPlanetType as PlanetType;
    const modifiers = PLANET_LIFE_SUPPORT_MODIFIERS[planetType];
    return res.json({
      success: true,
      planetType,
      modifiers,
      farmingSystem: FARMING_SYSTEM,
    });
  });
}
