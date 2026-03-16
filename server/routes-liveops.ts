import type { Express, Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import { isAuthenticated } from "./basicAuth";
import { db } from "./db";
import { storage } from "./storage";
import { items } from "../shared/schema";
import {
  COMMANDER_TALENT_TREE,
  getCommanderTierForLevel,
  getCommanderTitleByTier,
} from "../shared/config/commanderTalentTreeConfig";
import {
  SEASON_PASS_CONFIG,
  STOREFRONT_ITEMS,
  STORY_ACTS,
  STORY_CHAPTERS_PER_ACT,
  STORY_MISSIONS_ALL,
  STORY_TOTAL_ACTS,
  type SeasonPassReward,
  type StorefrontItem,
} from "../shared/config/liveOpsContentConfig";

function getUserId(req: Request): string {
  return (req.session as any)?.userId || "";
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

async function ensureStoryCampaignForUser(userId: string) {
  const existingCampaign = await storage.getStoryCampaign(userId);
  if (existingCampaign) {
    return existingCampaign;
  }

  return storage.createStoryCampaign({
    playerId: userId,
    currentAct: 1,
    currentChapter: 1,
    completedActs: 0,
    isCompleted: false,
    storyProgress: 0,
    totalXpEarned: 0,
    campaignState: { unlockedActs: [1] },
    npcsEncountered: [],
    completedMissions: [],
  } as any);
}

async function ensureStoryMissionsSeeded(userId: string, campaignId: string) {
  const existingMissions = await storage.getUserStoryMissions(userId);
  if (existingMissions.length >= STORY_MISSIONS_ALL.length) {
    return existingMissions;
  }

  for (const mission of STORY_MISSIONS_ALL) {
    const duplicate = existingMissions.find(
      (existing) =>
        existing.act === mission.act &&
        existing.chapter === mission.chapter &&
        existing.missionType === mission.missionType &&
        existing.title === mission.title,
    );

    if (duplicate) {
      continue;
    }

    await storage.createStoryMission({
      playerId: userId,
      campaignId,
      act: mission.act,
      chapter: mission.chapter,
      missionType: mission.missionType,
      title: mission.title,
      description: mission.description,
      lore: `Narrative track ${mission.missionCode}`,
      difficulty: mission.difficulty,
      npcName: mission.npcName,
      npcRole: mission.missionType === "main" ? "Primary Ally" : "Auxiliary Contact",
      npcTrait: mission.missionType === "main" ? "Resolute" : "Adaptive",
      objectives: [{
        id: `${mission.missionCode}-objective-1`,
        title: "Complete operational objective",
        target: 1,
      }],
      rewardXp: mission.rewardXp,
      rewardMetal: mission.rewardMetal,
      rewardCrystal: mission.rewardCrystal,
      rewardDeuterium: mission.rewardDeuterium,
      rewardItems: [],
      isCompleted: false,
      isActive: true,
    } as any);
  }

  return storage.getUserStoryMissions(userId);
}

function getCommanderProgressionState(playerState: any) {
  const commander = (playerState?.commander as any) || {};
  const stats = commander.stats || {};
  const level = Math.max(1, toNumber(stats.level, 1));
  const tier = getCommanderTierForLevel(level);
  const title = getCommanderTitleByTier(tier);

  const talentTreeState = (commander.talentTree as any) || {};
  const unlockedNodes = (talentTreeState.unlockedNodes as Record<string, number>) || {};
  const spentPoints = Object.values(unlockedNodes).reduce((sum, rank) => sum + toNumber(rank, 0), 0);
  const totalPoints = Math.max(0, level + tier * 2);
  const availablePoints = Math.max(0, totalPoints - spentPoints);

  return {
    level,
    tier,
    title,
    unlockedNodes,
    spentPoints,
    totalPoints,
    availablePoints,
  };
}

function resolveSeasonPassState(playerState: any) {
  const commander = (playerState?.commander as any) || {};
  const seasonPass = (commander.seasonPass as any) || {};

  const seasonXp = Math.max(0, toNumber(seasonPass.xp, 0));
  const currentTier = Math.min(SEASON_PASS_CONFIG.maxTier, Math.floor(seasonXp / SEASON_PASS_CONFIG.xpPerTier) + 1);

  return {
    seasonId: seasonPass.seasonId || SEASON_PASS_CONFIG.seasonId,
    xp: seasonXp,
    currentTier,
    claimedFree: Array.isArray(seasonPass.claimedFree) ? seasonPass.claimedFree as number[] : [],
    claimedGold: Array.isArray(seasonPass.claimedGold)
      ? seasonPass.claimedGold as number[]
      : Array.isArray(seasonPass.claimedPremium)
        ? seasonPass.claimedPremium as number[]
        : [],
    claimedPlatinum: Array.isArray(seasonPass.claimedPlatinum) ? seasonPass.claimedPlatinum as number[] : [],
    goldUnlocked: Boolean(seasonPass.goldUnlocked ?? seasonPass.premiumUnlocked),
    platinumUnlocked: Boolean(seasonPass.platinumUnlocked),
  };
}

function findSeasonReward(tier: number, track: "free" | "gold" | "platinum"): SeasonPassReward | undefined {
  const rewardPool =
    track === "free"
      ? SEASON_PASS_CONFIG.freeRewards
      : track === "gold"
        ? SEASON_PASS_CONFIG.goldRewards
        : SEASON_PASS_CONFIG.platinumRewards;
  return rewardPool.find((reward) => reward.tier === tier);
}

async function ensureStoreRewardItemExists(storeItem: StorefrontItem) {
  const existingItem = await storage.getItemById(storeItem.grantItemId);
  if (existingItem) {
    return existingItem;
  }

  const [created] = await db.insert(items).values({
    id: storeItem.grantItemId,
    name: storeItem.name,
    description: storeItem.description,
    itemType: storeItem.category,
    itemClass: "rare",
    rarity: "rare",
    rank: 1,
    stats: {},
    bonuses: {},
    requiredLevel: 1,
    requiredRank: 1,
    sellPrice: Math.floor(storeItem.price * 0.5),
    craftPrice: storeItem.price,
    marketPrice: storeItem.price,
    sources: ["storefront"],
    isStackable: true,
    maxStack: 999,
  } as any).returning();

  return created;
}

async function ensureSeasonPassRewardItemExists(itemId: string, tier: number) {
  const existingItem = await storage.getItemById(itemId);
  if (existingItem) {
    return existingItem;
  }

  const [created] = await db.insert(items).values({
    id: itemId,
    name: `Season Premium Crate T${tier}`,
    description: `Premium season pass reward crate for tier ${tier}.`,
    itemType: "bundles",
    itemClass: "epic",
    rarity: "epic",
    rank: 1,
    stats: {},
    bonuses: {},
    requiredLevel: 1,
    requiredRank: 1,
    sellPrice: 0,
    craftPrice: 0,
    marketPrice: 0,
    sources: ["season_pass"],
    isStackable: true,
    maxStack: 999,
  } as any).returning();

  return created;
}

export function registerLiveOpsRoutes(app: Express) {
  app.get("/api/commander/talent/tree", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const playerState = await storage.getPlayerState(userId);
      const state = getCommanderProgressionState(playerState);

      return res.json({
        tree: COMMANDER_TALENT_TREE,
        progression: state,
      });
    } catch (error) {
      console.error("Failed to fetch commander talent tree:", error);
      return res.status(500).json({ message: "Failed to fetch commander talent tree" });
    }
  });

  app.post("/api/commander/talent/unlock", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const nodeId = String(req.body?.nodeId || "").trim();
      if (!nodeId) {
        return res.status(400).json({ message: "nodeId is required" });
      }

      const node = COMMANDER_TALENT_TREE.nodes.find((entry) => entry.id === nodeId);
      if (!node) {
        return res.status(404).json({ message: "Talent node not found" });
      }

      const playerState = await storage.getPlayerState(userId);
      if (!playerState) {
        return res.status(404).json({ message: "Player state not found" });
      }

      const progression = getCommanderProgressionState(playerState);
      if (progression.level < node.requiredLevel) {
        return res.status(400).json({ message: "Commander level too low for this node" });
      }

      for (const prerequisiteNodeId of node.prerequisiteNodeIds) {
        if (!progression.unlockedNodes[prerequisiteNodeId]) {
          return res.status(400).json({ message: `Prerequisite node ${prerequisiteNodeId} is not unlocked` });
        }
      }

      const currentRank = progression.unlockedNodes[node.id] || 0;
      if (currentRank >= node.maxRank) {
        return res.status(400).json({ message: "Node is already at max rank" });
      }

      if (progression.availablePoints <= 0) {
        return res.status(400).json({ message: "No talent points available" });
      }

      const commander = { ...((playerState.commander as any) || {}) };
      const talentTreeState = { ...((commander.talentTree as any) || {}) };
      const unlockedNodes = { ...((talentTreeState.unlockedNodes as Record<string, number>) || {}) };
      unlockedNodes[node.id] = currentRank + 1;

      talentTreeState.unlockedNodes = unlockedNodes;
      talentTreeState.lastUpdatedAt = new Date().toISOString();
      commander.talentTree = talentTreeState;

      await storage.updatePlayerState(userId, { commander } as any);

      return res.json({
        success: true,
        nodeId,
        rank: unlockedNodes[node.id],
      });
    } catch (error) {
      console.error("Failed to unlock commander talent node:", error);
      return res.status(500).json({ message: "Failed to unlock talent node" });
    }
  });

  app.get("/api/season-pass/overview", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const playerState = await storage.getPlayerState(userId);
      const seasonPass = resolveSeasonPassState(playerState);

      return res.json({
        config: {
          seasonId: SEASON_PASS_CONFIG.seasonId,
          name: SEASON_PASS_CONFIG.name,
          unlockTracks: SEASON_PASS_CONFIG.unlockTracks,
          maxTier: SEASON_PASS_CONFIG.maxTier,
          xpPerTier: SEASON_PASS_CONFIG.xpPerTier,
          freeRewards: SEASON_PASS_CONFIG.freeRewards,
          goldRewards: SEASON_PASS_CONFIG.goldRewards,
          platinumRewards: SEASON_PASS_CONFIG.platinumRewards,
        },
        state: seasonPass,
      });
    } catch (error) {
      console.error("Failed to fetch season pass overview:", error);
      return res.status(500).json({ message: "Failed to fetch season pass overview" });
    }
  });

  app.post("/api/season-pass/xp", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const xpGain = Math.max(0, toNumber(req.body?.xp, 0));
      const playerState = await storage.getPlayerState(userId);
      if (!playerState) {
        return res.status(404).json({ message: "Player state not found" });
      }

      const commander = { ...((playerState.commander as any) || {}) };
      const seasonPass = { ...((commander.seasonPass as any) || {}) };
      seasonPass.seasonId = SEASON_PASS_CONFIG.seasonId;
      seasonPass.xp = Math.max(0, toNumber(seasonPass.xp, 0) + xpGain);
      seasonPass.claimedFree = Array.isArray(seasonPass.claimedFree) ? seasonPass.claimedFree : [];
      seasonPass.claimedGold = Array.isArray(seasonPass.claimedGold)
        ? seasonPass.claimedGold
        : Array.isArray(seasonPass.claimedPremium)
          ? seasonPass.claimedPremium
          : [];
      seasonPass.claimedPlatinum = Array.isArray(seasonPass.claimedPlatinum) ? seasonPass.claimedPlatinum : [];
      seasonPass.goldUnlocked = Boolean(seasonPass.goldUnlocked ?? seasonPass.premiumUnlocked);
      seasonPass.platinumUnlocked = Boolean(seasonPass.platinumUnlocked);
      commander.seasonPass = seasonPass;

      await storage.updatePlayerState(userId, { commander } as any);
      return res.json({ success: true, state: resolveSeasonPassState({ commander }) });
    } catch (error) {
      console.error("Failed to add season pass XP:", error);
      return res.status(500).json({ message: "Failed to add season pass XP" });
    }
  });

  app.post("/api/season-pass/premium/unlock", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const track = String(req.body?.track || "gold").toLowerCase() as "gold" | "platinum";
      if (track !== "gold" && track !== "platinum") {
        return res.status(400).json({ message: "Invalid season track" });
      }

      const playerState = await storage.getPlayerState(userId);
      if (!playerState) {
        return res.status(404).json({ message: "Player state not found" });
      }

      const commander = { ...((playerState.commander as any) || {}) };
      const seasonPass = resolveSeasonPassState(playerState);
      if ((track === "gold" && seasonPass.goldUnlocked) || (track === "platinum" && seasonPass.platinumUnlocked)) {
        return res.json({ success: true, alreadyUnlocked: true, state: seasonPass, track });
      }

      if (track === "platinum" && !seasonPass.goldUnlocked) {
        return res.status(400).json({ message: "Unlock Gold track before Platinum" });
      }

      const balance = await storage.getPlayerCurrency(userId);
      const unlockCost = SEASON_PASS_CONFIG.unlockTracks[track].cost;
      const currency = SEASON_PASS_CONFIG.unlockTracks[track].currency as "silver" | "gold" | "platinum";

      if (currency === "silver" && toNumber(balance.silver, 0) < unlockCost) {
        return res.status(400).json({ message: "Insufficient silver" });
      }
      if (currency === "gold" && toNumber(balance.gold, 0) < unlockCost) {
        return res.status(400).json({ message: "Insufficient gold" });
      }
      if (currency === "platinum" && toNumber(balance.platinum, 0) < unlockCost) {
        return res.status(400).json({ message: "Insufficient platinum" });
      }

      await storage.addCurrency(
        userId,
        currency === "silver" ? -unlockCost : 0,
        currency === "gold" ? -unlockCost : 0,
        currency === "platinum" ? -unlockCost : 0,
        `season_pass_${track}_unlock`,
      );

      commander.seasonPass = {
        ...((commander.seasonPass as any) || {}),
        seasonId: SEASON_PASS_CONFIG.seasonId,
        xp: seasonPass.xp,
        claimedFree: seasonPass.claimedFree,
        claimedGold: seasonPass.claimedGold,
        claimedPlatinum: seasonPass.claimedPlatinum,
        goldUnlocked: track === "gold" ? true : seasonPass.goldUnlocked,
        platinumUnlocked: track === "platinum" ? true : seasonPass.platinumUnlocked,
      };

      await storage.updatePlayerState(userId, { commander } as any);
      return res.json({ success: true, track, unlocked: true });
    } catch (error) {
      console.error("Failed to unlock season pass premium:", error);
      return res.status(500).json({ message: "Failed to unlock season pass premium" });
    }
  });

  app.post("/api/season-pass/claim", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const tier = Math.max(1, Math.min(SEASON_PASS_CONFIG.maxTier, toNumber(req.body?.tier, 1)));
      const requestedTrack = String(req.body?.track || "").toLowerCase();
      const track: "free" | "gold" | "platinum" =
        requestedTrack === "gold" || requestedTrack === "platinum" || requestedTrack === "free"
          ? requestedTrack
          : Boolean(req.body?.premium)
            ? "gold"
            : "free";

      const playerState = await storage.getPlayerState(userId);
      if (!playerState) {
        return res.status(404).json({ message: "Player state not found" });
      }

      const commander = { ...((playerState.commander as any) || {}) };
      const seasonPass = resolveSeasonPassState(playerState);

      if (track === "gold" && !seasonPass.goldUnlocked) {
        return res.status(403).json({ message: "Gold track is locked" });
      }

      if (track === "platinum" && !seasonPass.platinumUnlocked) {
        return res.status(403).json({ message: "Platinum track is locked" });
      }

      if (tier > seasonPass.currentTier) {
        return res.status(400).json({ message: "Tier is not unlocked yet" });
      }

      const targetClaimed =
        track === "free"
          ? seasonPass.claimedFree
          : track === "gold"
            ? seasonPass.claimedGold
            : seasonPass.claimedPlatinum;
      if (targetClaimed.includes(tier)) {
        return res.status(400).json({ message: "Reward already claimed" });
      }

      const reward = findSeasonReward(tier, track);
      if (!reward) {
        return res.status(404).json({ message: "Reward not found" });
      }

      if (reward.rewardType === "currency" && reward.currency && reward.amount) {
        const delta = reward.amount;
        await storage.addCurrency(
          userId,
          reward.currency === "silver" ? delta : 0,
          reward.currency === "gold" ? delta : 0,
          reward.currency === "platinum" ? delta : 0,
          `season_pass_tier_${tier}`,
        );
      }

      if (reward.rewardType === "item" && reward.itemId) {
        const rewardItem = STOREFRONT_ITEMS.find((item) => item.grantItemId === reward.itemId);
        if (rewardItem) {
          await ensureStoreRewardItemExists(rewardItem);
        } else {
          await ensureSeasonPassRewardItemExists(reward.itemId, tier);
        }
        await storage.addItemToInventory(userId, reward.itemId, reward.quantity || 1);
      }

      const updatedSeasonPass = {
        ...((commander.seasonPass as any) || {}),
        seasonId: SEASON_PASS_CONFIG.seasonId,
        xp: seasonPass.xp,
        claimedFree: track === "free" ? [...seasonPass.claimedFree, tier] : seasonPass.claimedFree,
        claimedGold: track === "gold" ? [...seasonPass.claimedGold, tier] : seasonPass.claimedGold,
        claimedPlatinum: track === "platinum" ? [...seasonPass.claimedPlatinum, tier] : seasonPass.claimedPlatinum,
        goldUnlocked: seasonPass.goldUnlocked,
        platinumUnlocked: seasonPass.platinumUnlocked,
      };
      commander.seasonPass = updatedSeasonPass;

      await storage.updatePlayerState(userId, { commander } as any);

      return res.json({
        success: true,
        tier,
        track,
        reward,
      });
    } catch (error) {
      console.error("Failed to claim season pass reward:", error);
      return res.status(500).json({ message: "Failed to claim season pass reward" });
    }
  });

  app.get("/api/storefront/catalog", isAuthenticated, async (_req: Request, res: Response) => {
    return res.json({
      items: STOREFRONT_ITEMS,
      categories: Array.from(new Set(STOREFRONT_ITEMS.map((item) => item.category))),
    });
  });

  app.get("/api/storefront/balance", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const currency = await storage.getPlayerCurrency(userId);
      return res.json(currency);
    } catch (error) {
      console.error("Failed to fetch storefront balance:", error);
      return res.status(500).json({ message: "Failed to fetch storefront balance" });
    }
  });

  app.post("/api/storefront/purchase", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const itemId = String(req.body?.itemId || "").trim();
      const quantity = Math.max(1, Math.min(99, toNumber(req.body?.quantity, 1)));

      if (!itemId) {
        return res.status(400).json({ message: "itemId is required" });
      }

      const product = STOREFRONT_ITEMS.find((item) => item.id === itemId);
      if (!product) {
        return res.status(404).json({ message: "Storefront item not found" });
      }

      const balance = await storage.getPlayerCurrency(userId);
      const totalCost = product.price * quantity;

      if (product.currency === "silver" && toNumber(balance.silver, 0) < totalCost) {
        return res.status(400).json({ message: "Insufficient silver" });
      }
      if (product.currency === "gold" && toNumber(balance.gold, 0) < totalCost) {
        return res.status(400).json({ message: "Insufficient gold" });
      }
      if (product.currency === "platinum" && toNumber(balance.platinum, 0) < totalCost) {
        return res.status(400).json({ message: "Insufficient platinum" });
      }

      await storage.addCurrency(
        userId,
        product.currency === "silver" ? -totalCost : 0,
        product.currency === "gold" ? -totalCost : 0,
        product.currency === "platinum" ? -totalCost : 0,
        `storefront_purchase_${product.id}`,
      );

      await ensureStoreRewardItemExists(product);
      await storage.addItemToInventory(userId, product.grantItemId, product.grantQuantity * quantity);

      return res.json({
        success: true,
        product,
        quantity,
        totalCost,
      });
    } catch (error) {
      console.error("Failed to purchase storefront item:", error);
      return res.status(500).json({ message: "Failed to purchase item" });
    }
  });

  app.get("/api/story/campaign", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const campaign = await ensureStoryCampaignForUser(userId);
      const seededMissions = await ensureStoryMissionsSeeded(userId, campaign.id);

      return res.json({
        ...campaign,
        actDefinitions: STORY_ACTS,
        missionCounts: {
          total: seededMissions.length,
          main: seededMissions.filter((mission) => mission.missionType === "main").length,
          side: seededMissions.filter((mission) => mission.missionType === "side").length,
          completed: seededMissions.filter((mission) => mission.isCompleted).length,
        },
      });
    } catch (error) {
      console.error("Failed to fetch story campaign:", error);
      return res.status(500).json({ message: "Failed to fetch story campaign" });
    }
  });

  app.get("/api/story/missions", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const campaign = await ensureStoryCampaignForUser(userId);
      const missions = await ensureStoryMissionsSeeded(userId, campaign.id);

      const actFilter = toNumber(req.query.act, 0);
      const missionTypeFilter = String(req.query.type || "all").toLowerCase();

      const filtered = missions
        .filter((mission) => (actFilter > 0 ? mission.act === actFilter : true))
        .filter((mission) => (missionTypeFilter === "all" ? true : mission.missionType === missionTypeFilter))
        .sort((left, right) => {
          if (left.act !== right.act) return left.act - right.act;
          if (left.chapter !== right.chapter) return left.chapter - right.chapter;
          return left.missionType.localeCompare(right.missionType);
        });

      return res.json(filtered);
    } catch (error) {
      console.error("Failed to fetch story missions:", error);
      return res.status(500).json({ message: "Failed to fetch story missions" });
    }
  });

  app.post("/api/story/missions/:id/complete", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const missionId = req.params.id;

      const mission = await storage.getStoryMission(missionId);
      if (!mission || mission.playerId !== userId) {
        return res.status(404).json({ message: "Story mission not found" });
      }

      if (mission.isCompleted) {
        return res.json({ success: true, alreadyCompleted: true, mission });
      }

      const completedMission = await storage.completeStoryMission(missionId, userId);
      const latestPlayerState = await storage.getPlayerState(userId);
      const currentResources = ((latestPlayerState?.resources as Record<string, number>) || {});
      await storage.updatePlayerState(userId, {
        resources: {
          ...currentResources,
          metal: toNumber(currentResources.metal, 0) + toNumber(mission.rewardMetal, 0),
          crystal: toNumber(currentResources.crystal, 0) + toNumber(mission.rewardCrystal, 0),
          deuterium: toNumber(currentResources.deuterium, 0) + toNumber(mission.rewardDeuterium, 0),
          energy: toNumber(currentResources.energy, 0),
        },
      } as any);

      const campaign = await ensureStoryCampaignForUser(userId);
      const userMissions = await storage.getUserStoryMissions(userId);
      const completedMissions = userMissions.filter((entry) => entry.isCompleted || entry.id === missionId);
      const completedActs = new Set(completedMissions.filter((entry) => entry.missionType === "main").map((entry) => entry.act)).size;
      const mainMissionCount = userMissions.filter((entry) => entry.missionType === "main").length || 1;
      const storyProgress = Math.min(100, (completedMissions.filter((entry) => entry.missionType === "main").length / mainMissionCount) * 100);
      const currentAct = Math.min(STORY_TOTAL_ACTS, completedActs + 1);
      const currentActCompletedMain = completedMissions.filter(
        (entry) => entry.act === currentAct && entry.missionType === "main",
      ).length;
      const currentActMainTotal =
        userMissions.filter((entry) => entry.act === currentAct && entry.missionType === "main").length || STORY_CHAPTERS_PER_ACT;
      const mainMissionsPerChapter = Math.max(1, Math.floor(currentActMainTotal / STORY_CHAPTERS_PER_ACT));

      await storage.updateStoryCampaign(userId, {
        currentAct,
        currentChapter: Math.min(
          STORY_CHAPTERS_PER_ACT,
          Math.max(1, Math.floor(currentActCompletedMain / mainMissionsPerChapter) + 1),
        ),
        completedActs,
        storyProgress,
        totalXpEarned: toNumber(campaign.totalXpEarned, 0) + toNumber(mission.rewardXp, 0),
        completedMissions: completedMissions.map((entry) => entry.id),
        npcsEncountered: Array.from(new Set([...(campaign.npcsEncountered as string[] || []), mission.npcName || "Unknown Contact"])),
      } as any);

      return res.json({
        success: true,
        mission: completedMission,
      });
    } catch (error) {
      console.error("Failed to complete story mission:", error);
      return res.status(500).json({ message: "Failed to complete story mission" });
    }
  });
}
