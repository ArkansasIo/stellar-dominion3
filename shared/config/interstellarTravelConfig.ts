/**
 * Interstellar Travel System
 * Stargates, Jumpgates, Wormholes, and FTL drives for galaxy-wide travel
 * @tag #travel #ftl #gates #wormholes #navigation
 */

// ============================================================================
// TRAVEL SYSTEM INTERFACES
// ============================================================================

export interface Coordinates {
  galaxy: number;
  sector: number;
  system: number;
  x: number;
  y: number;
  z: number;
}

export interface TravelRoute {
  id: string;
  name: string;
  fromCoordinates: Coordinates;
  toCoordinates: Coordinates;
  distance: number;              // Light-years
  travelTime: number;            // In-game turns
  travelCost: {
    deuterium: number;
    energy: number;
  };
  danger: number;               // 0-100 (encounter risk)
  enabled: boolean;
}

// ============================================================================
// STARGATE SYSTEM (Ancient Network)
// ============================================================================

export interface Stargate {
  id: string;
  name: string;
  location: Coordinates;
  
  // Physical Properties
  diameter: number;               // km
  energyOutput: number;          // MW
  efficiency: number;            // 0-100%
  
  // Status
  isActive: boolean;
  constructedBy?: string;         // Civilization name
  ageInYears: number;
  
  // Capabilities
  maxTravelDistance: number;      // Light-years
  travelTime: number;             // Turns to any galaxy
  maxShipSize: number;            // Hull points
  
  // Network
  connectedGates: string[];       // IDs of connected gates
  linkedToJumpgates: string[];    // Jumpgate IDs in network
  
  // History
  discoveredBy: string[];
  lastUsedBy?: string;
  lastUsedDate?: Date;
  
  description: string;
  origins?: string;              // Ancient lore
}

export const STARGATES: Stargate[] = [
  {
    id: 'sg-alpha-1',
    name: 'Alpha Gate',
    location: { galaxy: 1, sector: 1, system: 1, x: 0, y: 0, z: 0 },
    diameter: 1000,
    energyOutput: 100000,
    efficiency: 95,
    isActive: true,
    constructedBy: 'Ancient Ancients',
    ageInYears: 10000000,
    maxTravelDistance: 1000000,
    travelTime: 5,
    maxShipSize: Infinity,
    connectedGates: ['sg-beta-1', 'sg-gamma-1'],
    linkedToJumpgates: [],
    discoveredBy: ['Human Explorers', 'Krell Dominion'],
    description: 'Ancient prime stargate in the center of the known galaxy',
    origins: 'Built by the Ancients ~10 million years ago',
  },
  
  {
    id: 'sg-beta-1',
    name: 'Beta Gate',
    location: { galaxy: 1, sector: 50, system: 100, x: 10000, y: 10000, z: 5000 },
    diameter: 900,
    energyOutput: 95000,
    efficiency: 92,
    isActive: true,
    constructedBy: 'Ancient Ancients',
    ageInYears: 9800000,
    maxTravelDistance: 1000000,
    travelTime: 4,
    maxShipSize: Infinity,
    connectedGates: ['sg-alpha-1', 'sg-delta-1'],
    linkedToJumpgates: [],
    discoveredBy: ['Krell Dominion'],
    description: 'Secondary stargate in outer galactic region',
  },
  
  {
    id: 'sg-gamma-1',
    name: 'Gamma Gate',
    location: { galaxy: 2, sector: 1, system: 1, x: 0, y: 0, z: 0 },
    diameter: 1100,
    energyOutput: 120000,
    efficiency: 98,
    isActive: true,
    constructedBy: 'Ancient Ancients',
    ageInYears: 10500000,
    maxTravelDistance: 1000000,
    travelTime: 6,
    maxShipSize: Infinity,
    connectedGates: ['sg-alpha-1'],
    linkedToJumpgates: [],
    discoveredBy: ['Explorer Ships'],
    description: 'Inter-galactic stargate connecting to Galaxy 2',
    origins: 'Primary transgalactic nexus',
  },
  
  {
    id: 'sg-delta-1',
    name: 'Delta Gate',
    location: { galaxy: 1, sector: 200, system: 500, x: 50000, y: 50000, z: 25000 },
    diameter: 800,
    energyOutput: 80000,
    efficiency: 88,
    isActive: true,
    constructedBy: 'Ancient Ancients',
    ageInYears: 9500000,
    maxTravelDistance: 1000000,
    travelTime: 3,
    maxShipSize: Infinity,
    connectedGates: ['sg-beta-1'],
    linkedToJumpgates: [],
    discoveredBy: ['Early Exploration'],
    description: 'Remote stargate in far outer territories',
  },
];

