import { db } from "./db";
import { playerStates } from "../shared/schema";
import { eq } from "drizzle-orm";
import {
  SHIP_COMBAT_PROFILES,
  PLANET_DEFENSE_PLATFORMS,
  WEAPON_SYSTEMS,
  classifyBattleReport,
  getWeaponById,
  getPlanetDefensePlatform,
  hasMothership as checkHasMothership,
  type BattleReportMetadata,
} from "../shared/config/weaponsAndDefenseConfig";

// Combat configuration
export const COMBAT_CONFIG = {
  // Unit stats (attack, defense, health)
  UNIT_STATS: {
    lightFighter: { attack: 50, defense: 20, health: 100, speed: 12 },
    heavyFighter: { attack: 80, defense: 40, health: 150, speed: 10 },
    smallCargo: { attack: 10, defense: 15, health: 400, speed: 8 },
    largeCargo: { attack: 5, defense: 10, health: 800, speed: 5 },
    espionageProbe: { attack: 1, defense: 5, health: 50, speed: 20 },
    battleship: { attack: 200, defense: 100, health: 600, speed: 6 },
    cruiser: { attack: 120, defense: 60, health: 400, speed: 8 },
    destroyer: { attack: 90, defense: 50, health: 300, speed: 10 },
    dreadnought: { attack: 300, defense: 150, health: 1000, speed: 4 },
    colonist: { attack: 5, defense: 5, health: 50, speed: 3 },
  } as any,

  // Research bonuses
  RESEARCH_BONUSES: {
    weaponsTech: 0.05, // +5% attack per level
    shieldingTech: 0.05, // +5% defense per level
    armourTech: 0.03, // +3% health per level
    combustionDrive: 0.02, // +2% speed per level
  },

  // Battle configuration
  BATTLE_CONFIG: {
    MAX_ROUNDS: 100,
    CRITICAL_CHANCE_BASE: 0.05, // 5% base critical chance
    CRITICAL_MULTIPLIER: 1.5, // 50% extra damage on crit
    MINIMUM_DAMAGE: 1, // Never 0 damage
  }
};

export interface CombatUnit {
  type: string;
  count: number;
  actualHP?: number;
}

export interface CombatForce {
  units: { [key: string]: CombatUnit };
  research?: { [key: string]: number };
  bonusMultiplier?: number;
  /** Planet defense platforms active on the defender's planet (platform type keys) */
  planetDefenses?: string[];
  /** Whether a mothership is part of this force */
  hasMothership?: boolean;
  /** Whether the defender has an active moon base (used for report classification) */
  hasMoon?: boolean;
}

export interface BattleResult {
  winner: "attacker" | "defender" | "draw";
  attackerUnits: { [key: string]: number };
  defenderUnits: { [key: string]: number };
  attackerCasualties: number;
  defenderCasualties: number;
  rounds: number;
  battleLog: string[];
  /** Weapon & defense metadata for battle report */
  reportMeta: BattleReportMetadata;
}

/**
 * Calculate effective stats with research bonuses
 */
export function getUnitStats(
  unitType: string,
  research: { [key: string]: number } = {},
  bonusMultiplier: number = 1
) {
  const baseStats = COMBAT_CONFIG.UNIT_STATS[unitType];
  if (!baseStats) return null;

  let attack = baseStats.attack * bonusMultiplier;
  let defense = baseStats.defense * bonusMultiplier;
  let health = baseStats.health * bonusMultiplier;
  let speed = baseStats.speed * bonusMultiplier;

  // Apply research bonuses
  attack *= 1 + ((research.weaponsTech || 0) * COMBAT_CONFIG.RESEARCH_BONUSES.weaponsTech);
  defense *= 1 + ((research.shieldingTech || 0) * COMBAT_CONFIG.RESEARCH_BONUSES.shieldingTech);
  health *= 1 + ((research.armourTech || 0) * COMBAT_CONFIG.RESEARCH_BONUSES.armourTech);
  speed *= 1 + ((research.combustionDrive || 0) * COMBAT_CONFIG.RESEARCH_BONUSES.combustionDrive);

  return { attack, defense, health, speed };
}

/**
 * Calculate damage with accuracy and critical hit system
 */
export function calculateDamage(
  attackerStats: any,
  defenderStats: any,
  isCritical: boolean = false
): number {
  // Base damage = attacker attack - defender defense
  let baseDamage = Math.max(
    COMBAT_CONFIG.BATTLE_CONFIG.MINIMUM_DAMAGE,
    attackerStats.attack - defenderStats.defense * 0.5
  );

  // Add variance (±20%)
  const variance = 1 + (Math.random() - 0.5) * 0.4;
  let damage = baseDamage * variance;

  // Apply critical hit multiplier
  if (isCritical) {
    damage *= COMBAT_CONFIG.BATTLE_CONFIG.CRITICAL_MULTIPLIER;
  }

  return Math.ceil(damage);
}

