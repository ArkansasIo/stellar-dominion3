import GameLayout from "@/components/layout/GameLayout";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sword, Eye, AlertTriangle, Zap, TrendingUp, TrendingDown, Star, Shield, Globe } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface BattleLogEntry {
  id: string;
  timestamp: string;
  opponent: string;
  result: "victory" | "defeat" | "draw";
  role: "attacker" | "defender";
  battleType: string;
  rounds: number;
  unitsCasualties: number;
  plunder: { metal: number; crystal: number; deuterium: number };
  coordinates?: string;
  // Report classification
  reportType: string;
  reportSubType: string;
  reportClass: string;
  reportSubClass: string;
  // Weapon & defense data
  attackerWeaponsUsed: string[];
  defenderWeaponsUsed: string[];
  planetDefensesEngaged: string[];
  mothershipEngaged: boolean;
  planetaryShieldActive: boolean;
  shieldBreached: boolean;
  shieldsStripped: number;
  armorDamageDealt: number;
  weaponDamageBreakdown: Record<string, number>;
  debris: { metal: number; crystal: number };
}

type BattleHistoryResponse = {
  battles: BattleLogEntry[];
  totalVictories: number;
  totalDefeats: number;
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { credentials: "include" });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || "Request failed");
  }
  return payload as T;
}

const REPORT_CLASS_COLORS: Record<string, string> = {
  decisive: "bg-red-600 text-white",
  major: "bg-orange-500 text-white",
  pyrrhic: "bg-yellow-600 text-white",
  moderate: "bg-blue-500 text-white",
  minor: "bg-slate-400 text-white",
  tactical: "bg-purple-500 text-white",
  draw: "bg-slate-300 text-slate-800",
};

const REPORT_TYPE_LABELS: Record<string, string> = {
  attack: "Attack",
  raid: "Raid",
  espionage: "Espionage",
  colonization: "Colonization",
  moon_attack: "Moon Attack",
  starbase_attack: "Starbase Attack",
  mothership_strike: "Mothership Strike",
  expedition: "Expedition",
  alliance_war: "Alliance War",
  planetary_assault: "Planetary Assault",
};