// ============================================================================
// JUMPGATE SYSTEM (Player-Built)
// ============================================================================

export interface Jumpgate {
  id: string;
  name: string;
  location: Coordinates;
  
  // Ownership
  ownedBy: string;                // Player ID
  faction: string;
  constructedDate: Date;
  
  // Physical Properties
  diameter: number;               // km
  energyOutput: number;          // MW
  efficiency: number;            // 0-100%
  level: number;                 // 1-999 (upgrade level)
  tier: number;                  // 1-99 (upgrade tier)
  
  // Status
  isActive: boolean;
  underConstruction: boolean;
  constructionProgress: number;  // % (0-100)
  
  // Capabilities
  maxTravelDistance: number;      // Light-years
  travelTime: number;             // Turns
  maxShipSize: number;            // Hull points
  simultaneousJumps: number;      // Ships at once
  
  // Network
  linkedGates: string[];          // Connected jumpgates/stargates
  networkName: string;
  
  // Resources
  maintenanceCost: {
    deuterium: number;
    energy: number;
  };
  
  // Defense
  shieldStrength: number;         // HP
  defensiveWeapons: number;       // Turrets
  
  // History
  discoveredBy: string;
  lastActivatedBy?: string;
  lastActivationDate?: Date;
  totalJumpsMade: number;
  
  description: string;
}

// ============================================================================
// WORMHOLE SYSTEM (Natural Phenomena)
// ============================================================================

export interface Wormhole {
  id: string;
  name: string;
  
  // Endpoints
  entranceCoordinates: Coordinates;
  exitCoordinates: Coordinates;
  
  // Physical Properties
  diameterAtEntrance: number;    // km
  diameterAtExit: number;
  eventHorizonStability: number;  // 0-100% (stability)
  
  // Characteristics
  travelTime: number;             // Turns
  spacetimeCurvature: number;     // Physics parameter
  hawkingRadiation: number;       // Danger level (0-100)
  
  // Status
  isStable: boolean;
  isNavigable: boolean;
  discoveredDate: Date;
  lastUsedDate?: Date;
  
  // Restrictions
  maxShipSize: number;            // Hull points that can traverse
  minShipSize: number;
  energyRequirement: number;      // Deuterium cost
  
  // Navigation
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert' | 'legendary';
  pilotingSkillRequired: number;
  expectedCasualties: number;     // % ship loss
  
  // Special
  oneWay: boolean;                // Can only go one direction
  seasonal: boolean;              // Only passable certain times
  seasonalWindow: { start: number; end: number };  // Turns
  
  description: string;
  dangers: string[];
  rewards?: string[];
}

export const WORMHOLES: Wormhole[] = [
  {
    id: 'wh-tau-1',
    name: 'Tau-1 Wormhole',
    entranceCoordinates: { galaxy: 1, sector: 75, system: 250, x: 25000, y: 0, z: 0 },
    exitCoordinates: { galaxy: 1, sector: 125, system: 750, x: 75000, y: 0, z: 0 },
    diameterAtEntrance: 500,
    diameterAtExit: 480,
    eventHorizonStability: 85,
    travelTime: 8,
    spacetimeCurvature: 4.5,
    hawkingRadiation: 20,
    isStable: true,
    isNavigable: true,
    discoveredDate: new Date('2025-06-01'),
    maxShipSize: 50000,
    minShipSize: 1000,
    energyRequirement: 500,
    difficulty: 'hard',
    pilotingSkillRequired: 60,
    expectedCasualties: 5,
    oneWay: false,
    seasonal: false,
    seasonalWindow: { start: 0, end: 0 },
    description: 'Naturally occurring wormhole connecting distant sectors',
    dangers: ['Tidal forces', 'Radiation', 'Dimensional shearing'],
    rewards: ['Rare isotopes inside', 'Ancient artifacts'],
  },
  
  {
    id: 'wh-omega-1',
    name: 'Omega Rift',
    entranceCoordinates: { galaxy: 2, sector: 200, system: 400, x: 100000, y: 50000, z: 25000 },
    exitCoordinates: { galaxy: 3, sector: 1, system: 1, x: 0, y: 0, z: 0 },
    diameterAtEntrance: 800,
    diameterAtExit: 700,
    eventHorizonStability: 65,
    travelTime: 20,
    spacetimeCurvature: 8.2,
    hawkingRadiation: 55,
    isStable: false,
    isNavigable: true,
    discoveredDate: new Date('2024-03-15'),
    maxShipSize: 30000,
    minShipSize: 5000,
    energyRequirement: 1500,
    difficulty: 'expert',
    pilotingSkillRequired: 85,
    expectedCasualties: 25,
    oneWay: false,
    seasonal: true,
    seasonalWindow: { start: 100, end: 200 },
    description: 'Dangerous wormhole connecting distant galaxies - highly unstable',
    dangers: ['Extreme tidal forces', 'High radiation', 'Dimension collapse risk', 'Ship deformation'],
    rewards: ['Gateway to Galaxy 3', 'Exotic matter samples'],
  },
];