/**
 * Simulate a single combat round
 */
export function simulateCombatRound(
  attackerForce: CombatForce,
  defenderForce: CombatForce,
  roundNumber: number
): { attackerLosses: number; defenderLosses: number; log: string } {
  let attackerDamage = 0;
  let defenderDamage = 0;
  const logEntries: string[] = [];

  // Attacker units attack
  for (const [unitType, unit] of Object.entries(attackerForce.units)) {
    if (unit.count <= 0) continue;

    const stats = getUnitStats(
      unitType,
      attackerForce.research,
      attackerForce.bonusMultiplier
    );
    if (!stats) continue;

    // Each unit attacks defender
    for (let i = 0; i < unit.count; i++) {
      const isCritical =
        Math.random() < COMBAT_CONFIG.BATTLE_CONFIG.CRITICAL_CHANCE_BASE;
      const targetUnit = Object.values(defenderForce.units).find(u => u.count > 0);
      if (!targetUnit) break;

      const targetStats = getUnitStats(
        targetUnit.type,
        defenderForce.research,
        defenderForce.bonusMultiplier
      );
      if (!targetStats) continue;

      const damage = calculateDamage(stats, targetStats, isCritical);
      attackerDamage += damage;

      if (isCritical) {
        logEntries.push(
          `Round ${roundNumber}: ${unitType} CRITICAL HIT for ${damage} damage!`
        );
      }
    }
  }

  // Defender units counter-attack
  for (const [unitType, unit] of Object.entries(defenderForce.units)) {
    if (unit.count <= 0) continue;

    const stats = getUnitStats(
      unitType,
      defenderForce.research,
      defenderForce.bonusMultiplier
    );
    if (!stats) continue;

    // Each unit attacks attacker
    for (let i = 0; i < unit.count; i++) {
      const isCritical =
        Math.random() < COMBAT_CONFIG.BATTLE_CONFIG.CRITICAL_CHANCE_BASE;
      const targetUnit = Object.values(attackerForce.units).find(u => u.count > 0);
      if (!targetUnit) break;

      const targetStats = getUnitStats(
        targetUnit.type,
        attackerForce.research,
        attackerForce.bonusMultiplier
      );
      if (!targetStats) continue;

      const damage = calculateDamage(stats, targetStats, isCritical);
      defenderDamage += damage;
    }
  }

  // Apply casualties
  let attackerLosses = 0;
  let defenderLosses = 0;

  defenderLosses = Math.ceil(attackerDamage / 100); // Simplistic casualty calculation
  attackerLosses = Math.ceil(defenderDamage / 100);

  const log = logEntries.join("\n") || `Round ${roundNumber}: Both sides exchange fire.`;

  return { attackerLosses, defenderLosses, log };
}

/**
 * Simulate full battle until one side is defeated
 */
