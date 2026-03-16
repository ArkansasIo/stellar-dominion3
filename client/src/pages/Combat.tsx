import GameLayout from "@/components/layout/GameLayout";
import { useGame } from "@/lib/gameContext";
import { TECH_BRANCH_ASSETS, SHIP_ASSETS } from "@shared/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Sword, Eye, Flame, Zap, Shield, Users, Trophy, AlertCircle, Check, X, Zap as ZapIcon,
  Crosshair, ShieldCheck, Globe, Star, Info
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const TEMP_THEME_IMAGE = "/theme-temp.png";

export default function Combat() {
  const { units, resources, research, buildings } = useGame();
  const { toast } = useToast();
  const [targetId, setTargetId] = useState("");
  const [combatType, setCombatType] = useState<"raid" | "attack" | "spy" | "sabotage">("attack");
  const [selectedUnits, setSelectedUnits] = useState<{ [key: string]: number }>({});
  const [battleResult, setBattleResult] = useState<any>(null);
  const [attackError, setAttackError] = useState<string | null>(null);

  // Fetch combat stats
  const { data: combatStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/combat/stats"],
    queryFn: async () => {
      const res = await fetch("/api/combat/stats", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch combat stats");
      return res.json();
    },
    refetchInterval: 30000,
  });

  // Fetch battle history
  const { data: battleHistory } = useQuery({
    queryKey: ["/api/combat/battle-history"],
    queryFn: async () => {
      const res = await fetch("/api/combat/battle-history", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch battle history");
      return res.json();
    },
    refetchInterval: 60000,
  });

  // Fetch weapon systems
  const { data: weaponsData } = useQuery({
    queryKey: ["/api/combat/weapons"],
    queryFn: async () => {
      const res = await fetch("/api/combat/weapons");
      if (!res.ok) throw new Error("Failed to fetch weapons");
      return res.json();
    },
    staleTime: Infinity,
  });

  // Fetch defense systems
  const { data: defensesData } = useQuery({
    queryKey: ["/api/combat/defenses"],
    queryFn: async () => {
      const res = await fetch("/api/combat/defenses");
      if (!res.ok) throw new Error("Failed to fetch defenses");
      return res.json();
    },
    staleTime: Infinity,
  });

  // Fetch ship combat profiles
  const { data: shipProfilesData } = useQuery({
    queryKey: ["/api/combat/ship-profiles"],
    queryFn: async () => {
      const res = await fetch("/api/combat/ship-profiles");
      if (!res.ok) throw new Error("Failed to fetch ship profiles");
      return res.json();
    },
    staleTime: Infinity,
  });

  // Attack mutation
  const attackMutation = useMutation({
    mutationFn: async () => {
      const hasUnits = Object.values(selectedUnits).some((count) => count > 0);
      if (!hasUnits) throw new Error("Select at least 1 unit");
      if (!targetId.trim()) throw new Error("Enter a target player ID");

      const res = await fetch("/api/combat/attack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ targetId, units: selectedUnits }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Attack failed");
      }
      return res.json();
    },
    onMutate: () => {
      setAttackError(null);
    },
    onSuccess: (data) => {
      setBattleResult(data);
      setSelectedUnits({});
      setAttackError(null);
      toast({ title: "Attack resolved", description: `Engagement completed against ${targetId.trim()}.` });
    },
    onError: (error: any) => {
      setAttackError(error.message || "Attack failed");
      toast({ title: "Attack failed", description: error.message, variant: "destructive" });
    },
  });

  const unitTypes = Object.keys(units || {});
  const totalSelected = Object.values(selectedUnits).reduce((a, b) => a + b, 0);
  const weaponBonus = ((research as any)?.weaponsTech || 0) * 5;
  const defenseBonus = ((research as any)?.shieldingTech || 0) * 5;

  const DAMAGE_TYPE_COLORS: Record<string, string> = {
    kinetic: "bg-slate-200 text-slate-800",
    energy: "bg-yellow-100 text-yellow-800",
    explosive: "bg-orange-100 text-orange-800",
    ionic: "bg-blue-100 text-blue-800",
    graviton: "bg-purple-100 text-purple-800",
    nanite: "bg-green-100 text-green-800",
    emp: "bg-teal-100 text-teal-800",
    psionic: "bg-pink-100 text-pink-800",
  };

  const HULL_CLASS_COLORS: Record<string, string> = {
    fighter: "bg-red-100 text-red-800",
    escort: "bg-orange-100 text-orange-800",
    capital: "bg-purple-100 text-purple-800",
    support: "bg-green-100 text-green-800",
    recon: "bg-blue-100 text-blue-800",
    mothership: "bg-yellow-100 text-yellow-800",
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Fleet Combat</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">
            Engage in tactical battles, defend your empire, and plunder resources.
          </p>
        </div>

        {/* Combat Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center overflow-hidden">
                  <img src={TECH_BRANCH_ASSETS.WEAPONS.path} alt="attack" className="w-7 h-7 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-red-600 uppercase">Attack Power</div>
                  <div className="text-xl font-orbitron font-bold text-red-900">
                    +{weaponBonus}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden">
                  <img src={TECH_BRANCH_ASSETS.SHIELDS.path} alt="defense" className="w-7 h-7 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-blue-600 uppercase">Defense Bonus</div>
                  <div className="text-xl font-orbitron font-bold text-blue-900">
                    +{defenseBonus}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center overflow-hidden">
                  <img src={SHIP_ASSETS.FIGHTERS.FIGHTER.path} alt="fleet" className="w-7 h-7 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-green-600 uppercase">Total Fleet</div>
                  <div className="text-xl font-orbitron font-bold text-green-900">
                    {Object.values(units || {}).reduce((a, b) => a + (b as number), 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center overflow-hidden">
                  <img src={TECH_BRANCH_ASSETS.COMPUTING.path} alt="victories" className="w-7 h-7 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = TEMP_THEME_IMAGE; }} />
                </div>
                <div>
                  <div className="text-xs text-purple-600 uppercase">Victories</div>
                  <div className="text-xl font-orbitron font-bold text-purple-900">
                    {battleHistory?.totalVictories || 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Battle Result */}
        {battleResult && (
          <Card className={battleResult.winner === "attacker" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {battleResult.winner === "attacker" ? (
                  <>
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-green-900">Victory!</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-red-600" />
                    <span className="text-red-900">Defeat!</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-slate-600">Rounds</div>
                  <div className="font-bold text-lg">{battleResult.battleResult?.rounds || 0}</div>
                </div>
                <div>
                  <div className="text-slate-600">Plunder</div>
                  <div className="font-mono text-xs">
                    M:{battleResult.plunder?.metal || 0} C:{battleResult.plunder?.crystal || 0} D:{battleResult.plunder?.deuterium || 0}
                  </div>
                </div>
                {battleResult.reportMeta && (
                  <>
                    <div>
                      <div className="text-slate-600">Report Class</div>
                      <Badge variant="outline" className="capitalize mt-1">
                        {battleResult.reportMeta.reportClass}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-slate-600">Context</div>
                      <Badge variant="outline" className="capitalize mt-1 text-xs">
                        {(battleResult.reportMeta.reportSubClass || "").replace(/_/g, " ")}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
              {battleResult.reportMeta && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Report Type</div>
                    <Badge className="bg-blue-600 text-xs capitalize">
                      {(battleResult.reportMeta.reportType || "attack").replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Sub-Type</div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {(battleResult.reportMeta.reportSubType || "").replace(/_/g, " ")}
                    </Badge>
                  </div>
                  {battleResult.reportMeta.mothershipEngaged && (
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Special</div>
                      <Badge className="bg-yellow-500 text-xs">⭐ Mothership Engaged</Badge>
                    </div>
                  )}
                  {battleResult.reportMeta.shieldBreached && (
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Shield</div>
                      <Badge className="bg-red-600 text-xs">🛡 Shield Breached</Badge>
                    </div>
                  )}
                  {(battleResult.reportMeta.attackerWeaponsUsed || []).length > 0 && (
                    <div className="col-span-full">
                      <div className="text-xs text-slate-500 mb-1">Your Weapons Fired</div>
                      <div className="flex flex-wrap gap-1">
                        {(battleResult.reportMeta.attackerWeaponsUsed as string[]).map((w: string) => (
                          <span key={w} className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded capitalize">
                            {w.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {(battleResult.reportMeta.planetDefensesEngaged || []).length > 0 && (
                    <div className="col-span-full">
                      <div className="text-xs text-slate-500 mb-1">Enemy Planet Defenses</div>
                      <div className="flex flex-wrap gap-1">
                        {(battleResult.reportMeta.planetDefensesEngaged as string[]).map((p: string) => (
                          <span key={p} className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded capitalize">
                            {p.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Combat Interface */}
        <Tabs defaultValue="attack" className="w-full">
          <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start flex-wrap">
            <TabsTrigger value="attack" className="font-orbitron">
              <Sword className="w-4 h-4 mr-2" /> Attack
            </TabsTrigger>
            <TabsTrigger value="defend" className="font-orbitron">
              <Shield className="w-4 h-4 mr-2" /> Defend
            </TabsTrigger>
            <TabsTrigger value="weapons" className="font-orbitron">
              <Crosshair className="w-4 h-4 mr-2" /> Weapons
            </TabsTrigger>
            <TabsTrigger value="defenses" className="font-orbitron">
              <ShieldCheck className="w-4 h-4 mr-2" /> Defenses
            </TabsTrigger>
            <TabsTrigger value="ships" className="font-orbitron">
              <Star className="w-4 h-4 mr-2" /> Ship Classes
            </TabsTrigger>
            <TabsTrigger value="history" className="font-orbitron">
              <Trophy className="w-4 h-4 mr-2" /> History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attack" className="mt-6 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sword className="w-5 h-5" /> Fleet Selection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {attackError && (
                    <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700" data-testid="combat-attack-error">
                      {attackError}
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-bold text-slate-900 block mb-2">Target Player ID</label>
                    <Input
                      placeholder="Enter target player ID"
                      value={targetId}
                      onChange={(e) => {
                        setTargetId(e.target.value);
                        if (attackError) setAttackError(null);
                      }}
                      className="font-mono"
                    />
                  </div>

                  <div className="bg-slate-50 p-4 rounded border border-slate-200">
                    <div className="text-sm font-bold text-slate-900 mb-3">Select Units</div>
                    <div className="space-y-3">
                      {unitTypes.map((unitType) => {
                        const owned = (units as any)?.[unitType] || 0;
                        const selected = selectedUnits[unitType] || 0;

                        return (
                          <div key={unitType} className="flex items-center justify-between">
                            <span className="text-sm capitalize">{unitType}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                {owned} available
                              </span>
                              <input
                                type="range"
                                min="0"
                                max={owned}
                                value={selected}
                                onChange={(e) => {
                                  setSelectedUnits((prev) => ({
                                    ...prev,
                                    [unitType]: parseInt(e.target.value),
                                  }));
                                  if (attackError) setAttackError(null);
                                }}
                                className="w-32 h-2 bg-slate-200 rounded cursor-pointer"
                              />
                              <span className="font-mono text-sm bg-white px-2 py-1 rounded border border-slate-200 w-12 text-right">
                                {selected}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    onClick={() => attackMutation.mutate()}
                    disabled={attackMutation.isPending || totalSelected === 0 || !targetId.trim()}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-orbitron"
                  >
                    {attackMutation.isPending ? "Battle In Progress..." : `Launch Attack (${totalSelected} units)`}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Attack Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="bg-blue-50 p-3 rounded border border-blue-200 flex gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-900">
                      Defeated units are permanently lost. Victory grants 30% of defender's resources.
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Selected Units</div>
                    <div className="font-bold text-lg">{totalSelected}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="defend" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Defense Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-sm mb-2">
                    <strong>Current Defense Bonus:</strong> +{defenseBonus}% from shields research
                  </div>
                  <div className="text-xs text-slate-700">
                    Defending is passive - your garrison automatically defends when attacked.
                    Planet defense platforms (Missile Battery, Laser Turret, etc.) are built in
                    the Facilities section and automatically engage attackers.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---- Weapons Tab ---- */}
          <TabsContent value="weapons" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-orbitron font-bold">Weapon Systems</h3>
                <span className="text-sm text-slate-500">({weaponsData?.total || 0} systems catalogued)</span>
              </div>
              <p className="text-sm text-slate-600">
                All offensive armaments available to planets, starships and motherships. Weapon
                stats are boosted by Weapons Technology research (+5% attack per level).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {(weaponsData?.weapons || []).map((w: any) => (
                  <Card key={w.id} className="border-slate-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span>{w.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-normal ${DAMAGE_TYPE_COLORS[w.damageType] || "bg-slate-100 text-slate-700"}`}>
                          {w.damageType}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-2">
                      <p className="text-slate-600">{w.description}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono">
                        <span className="text-slate-500">Damage</span>
                        <span className="font-bold text-red-700">{w.baseDamage} × {w.rateOfFire}/round</span>
                        <span className="text-slate-500">Accuracy</span>
                        <span className="font-bold">{w.accuracy}%</span>
                        <span className="text-slate-500">Range</span>
                        <span className="capitalize">{w.range}</span>
                        <span className="text-slate-500">Shield Pen.</span>
                        <span className="font-bold text-blue-700">{Math.round(w.shieldPenetration * 100)}%</span>
                        <span className="text-slate-500">Armor Pen.</span>
                        <span className="font-bold text-orange-700">{Math.round(w.armorPenetration * 100)}%</span>
                        <span className="text-slate-500">Crit</span>
                        <span className="font-bold text-yellow-700">{w.critChance}% × {w.critMultiplier}x</span>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {(w.compatibleWith || []).map((plat: string) => (
                          <span key={plat} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded capitalize">{plat}</span>
                        ))}
                      </div>
                      <div className="text-slate-500 pt-1">
                        Cost: {w.buildCost.metal}M / {w.buildCost.crystal}C / {w.buildCost.deuterium}D
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ---- Defenses Tab ---- */}
          <TabsContent value="defenses" className="mt-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-orbitron font-bold">Defense Systems</h3>
                  <span className="text-sm text-slate-500">({(defensesData?.defenseSystems || []).length} shield/armor types)</span>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Shield and armor modules fitted to ships and planets. Shielding Technology boosts
                  shield HP (+5% per level). Armour Technology boosts armor HP (+3% per level).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {(defensesData?.defenseSystems || []).map((d: any) => (
                    <Card key={d.id} className="border-blue-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center justify-between">
                          <span>{d.name}</span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{d.shieldType.replace(/_/g, " ")}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs space-y-2">
                        <p className="text-slate-600">{d.description}</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono">
                          <span className="text-slate-500">Hit Points</span>
                          <span className="font-bold text-blue-700">{d.hitPoints.toLocaleString()}</span>
                          <span className="text-slate-500">Recharge/round</span>
                          <span className="font-bold">{d.rechargeRate}</span>
                          <span className="text-slate-500">Dmg Reduction</span>
                          <span className="font-bold text-green-700">{Math.round(d.damageReduction * 100)}%</span>
                        </div>
                        {Object.keys(d.resistances || {}).length > 0 && (
                          <div>
                            <span className="text-slate-500">Resistances: </span>
                            {Object.entries(d.resistances).map(([type, val]: any) => (
                              <span key={type} className="mr-1 text-green-700">{type} +{Math.round(val * 100)}%</span>
                            ))}
                          </div>
                        )}
                        {Object.keys(d.vulnerabilities || {}).length > 0 && (
                          <div>
                            <span className="text-slate-500">Weak vs: </span>
                            {Object.entries(d.vulnerabilities).map(([type, val]: any) => (
                              <span key={type} className="mr-1 text-red-600">{type} -{Math.round(val * 100)}%</span>
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {(d.compatibleWith || []).map((plat: string) => (
                            <span key={plat} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded capitalize">{plat}</span>
                          ))}
                        </div>
                        <div className="text-slate-500">
                          Cost: {d.buildCost.metal}M / {d.buildCost.crystal}C / {d.buildCost.deuterium}D
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-orbitron font-bold">Planet Defense Platforms</h3>
                  <span className="text-sm text-slate-500">({(defensesData?.planetPlatforms || []).length} platform types)</span>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Stationary planetary defense installations. Build them via the Facilities section to
                  protect your planet from incoming fleets.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {(defensesData?.planetPlatforms || []).map((p: any) => (
                    <Card key={p.platformType} className="border-orange-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center justify-between">
                          <span>{p.name}</span>
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full capitalize">
                            {p.subCategory.replace(/_/g, " ")}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs space-y-2">
                        <p className="text-slate-600">{p.description}</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono">
                          <span className="text-slate-500">Hit Points</span>
                          <span className="font-bold">{p.hitPoints.toLocaleString()}</span>
                        </div>
                        {(p.weapons || []).length > 0 && (
                          <div>
                            <span className="text-slate-500">Weapons: </span>
                            {p.weapons.map((wId: string) => (
                              <span key={wId} className="mr-1 bg-red-50 text-red-700 px-1 rounded capitalize">
                                {wId.replace(/([A-Z])/g, " $1").trim()}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="text-slate-500">
                          Cost: {p.buildCost.metal}M / {p.buildCost.crystal}C / {p.buildCost.deuterium}D
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ---- Ship Classes Tab ---- */}
          <TabsContent value="ships" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-orbitron font-bold">Ship Combat Profiles</h3>
                <span className="text-sm text-slate-500">({shipProfilesData?.total || 0} profiles)</span>
              </div>
              <p className="text-sm text-slate-600">
                Each ship class carries a default weapon and defense loadout. Upgrade slots allow
                you to swap in higher-tier systems as your research advances.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {(shipProfilesData?.profiles || []).map((p: any) => (
                  <Card key={p.shipType} className="border-purple-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span>{p.className}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${HULL_CLASS_COLORS[p.hullClass] || "bg-slate-100 text-slate-700"}`}>
                          {p.hullClass}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-2">
                      <div className="text-slate-500 capitalize">Sub-class: {p.subClass.replace(/_/g, " ")}</div>
                      <div className="grid grid-cols-3 gap-2 font-mono text-center">
                        <div className="bg-red-50 rounded p-1">
                          <div className="text-red-600 font-bold">{p.hullPoints.toLocaleString()}</div>
                          <div className="text-slate-500">Hull</div>
                        </div>
                        <div className="bg-blue-50 rounded p-1">
                          <div className="text-blue-600 font-bold">{p.shieldPoints.toLocaleString()}</div>
                          <div className="text-slate-500">Shield</div>
                        </div>
                        <div className="bg-orange-50 rounded p-1">
                          <div className="text-orange-600 font-bold">{p.armorPoints.toLocaleString()}</div>
                          <div className="text-slate-500">Armor</div>
                        </div>
                      </div>
                      {(p.primaryWeapons || []).length > 0 && (
                        <div>
                          <span className="text-slate-500">Primary: </span>
                          {p.primaryWeapons.map((wId: string) => (
                            <span key={wId} className="mr-1 bg-red-50 text-red-700 px-1 rounded capitalize">
                              {wId.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      {(p.secondaryWeapons || []).length > 0 && (
                        <div>
                          <span className="text-slate-500">Secondary: </span>
                          {p.secondaryWeapons.map((wId: string) => (
                            <span key={wId} className="mr-1 bg-yellow-50 text-yellow-700 px-1 rounded capitalize">
                              {wId.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      {(p.defenseSystems || []).length > 0 && (
                        <div>
                          <span className="text-slate-500">Defense: </span>
                          {p.defenseSystems.map((dId: string) => (
                            <span key={dId} className="mr-1 bg-blue-50 text-blue-700 px-1 rounded capitalize">
                              {dId.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="text-slate-400">Upgrade slots: {p.upgradeSlots}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            {battleHistory?.battles && battleHistory.battles.length > 0 ? (
              <div className="space-y-3">
                {battleHistory.battles.map((battle: any) => (
                  <Card key={battle.id} className={battle.result === "victory" ? "bg-green-50" : "bg-red-50"}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-slate-900">{battle.opponent}</div>
                        <div className="text-xs text-slate-500">{new Date(battle.timestamp).toLocaleDateString()}</div>
                        {battle.reportType && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            <Badge variant="outline" className="text-xs capitalize">{(battle.reportType).replace(/_/g, " ")}</Badge>
                            <Badge variant="outline" className="text-xs capitalize">{(battle.reportClass || "").replace(/_/g, " ")}</Badge>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge variant={battle.result === "victory" ? "default" : "destructive"}>
                          {battle.result.toUpperCase()}
                        </Badge>
                        <div className="text-xs text-slate-600 mt-1">-{battle.unitsCasualties} units</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-slate-500">
                  No battles yet. Launch your first attack!
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