// ============================================================================
// JUMPGATE DATA (Player-Built Network)
// ============================================================================

export const JUMPGATES: Jumpgate[] = [
  {
    id: 'jg-terran-1',
    name: 'Terran Jumpgate Alpha',
    location: { galaxy: 1, sector: 10, system: 50, x: 5000, y: 2000, z: 1000 },
    ownedBy: 'player-terran-1',
    faction: 'Terran Federation',
    constructedDate: new Date('2024-01-15'),
    diameter: 350,
    energyOutput: 45000,
    efficiency: 82,
    level: 8,
    tier: 2,
    isActive: true,
    underConstruction: false,
    constructionProgress: 100,
    maxTravelDistance: 150000,
    travelTime: 3,
    maxShipSize: 200000,
    simultaneousJumps: 5,
    linkedGates: ['jg-krell-1', 'jg-terran-2'],
    networkName: 'Terran Jump Network',
    maintenanceCost: { deuterium: 200, energy: 5000 },
    shieldStrength: 50000,
    defensiveWeapons: 10,
    discoveredBy: 'Commander Reed',
    lastActivatedBy: 'Admiral Chen',
    lastActivationDate: new Date('2025-11-01'),
    totalJumpsMade: 1250,
    description: 'Primary Terran Federation jumpgate controlling inner core sector transit',
  },

  {
    id: 'jg-terran-2',
    name: 'Terran Jumpgate Beta',
    location: { galaxy: 1, sector: 45, system: 120, x: 20000, y: 8000, z: 3000 },
    ownedBy: 'player-terran-1',
    faction: 'Terran Federation',
    constructedDate: new Date('2024-06-20'),
    diameter: 300,
    energyOutput: 38000,
    efficiency: 78,
    level: 5,
    tier: 1,
    isActive: true,
    underConstruction: false,
    constructionProgress: 100,
    maxTravelDistance: 100000,
    travelTime: 4,
    maxShipSize: 150000,
    simultaneousJumps: 3,
    linkedGates: ['jg-terran-1', 'jg-neutral-1'],
    networkName: 'Terran Jump Network',
    maintenanceCost: { deuterium: 150, energy: 3800 },
    shieldStrength: 35000,
    defensiveWeapons: 6,
    discoveredBy: 'Exploration Fleet 7',
    lastActivatedBy: 'Captain Torres',
    lastActivationDate: new Date('2025-10-28'),
    totalJumpsMade: 430,
    description: 'Mid-range Terran jumpgate providing coverage for outer colony sectors',
  },

  {
    id: 'jg-krell-1',
    name: 'Krell Dominion Gate Sigma',
    location: { galaxy: 1, sector: 80, system: 200, x: 35000, y: 15000, z: 8000 },
    ownedBy: 'player-krell-1',
    faction: 'Krell Dominion',
    constructedDate: new Date('2023-09-05'),
    diameter: 500,
    energyOutput: 70000,
    efficiency: 90,
    level: 12,
    tier: 3,
    isActive: true,
    underConstruction: false,
    constructionProgress: 100,
    maxTravelDistance: 300000,
    travelTime: 2,
    maxShipSize: 500000,
    simultaneousJumps: 10,
    linkedGates: ['jg-terran-1', 'jg-krell-2'],
    networkName: 'Krell Dominion Network',
    maintenanceCost: { deuterium: 500, energy: 12000 },
    shieldStrength: 120000,
    defensiveWeapons: 25,
    discoveredBy: 'High Warlord Vex',
    lastActivatedBy: 'Fleet Admiral Zyx',
    lastActivationDate: new Date('2025-11-03'),
    totalJumpsMade: 5800,
    description: 'Heavily fortified Krell Dominion military jumpgate with rapid transit capability',
  },

  {
    id: 'jg-krell-2',
    name: 'Krell Dominion Gate Omega',
    location: { galaxy: 1, sector: 150, system: 380, x: 60000, y: 30000, z: 15000 },
    ownedBy: 'player-krell-1',
    faction: 'Krell Dominion',
    constructedDate: new Date('2023-12-01'),
    diameter: 450,
    energyOutput: 62000,
    efficiency: 87,
    level: 10,
    tier: 3,
    isActive: true,
    underConstruction: false,
    constructionProgress: 100,
    maxTravelDistance: 250000,
    travelTime: 3,
    maxShipSize: 400000,
    simultaneousJumps: 8,
    linkedGates: ['jg-krell-1', 'jg-neutral-1'],
    networkName: 'Krell Dominion Network',
    maintenanceCost: { deuterium: 420, energy: 10000 },
    shieldStrength: 100000,
    defensiveWeapons: 20,
    discoveredBy: 'High Warlord Vex',
    lastActivatedBy: 'Commander Ryx',
    lastActivationDate: new Date('2025-10-31'),
    totalJumpsMade: 3200,
    description: 'Outer-rim Krell Dominion gate securing frontier territories and expansion routes',
  },

  {
    id: 'jg-neutral-1',
    name: 'Neutral Zone Waygate',
    location: { galaxy: 1, sector: 100, system: 250, x: 48000, y: 20000, z: 10000 },
    ownedBy: 'faction-neutral',
    faction: 'Neutral Consortium',
    constructedDate: new Date('2022-03-10'),
    diameter: 200,
    energyOutput: 25000,
    efficiency: 70,
    level: 4,
    tier: 1,
    isActive: true,
    underConstruction: false,
    constructionProgress: 100,
    maxTravelDistance: 80000,
    travelTime: 5,
    maxShipSize: 100000,
    simultaneousJumps: 2,
    linkedGates: ['jg-terran-2', 'jg-krell-2'],
    networkName: 'Neutral Consortium Waypoints',
    maintenanceCost: { deuterium: 80, energy: 2000 },
    shieldStrength: 15000,
    defensiveWeapons: 3,
    discoveredBy: 'Independent Traders',
    totalJumpsMade: 720,
    description: 'Civilian-operated transit gate at the crossroads of Terran and Krell space',
  },

  {
    id: 'jg-frontier-1',
    name: 'Frontier Jumpgate Zeta',
    location: { galaxy: 2, sector: 5, system: 10, x: 500, y: 500, z: 200 },
    ownedBy: 'faction-explorer',
    faction: 'Explorer League',
    constructedDate: new Date('2025-02-14'),
    diameter: 180,
    energyOutput: 20000,
    efficiency: 65,
    level: 2,
    tier: 1,
    isActive: true,
    underConstruction: false,
    constructionProgress: 100,
    maxTravelDistance: 50000,
    travelTime: 6,
    maxShipSize: 80000,
    simultaneousJumps: 1,
    linkedGates: [],
    networkName: 'Explorer League Network',
    maintenanceCost: { deuterium: 50, energy: 1500 },
    shieldStrength: 8000,
    defensiveWeapons: 1,
    discoveredBy: 'Scout Ship Horizon',
    totalJumpsMade: 45,
    description: 'Newly constructed gateway into Galaxy 2 — the frontier of known space',
  },
];