export function simulateBattle(
  attackerForce: CombatForce,
  defenderForce: CombatForce
): BattleResult {
  const battleLog: string[] = [];
  let round = 0;

  // ---- Collect weapon weapon IDs from ship combat profiles ----
  const collectWeaponIds = (force: CombatForce): string[] => {
    const ids = new Set<string>();
    for (const unitType of Object.keys(force.units)) {
      const profile = SHIP_COMBAT_PROFILES.find((p) => p.shipType === unitType);
      if (profile) {
        profile.primaryWeapons.forEach((w) => ids.add(w));
        profile.secondaryWeapons.forEach((w) => ids.add(w));
      }
    }
    return Array.from(ids);
  };

  const attackerWeaponsUsed = collectWeaponIds(attackerForce);
  const defenderWeaponsUsed = collectWeaponIds(defenderForce);

  // ---- Collect planet defense weapon IDs ----
  const planetDefensesEngaged: string[] = defenderForce.planetDefenses ?? [];
  for (const platformType of planetDefensesEngaged) {
    const platform = PLANET_DEFENSE_PLATFORMS.find((p) => p.platformType === platformType);
    if (platform) {
      platform.weapons.forEach((w) => {
        if (!defenderWeaponsUsed.includes(w)) defenderWeaponsUsed.push(w);
      });
    }
  }

  // ---- Per-weapon damage accumulation ----
  const weaponDamageBreakdown: Record<string, number> = {};
  let shieldsStripped = 0;
  let armorDamageDealt = 0;

  const accumulateWeaponDamage = (weaponIds: string[], totalDamage: number) => {
    if (weaponIds.length === 0) return;
    const share = totalDamage / weaponIds.length;
    for (const wId of weaponIds) {
      weaponDamageBreakdown[wId] = (weaponDamageBreakdown[wId] ?? 0) + Math.ceil(share);
      const w = getWeaponById(wId);
      if (w) {
        // Shields absorb first (based on shieldPenetration inversely measuring what gets through)
        // shieldsStripped = damage absorbed by shields = share × (1 - shieldPenetration)
        // armorDamageDealt = damage that penetrates shields and hits armor = share × shieldPenetration × armorPenetration
        // These are mutually exclusive layers: shield absorbs what it can, rest hits armor
        const shieldAbsorbed = Math.ceil(share * (1 - w.shieldPenetration));
        const armorHit = Math.ceil(share * w.shieldPenetration * w.armorPenetration);
        shieldsStripped += shieldAbsorbed;
        armorDamageDealt += armorHit;
      }
    }
  };

  // ---- Add planet defense bonus to defender effective attack ----
  let planetDefenseBonus = 0;
  for (const platformType of planetDefensesEngaged) {
    const platform = PLANET_DEFENSE_PLATFORMS.find((p) => p.platformType === platformType);
    if (platform) {
      // Each active defense platform adds base weapon damage
      for (const wId of platform.weapons) {
        const w = getWeaponById(wId);
        if (w) planetDefenseBonus += w.baseDamage * w.rateOfFire;
      }
    }
  }

  // Detect mothership involvement using shared helper
  const mothershipEngaged =
    (attackerForce.hasMothership ?? false) ||
    (defenderForce.hasMothership ?? false) ||
    checkHasMothership(attackerForce.units) ||
    checkHasMothership(defenderForce.units);

  const planetaryShieldActive = planetDefensesEngaged.includes("shieldGenerator");

  // Deep copy to avoid mutating original
  const attacker = JSON.parse(JSON.stringify(attackerForce));
  const defender = JSON.parse(JSON.stringify(defenderForce));

  while (round < COMBAT_CONFIG.BATTLE_CONFIG.MAX_ROUNDS) {
    round++;

    // Check if either side is defeated
    const attackerUnitCount = Object.values(attacker.units).reduce(
      (sum: number, u: any) => sum + u.count,
      0
    );
    const defenderUnitCount = Object.values(defender.units).reduce(
      (sum: number, u: any) => sum + u.count,
      0
    );

    if (attackerUnitCount === 0) {
      battleLog.push("Battle ended: Attacker defeated!");
      const attackerTotal = Object.values(attackerForce.units).reduce(
        (sum: number, u: any) => sum + u.count,
        0
      );
      const defenderTotal = Object.values(defenderForce.units).reduce(
        (sum: number, u: any) => sum + u.count,
        0
      );
      const defCasualties = defenderTotal - defenderUnitCount;
      const classification = classifyBattleReport({
        winner: "defender",
        attackerTotalUnits: attackerTotal,
        defenderTotalUnits: defenderTotal,
        attackerCasualties: attackerTotal,
        defenderCasualties: defCasualties,
        missionType: "attack",
        defenderHasPlanet: planetDefensesEngaged.length > 0,
        defenderHasMoon: defenderForce.hasMoon ?? false,
        attackerHasMothership: mothershipEngaged,
        defenderHasMothership: mothershipEngaged,
        hasEspionageProbe: Boolean(attackerForce.units["espionageProbe"]?.count),
      });
      return {
        winner: "defender",
        attackerUnits: attacker.units,
        defenderUnits: defender.units,
        attackerCasualties: attackerTotal,
        defenderCasualties: defCasualties,
        rounds: round,
        battleLog,
        reportMeta: {
          ...classification,
          attackerWeaponsUsed,
          defenderWeaponsUsed,
          planetDefensesEngaged,
          mothershipEngaged,
          planetaryShieldActive,
          shieldBreached: planetaryShieldActive && defCasualties > 0,
          weaponDamageBreakdown,
          shieldsStripped,
          armorDamageDealt,
        },
      };
    }

    if (defenderUnitCount === 0) {
      battleLog.push("Battle ended: Defender defeated!");
      const attackerTotal = Object.values(attackerForce.units).reduce(
        (sum: number, u: any) => sum + u.count,
        0
      );
      const defenderTotal = Object.values(defenderForce.units).reduce(
        (sum: number, u: any) => sum + u.count,
        0
      );
      const atkCasualties = attackerTotal - attackerUnitCount;
      const classification = classifyBattleReport({
        winner: "attacker",
        attackerTotalUnits: attackerTotal,
        defenderTotalUnits: defenderTotal,
        attackerCasualties: atkCasualties,
        defenderCasualties: defenderTotal,
        missionType: "attack",
        defenderHasPlanet: planetDefensesEngaged.length > 0,
        defenderHasMoon: defenderForce.hasMoon ?? false,
        attackerHasMothership: mothershipEngaged,
        defenderHasMothership: mothershipEngaged,
        hasEspionageProbe: Boolean(attackerForce.units["espionageProbe"]?.count),
      });
      return {
        winner: "attacker",
        attackerUnits: attacker.units,
        defenderUnits: defender.units,
        attackerCasualties: atkCasualties,
        defenderCasualties: defenderTotal,
        rounds: round,
        battleLog,
        reportMeta: {
          ...classification,
          attackerWeaponsUsed,
          defenderWeaponsUsed,
          planetDefensesEngaged,
          mothershipEngaged,
          planetaryShieldActive,
          shieldBreached: planetaryShieldActive,
          weaponDamageBreakdown,
          shieldsStripped,
          armorDamageDealt,
        },
      };
    }

    // Simulate round
    const { attackerLosses, defenderLosses, log } = simulateCombatRound(
      attacker,
      defender,
      round
    );

    battleLog.push(log);

    // Accumulate weapon damage for this round
    const roundAttackerDmg = attackerLosses * 100;
    const roundDefenderDmg = defenderLosses * 100 + planetDefenseBonus;
    accumulateWeaponDamage(attackerWeaponsUsed, roundAttackerDmg);
    accumulateWeaponDamage(defenderWeaponsUsed, roundDefenderDmg);

    // Apply casualties (remove from weakest units first)
    let remaining = attackerLosses;
    for (const unit of Object.values(attacker.units)) {
      if (remaining <= 0) break;
      const lost = Math.min((unit as any).count, remaining);
      (unit as any).count -= lost;
      remaining -= lost;
    }

    remaining = defenderLosses;
    for (const unit of Object.values(defender.units)) {
      if (remaining <= 0) break;
      const lost = Math.min((unit as any).count, remaining);
      (unit as any).count -= lost;
      remaining -= lost;
    }
  }

  // If max rounds reached, attacker wins by default
  battleLog.push("Battle ended: Max rounds reached, attacker victorious!");
  const attackerTotal = Object.values(attackerForce.units).reduce(
    (sum: number, u: any) => sum + u.count,
    0
  );
  const defenderTotal = Object.values(defenderForce.units).reduce(
    (sum: number, u: any) => sum + u.count,
    0
  );
  const finalAtkCasualties = attackerTotal - Object.values(attacker.units).reduce(
    (sum: number, u: any) => sum + u.count,
    0
  );
  const finalDefCasualties = defenderTotal - Object.values(defender.units).reduce(
    (sum: number, u: any) => sum + u.count,
    0
  );
  const classification = classifyBattleReport({
    winner: "attacker",
    attackerTotalUnits: attackerTotal,
    defenderTotalUnits: defenderTotal,
    attackerCasualties: finalAtkCasualties,
    defenderCasualties: finalDefCasualties,
    missionType: "attack",
    defenderHasPlanet: planetDefensesEngaged.length > 0,
    defenderHasMoon: defenderForce.hasMoon ?? false,
    attackerHasMothership: mothershipEngaged,
    defenderHasMothership: mothershipEngaged,
    hasEspionageProbe: Boolean(attackerForce.units["espionageProbe"]?.count),
  });
  return {
    winner: "attacker",
    attackerUnits: attacker.units,
    defenderUnits: defender.units,
    attackerCasualties: finalAtkCasualties,
    defenderCasualties: finalDefCasualties,
    rounds: round,
    battleLog,
    reportMeta: {
      ...classification,
      attackerWeaponsUsed,
      defenderWeaponsUsed,
      planetDefensesEngaged,
      mothershipEngaged,
      planetaryShieldActive,
      shieldBreached: planetaryShieldActive,
      weaponDamageBreakdown,
      shieldsStripped,
      armorDamageDealt,
    },
  };
}

/**
 * Calculate battle resources (metal/crystal/deut from victory)
 */
export function calculateVictoryResources(
  defenderResources: { metal: number; crystal: number; deuterium: number },
  winner: string
): { metal: number; crystal: number; deuterium: number } {
  const plunderRate = 0.3; // Plunder 30% of resources

  return {
    metal: Math.floor(defenderResources.metal * plunderRate),
    crystal: Math.floor(defenderResources.crystal * plunderRate),
    deuterium: Math.floor(defenderResources.deuterium * plunderRate),
  };
}