export default function BattleLogs() {
  const { data, isLoading } = useQuery<BattleHistoryResponse>({
    queryKey: ['combat-battle-history'],
    queryFn: () => fetchJson<BattleHistoryResponse>('/api/combat/battle-history'),
  });

  const battles = data?.battles || [];

  const typeIcons: Record<string, React.ReactNode> = {
    raid: <Sword className="w-4 h-4" />,
    attack: <Zap className="w-4 h-4" />,
    spy: <Eye className="w-4 h-4" />,
    espionage: <Eye className="w-4 h-4" />,
    sabotage: <AlertTriangle className="w-4 h-4" />,
    mothership_strike: <Star className="w-4 h-4 text-yellow-500" />,
    planetary_assault: <Globe className="w-4 h-4 text-orange-500" />,
    moon_attack: <Globe className="w-4 h-4 text-blue-500" />,
  };

  const getWinnerColor = (result: BattleLogEntry["result"]) => {
    if (result === "victory") return "bg-green-50 border-green-200";
    if (result === "defeat") return "bg-red-50 border-red-200";
    return "bg-slate-50 border-slate-200";
  };

  const getWinnerBadge = (result: BattleLogEntry["result"]) => {
    if (result === "victory") return <Badge className="bg-green-500">Victory</Badge>;
    if (result === "defeat") return <Badge className="bg-red-500">Defeat</Badge>;
    return <Badge className="bg-slate-500">Draw</Badge>;
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Battle Logs</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">Review your combat history and raid records.</p>
        </div>

        {/* Summary Stats */}
        {data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-orbitron font-bold text-green-700">{data.totalVictories}</div>
                <div className="text-xs text-green-600 uppercase mt-1">Victories</div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-orbitron font-bold text-red-700">{data.totalDefeats}</div>
                <div className="text-xs text-red-600 uppercase mt-1">Defeats</div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-orbitron font-bold text-yellow-700">
                  {battles.filter(b => b.mothershipEngaged).length}
                </div>
                <div className="text-xs text-yellow-600 uppercase mt-1">Mothership Battles</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-orbitron font-bold text-blue-700">
                  {battles.filter(b => b.reportClass === "decisive").length}
                </div>
                <div className="text-xs text-blue-600 uppercase mt-1">Decisive Battles</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-white border border-slate-200 h-12 w-full justify-start flex-wrap">
            <TabsTrigger value="all" className="font-orbitron">All Battles</TabsTrigger>
            <TabsTrigger value="attacks" className="font-orbitron"><Sword className="w-4 h-4 mr-2" /> Attacks</TabsTrigger>
            <TabsTrigger value="raids" className="font-orbitron"><TrendingUp className="w-4 h-4 mr-2" /> Raids</TabsTrigger>
            <TabsTrigger value="defenses" className="font-orbitron"><TrendingDown className="w-4 h-4 mr-2" /> Defenses</TabsTrigger>
            <TabsTrigger value="espionage" className="font-orbitron"><Eye className="w-4 h-4 mr-2" /> Espionage</TabsTrigger>
            <TabsTrigger value="mothership" className="font-orbitron"><Star className="w-4 h-4 mr-2" /> Mothership</TabsTrigger>
            <TabsTrigger value="decisive" className="font-orbitron"><AlertTriangle className="w-4 h-4 mr-2" /> Decisive</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="text-center py-12 text-slate-500">Loading battle logs...</div>
          ) : battles.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No battle logs available yet.</div>
          ) : (
            <>
              <TabsContent value="all" className="space-y-4 mt-6">
                {battles.map((battle) => (
                  <BattleCard key={battle.id} battle={battle} typeIcons={typeIcons} getWinnerColor={getWinnerColor} getWinnerBadge={getWinnerBadge} />
                ))}
              </TabsContent>

              <TabsContent value="attacks" className="space-y-4 mt-6">
                {battles.filter(b => b.role === "attacker" && b.reportType !== "espionage").map((battle) => (
                  <BattleCard key={battle.id} battle={battle} typeIcons={typeIcons} getWinnerColor={getWinnerColor} getWinnerBadge={getWinnerBadge} />
                ))}
                {battles.filter(b => b.role === "attacker" && b.reportType !== "espionage").length === 0 && (
                  <div className="text-center py-12 text-slate-500">No attack records yet.</div>
                )}
              </TabsContent>

              <TabsContent value="raids" className="space-y-4 mt-6">
                {battles.filter(b => b.reportType === "raid" || b.battleType === "raid").map((battle) => (
                  <BattleCard key={battle.id} battle={battle} typeIcons={typeIcons} getWinnerColor={getWinnerColor} getWinnerBadge={getWinnerBadge} />
                ))}
                {battles.filter(b => b.reportType === "raid" || b.battleType === "raid").length === 0 && (
                  <div className="text-center py-12 text-slate-500">No raid records yet.</div>
                )}
              </TabsContent>

              <TabsContent value="defenses" className="space-y-4 mt-6">
                {battles.filter(b => b.role === "defender").length === 0 ? (
                  <div className="text-center py-12 text-slate-500">Your defense battles will appear here.</div>
                ) : (
                  battles.filter(b => b.role === "defender").map((battle) => (
                    <BattleCard key={battle.id} battle={battle} typeIcons={typeIcons} getWinnerColor={getWinnerColor} getWinnerBadge={getWinnerBadge} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="espionage" className="space-y-4 mt-6">
                {battles.filter(b => b.reportType === "espionage" || b.battleType === "spy").map((battle) => (
                  <BattleCard key={battle.id} battle={battle} typeIcons={typeIcons} getWinnerColor={getWinnerColor} getWinnerBadge={getWinnerBadge} />
                ))}
                {battles.filter(b => b.reportType === "espionage" || b.battleType === "spy").length === 0 && (
                  <div className="text-center py-12 text-slate-500">No espionage records yet.</div>
                )}
              </TabsContent>

              <TabsContent value="mothership" className="space-y-4 mt-6">
                {battles.filter(b => b.mothershipEngaged || b.reportType === "mothership_strike").map((battle) => (
                  <BattleCard key={battle.id} battle={battle} typeIcons={typeIcons} getWinnerColor={getWinnerColor} getWinnerBadge={getWinnerBadge} />
                ))}
                {battles.filter(b => b.mothershipEngaged || b.reportType === "mothership_strike").length === 0 && (
                  <div className="text-center py-12 text-slate-500">No mothership battles yet.</div>
                )}
              </TabsContent>

              <TabsContent value="decisive" className="space-y-4 mt-6">
                {battles.filter(b => b.reportClass === "decisive" || b.reportClass === "major").map((battle) => (
                  <BattleCard key={battle.id} battle={battle} typeIcons={typeIcons} getWinnerColor={getWinnerColor} getWinnerBadge={getWinnerBadge} />
                ))}
                {battles.filter(b => b.reportClass === "decisive" || b.reportClass === "major").length === 0 && (
                  <div className="text-center py-12 text-slate-500">No decisive or major battles yet.</div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </GameLayout>
  );
}

function BattleCard({ battle, typeIcons, getWinnerColor, getWinnerBadge }: any) {
  const reportIcon = typeIcons[battle.reportType] || typeIcons[battle.battleType] || typeIcons.attack;
  const reportClassColor = REPORT_CLASS_COLORS[battle.reportClass] || "bg-slate-400 text-white";

  return (
    <Card className={cn("border cursor-pointer transition-all hover:shadow-md", getWinnerColor(battle.result))}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-slate-400">{reportIcon}</div>
            <div>
              <div className="font-bold text-slate-900">
                You <span className="text-slate-400">vs</span> {battle.opponent}
              </div>
              <div className="text-xs text-slate-500">{formatDistanceToNow(new Date(battle.timestamp), { addSuffix: true })}</div>
              {/* Report type badges */}
              <div className="flex flex-wrap gap-1 mt-1">
                <span className={cn("text-xs px-2 py-0.5 rounded-full capitalize", reportClassColor)}>
                  {battle.reportClass}
                </span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full capitalize">
                  {(REPORT_TYPE_LABELS[battle.reportType] || battle.reportType || "attack")}
                </span>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full capitalize">
                  {(battle.reportSubType || "").replace(/_/g, " ")}
                </span>
                {battle.mothershipEngaged && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">⭐ Mothership</span>
                )}
                {battle.shieldBreached && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">🛡 Shield Breached</span>
                )}
              </div>
            </div>
          </div>
          {getWinnerBadge(battle.result)}
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 text-sm mb-3">
          <div>
            <div className="text-xs text-slate-500 mb-1">Rounds</div>
            <div className="font-mono font-bold text-slate-900">{battle.rounds}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Role</div>
            <div className="font-mono font-bold text-blue-600 capitalize">{battle.role}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Casualties</div>
            <div className="font-mono font-bold text-red-600">{battle.unitsCasualties.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Loot M/C/D</div>
            <div className="font-mono text-xs text-yellow-600">
              {battle.plunder?.metal?.toLocaleString() || 0}/{battle.plunder?.crystal?.toLocaleString() || 0}/{battle.plunder?.deuterium?.toLocaleString() || 0}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Shields Stripped</div>
            <div className="font-mono font-bold text-blue-600">{(battle.shieldsStripped || 0).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Armor Dmg</div>
            <div className="font-mono font-bold text-orange-600">{(battle.armorDamageDealt || 0).toLocaleString()}</div>
          </div>
        </div>

        {/* Sub-class + weapons fired */}
        <div className="flex flex-wrap gap-2 text-xs">
          {battle.reportSubClass && (
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded capitalize">
              📍 {(battle.reportSubClass).replace(/_/g, " ")}
            </span>
          )}
          {(battle.attackerWeaponsUsed || []).slice(0, 4).map((w: string) => (
            <span key={w} className="bg-red-50 text-red-700 px-2 py-0.5 rounded capitalize">
              🗡 {w.replace(/([A-Z])/g, " $1").trim()}
            </span>
          ))}
          {(battle.planetDefensesEngaged || []).length > 0 && (
            <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded">
              🏰 {battle.planetDefensesEngaged.length} planet defense{battle.planetDefensesEngaged.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