// ============================================================================
// FTL DRIVE SYSTEM (Technology-Based)
// ============================================================================

export interface FTLDrive {
  id: string;
  name: string;
  class: 'civilian' | 'military' | 'experimental' | 'ancient' | 'exotic';
  
  // Performance
  maxSpeed: number;               // Light-years per turn
  fuelEfficiency: number;         // LY per unit deuterium
  jumpRange: number;              // Max distance in one jump
  chargeTime: number;             // Turns to charge
  
  // Requirements
  techLevelRequired: number;
  powerRequired: number;          // Energy units
  deuteriumPerJump: number;
  
  // Capabilities
  canJumpToKnownCoordinates: boolean;
  canPerformBlindJumps: boolean;
  canOperateInStarfieldEffect: boolean;
  
  // Ship Compatibility
  minShipSize: number;            // Hull points
  maxShipSize: number;
  
  // Reliability
  failureRate: number;            // 0-100 (% chance of failure)
  safetyRating: number;           // 0-100 (crew survival if failure)
  
  // Special Features
  hasWarpBubble: boolean;         // FTL field around ship
  hasStealthCapability: boolean;
  canTowVessels: boolean;
  
  description: string;
  history?: string;
  manufacturer?: string;
}

export const FTL_DRIVES: FTLDrive[] = [
  {
    id: 'ftl-standard',
    name: 'Standard FTL Drive',
    class: 'civilian',
    maxSpeed: 10,
    fuelEfficiency: 5,
    jumpRange: 50,
    chargeTime: 2,
    techLevelRequired: 5,
    powerRequired: 1000,
    deuteriumPerJump: 100,
    canJumpToKnownCoordinates: true,
    canPerformBlindJumps: false,
    canOperateInStarfieldEffect: false,
    minShipSize: 1000,
    maxShipSize: 500000,
    failureRate: 2,
    safetyRating: 95,
    hasWarpBubble: false,
    hasStealthCapability: false,
    canTowVessels: false,
    description: 'Standard interstellar drive suitable for commercial vessels',
    manufacturer: 'Terran Industries',
  },
  
  {
    id: 'ftl-military',
    name: 'Military FTL Drive',
    class: 'military',
    maxSpeed: 25,
    fuelEfficiency: 3,
    jumpRange: 200,
    chargeTime: 1,
    techLevelRequired: 15,
    powerRequired: 3000,
    deuteriumPerJump: 300,
    canJumpToKnownCoordinates: true,
    canPerformBlindJumps: true,
    canOperateInStarfieldEffect: false,
    minShipSize: 5000,
    maxShipSize: 100000,
    failureRate: 1,
    safetyRating: 98,
    hasWarpBubble: true,
    hasStealthCapability: true,
    canTowVessels: true,
    description: 'High-performance military FTL drive with advanced capabilities',
    manufacturer: 'Krell Military Complex',
  },
  
  {
    id: 'ftl-experimental',
    name: 'Experimental FTL Drive',
    class: 'experimental',
    maxSpeed: 50,
    fuelEfficiency: 2,
    jumpRange: 500,
    chargeTime: 0.5,
    techLevelRequired: 25,
    powerRequired: 10000,
    deuteriumPerJump: 1000,
    canJumpToKnownCoordinates: true,
    canPerformBlindJumps: true,
    canOperateInStarfieldEffect: true,
    minShipSize: 10000,
    maxShipSize: 50000,
    failureRate: 5,
    safetyRating: 85,
    hasWarpBubble: true,
    hasStealthCapability: true,
    canTowVessels: false,
    description: 'Cutting-edge FTL technology with extreme performance - high risk',
    manufacturer: 'Zenith Collective',
  },
  
  {
    id: 'ftl-ancient',
    name: 'Ancient FTL Drive',
    class: 'ancient',
    maxSpeed: 100,
    fuelEfficiency: 10,
    jumpRange: 1000,
    chargeTime: 3,
    techLevelRequired: 50,
    powerRequired: 50000,
    deuteriumPerJump: 50,
    canJumpToKnownCoordinates: true,
    canPerformBlindJumps: true,
    canOperateInStarfieldEffect: true,
    minShipSize: 50000,
    maxShipSize: 1000000,
    failureRate: 0 ,
    safetyRating: 100,
    hasWarpBubble: true,
    hasStealthCapability: true,
    canTowVessels: true,
    description: 'Ancient alien technology of superior design and reliability',
    manufacturer: 'The Ancients',
    history: 'Reverse-engineered artifact found in ruin sites',
  },
];

// ============================================================================
// TRAVEL TIME CALCULATOR
// ============================================================================

export function calculateTravelTime(
  distance: number,              // Light-years
  ftlDrive: FTLDrive | null,
  gate: Stargate | Jumpgate | null
): number {
  if (gate) {
    return gate.travelTime;
  }
  
  if (ftlDrive) {
    return Math.ceil(distance / ftlDrive.maxSpeed);
  }
  
  // Default: 1 turn per light-year (no FTL)
  return distance;
}

export function calculateTravelCost(
  distance: number,
  ftlDrive: FTLDrive | null
): { deuterium: number; energy: number } {
  if (!ftlDrive) {
    return { deuterium: distance * 10, energy: distance * 5 };
  }
  
  const jumpsNeeded = Math.ceil(distance / ftlDrive.jumpRange);
  
  return {
    deuterium: jumpsNeeded * ftlDrive.deuteriumPerJump,
    energy: jumpsNeeded * ftlDrive.powerRequired,
  };
}

export function calculateDistance(from: Coordinates, to: Coordinates): number {
  // Inter-galactic distance calculation
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dz = to.z - from.z;
  
  // Add sector/system distance
  const sectorDist = Math.abs(to.sector - from.sector) * 1000;
  const systemDist = Math.abs(to.system - from.system) * 100;
  const galaxyDist = Math.abs(to.galaxy - from.galaxy) * 100000;
  
  return Math.sqrt(dx*dx + dy*dy + dz*dz + sectorDist*sectorDist + 
                   systemDist*systemDist + galaxyDist*galaxyDist) / 1000;  // Convert to LY
}

// ============================================================================
// TRAVEL ROUTE BUILDER
// ============================================================================

export function buildTravelRoute(
  name: string,
  from: Coordinates,
  to: Coordinates,
  method: 'warp' | 'gate' | 'wormhole',
  ftlDrive?: FTLDrive
): TravelRoute {
  const distance = calculateDistance(from, to);
  let travelTime = 10; // Default
  let cost = { deuterium: 1000, energy: 500 };
  
  if (method === 'warp' && ftlDrive) {
    travelTime = calculateTravelTime(distance, ftlDrive, null);
    cost = calculateTravelCost(distance, ftlDrive);
  }
  
  return {
    id: `route-${Date.now()}`,
    name,
    fromCoordinates: from,
    toCoordinates: to,
    distance,
    travelTime,
    travelCost: cost,
    danger: Math.min(100, distance / 100),
    enabled: true,
  };
}

// ============================================================================
// EXPORT FUNCTIONS & UTILITIES
// ============================================================================

export function getStargate(id: string): Stargate | undefined {
  return STARGATES.find(g => g.id === id);
}

export function getAllStargates(): Stargate[] {
  return STARGATES;
}

export function getActiveStargates(): Stargate[] {
  return STARGATES.filter(g => g.isActive);
}

export function getNearbyWormholes(coords: Coordinates, radiusLY: number): Wormhole[] {
  return WORMHOLES.filter(w => {
    const dist = calculateDistance(coords, w.entranceCoordinates);
    return dist <= radiusLY;
  });
}

export function getFTLDrive(id: string): FTLDrive | undefined {
  return FTL_DRIVES.find(d => d.id === id);
}

export function getFTLDrivesByClass(driveClass: string): FTLDrive[] {
  return FTL_DRIVES.filter(d => d.class === driveClass);
}

export function getFTLDrivesByTechLevel(minTech: number): FTLDrive[] {
  return FTL_DRIVES.filter(d => d.techLevelRequired <= minTech).sort((a, b) => 
    b.techLevelRequired - a.techLevelRequired
  );
}

// ============================================================================
// JUMPGATE UTILITIES
// ============================================================================

export function getJumpgate(id: string): Jumpgate | undefined {
  return JUMPGATES.find(g => g.id === id);
}

export function getAllJumpgates(): Jumpgate[] {
  return JUMPGATES;
}

export function getActiveJumpgates(): Jumpgate[] {
  return JUMPGATES.filter(g => g.isActive && !g.underConstruction);
}

export function getJumpgatesByNetwork(networkName: string): Jumpgate[] {
  return JUMPGATES.filter(g => g.networkName === networkName);
}

export function getJumpgatesByOwner(ownerId: string): Jumpgate[] {
  return JUMPGATES.filter(g => g.ownedBy === ownerId);
}

export function getJumpgatesByFaction(faction: string): Jumpgate[] {
  return JUMPGATES.filter(g => g.faction === faction);
}

export function getLinkedJumpgates(gateId: string): Jumpgate[] {
  const gate = getJumpgate(gateId);
  if (!gate) return [];
  return gate.linkedGates
    .map(id => getJumpgate(id))
    .filter((g): g is Jumpgate => g !== undefined);
}
