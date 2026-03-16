import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ShieldAlert,
  Hexagon,
  Triangle,
  Orbit,
  Search,
  Rocket,
  Zap,
  Wind,
  Star,
  Layers,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { getPlanetDetails } from "@/lib/planetUtils";

type SystemObjectType =
  | "planet"
  | "asteroid"
  | "meteorite"
  | "comet"
  | "dwarf_planet"
  | "nebula"
  | "blackhole"
  | "station"
  | "debris_field"
  | "ion_storm"
  | "empty";

type SystemObject = {
  type: SystemObjectType;
  name: string;
  owner?: string;
  alliance?: string;
  debris?: { metal: number; crystal: number };
  moon?: boolean;
  class?: string;
};

const POSITIONS_PER_PAGE_OPTIONS = [15, 25, 50, 75, 100] as const;
type PositionsPerPage = (typeof POSITIONS_PER_PAGE_OPTIONS)[number];

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export default function Galaxy() {
  const [universe, setUniverse] = useState("uni1");
  const [galaxy, setGalaxy] = useState(1);
  const [sector, setSector] = useState(4);
  const [system, setSystem] = useState(102);
  const [positionsPerPage, setPositionsPerPage] = useState<PositionsPerPage>(15);

  // Quadrant derived from sector (4 quadrants: Alpha 1-16, Beta 17-32, Gamma 33-48, Delta 49-64)
  const quadrant = Math.ceil(sector / 16);
  const quadrantLabel = ["Alpha", "Beta", "Gamma", "Delta"][Math.min(quadrant - 1, 3)];

  const getSystemData = (pos: number): SystemObject => {
    const universeNum = universe.charCodeAt(universe.length - 1);
    const seed = universeNum * 1000000 + galaxy * 10000 + sector * 100 + system + pos;
    const r = seededRandom(seed);
    const r2 = seededRandom(seed + 9999);
    const r3 = seededRandom(seed + 55555);

    const details = getPlanetDetails(seed);

    if (pos === 8 && galaxy === 1 && sector === 4 && system === 102) {
      return { type: "planet", name: "Homeworld", owner: "Commander", alliance: "ADMIN", moon: true, class: "M" };
    }

    if (r > 0.97) return { type: "blackhole", name: "Singularity", debris: { metal: Math.floor(r2 * 80000 + 20000), crystal: Math.floor(r3 * 60000 + 10000) } };
    if (r > 0.94) return { type: "ion_storm", name: `Ion Storm ${pos}-${galaxy}` };
    if (r > 0.91) return { type: "nebula", name: r2 > 0.5 ? "Ion Cloud" : "Gas Nebula" };
    if (r > 0.87) return { type: "comet", name: `Comet C/${system}-${pos}`, debris: { metal: Math.floor(r2 * 3000 + 500), crystal: Math.floor(r3 * 2000 + 200) } };
    if (r > 0.83) return { type: "asteroid", name: `Asteroid Belt ${pos}`, debris: { metal: Math.floor(r2 * 8000 + 1000), crystal: Math.floor(r3 * 3000 + 500) } };
    if (r > 0.80) return { type: "meteorite", name: `Meteorite Cluster ${pos}`, debris: { metal: Math.floor(r2 * 1500 + 200), crystal: Math.floor(r3 * 800 + 100) } };
    if (r > 0.77) return { type: "debris_field", name: `Debris Field ${pos}`, debris: { metal: Math.floor(r2 * 12000 + 2000), crystal: Math.floor(r3 * 5000 + 1000) } };
    if (r > 0.73) return { type: "station", name: r2 > 0.5 ? "Pirate Outpost" : "Trading Post", owner: r2 > 0.5 ? "Pirates" : "Merchant Guild" };
    if (r > 0.68) return { type: "dwarf_planet", name: `Dwarf ${galaxy}-${sector}-${pos}`, debris: { metal: Math.floor(r2 * 2000), crystal: Math.floor(r3 * 1000) } };
    if (r > 0.40) {
      const playerNum = Math.floor(r2 * 9000 + 1000);
      const alliances = ["NOOBS", "VEGA", "IRON", "SOLAR", "NEXUS", undefined, undefined];
      return {
        type: "planet",
        name: r2 > 0.85 ? `Colony ${pos}` : `Planet ${galaxy}:${sector}:${system}:${pos}`,
        owner: r2 > 0.9 ? `Player_${playerNum}` : undefined,
        alliance: r2 > 0.9 && r3 > 0.4 ? alliances[Math.floor(r3 * alliances.length)] : undefined,
        moon: r3 > 0.55,
        class: details.class,
      };
    }
    return { type: "empty", name: "" };
  };

  const objectBadge = (data: SystemObject) => {
    switch (data.type) {
      case "asteroid":     return <Badge variant="outline" className="border-slate-400 text-slate-600">Asteroid Belt</Badge>;
      case "meteorite":    return <Badge variant="outline" className="border-orange-400 text-orange-600">Meteorite</Badge>;
      case "comet":        return <Badge variant="outline" className="border-cyan-400 text-cyan-600">Comet</Badge>;
      case "dwarf_planet": return <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border border-yellow-300">Dwarf Planet</Badge>;
      case "blackhole":    return <Badge variant="destructive" className="bg-black hover:bg-black text-white">Singularity</Badge>;
      case "nebula":       return <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100">Nebula</Badge>;
      case "ion_storm":    return <Badge className="bg-yellow-500 text-black hover:bg-yellow-500">Ion Storm</Badge>;
      case "station":      return <Badge variant="outline" className="border-red-400 text-red-600">{data.owner === "Pirates" ? "Pirate Base" : "Station"}</Badge>;
      case "debris_field": return <Badge variant="secondary" className="bg-slate-100 text-slate-600 border border-slate-300">Debris Field</Badge>;
      case "planet":       return (
        <Badge variant="secondary" className={cn(
          data.class === "M" ? "bg-green-100 text-green-700" :
          data.class === "Y" ? "bg-red-100 text-red-700" :
          data.class === "J" ? "bg-orange-100 text-orange-700" :
          "bg-blue-100 text-blue-700"
        )}>Class {data.class}</Badge>
      );
      default: return null;
    }
  };

  const objectVisual = (data: SystemObject) => {
    switch (data.type) {
      case "planet":
        return <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-800 shadow-sm border border-slate-200" />;
      case "asteroid":
        return <div className="w-10 h-10 flex items-center justify-center"><div className="w-8 h-8 rounded bg-slate-300 rotate-45 border border-slate-400" /></div>;
      case "meteorite":
        return <div className="w-10 h-10 flex items-center justify-center"><div className="w-6 h-6 rounded-sm bg-orange-300 rotate-12 border border-orange-500 shadow-sm" /></div>;
      case "comet":
        return <div className="w-10 h-10 flex items-center justify-center"><Star className="w-8 h-8 text-cyan-400 fill-cyan-100" /></div>;
      case "dwarf_planet":
        return <div className="w-10 h-10 flex items-center justify-center"><div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 border border-amber-400" /></div>;
      case "blackhole":
        return (
          <div className="w-10 h-10 rounded-full bg-black shadow-[0_0_10px_rgba(0,0,0,0.5)] border border-slate-800 flex items-center justify-center">
            <div className="w-9 h-9 rounded-full border border-white/20" />
          </div>
        );
      case "nebula":
        return <div className="w-10 h-10 rounded-full bg-purple-100 blur-sm opacity-80" />;
      case "ion_storm":
        return <div className="w-10 h-10 flex items-center justify-center"><Zap className="w-8 h-8 text-yellow-500 fill-yellow-200" /></div>;
      case "station":
        return <div className="w-10 h-10 flex items-center justify-center"><Hexagon className="w-8 h-8 text-slate-600 fill-slate-200" /></div>;
      case "debris_field":
        return <div className="w-10 h-10 flex items-center justify-center"><Layers className="w-8 h-8 text-slate-400" /></div>;
      default:
        return null;
    }
  };

  const isHarvestable = (type: SystemObjectType) =>
    ["asteroid", "meteorite", "comet", "dwarf_planet", "debris_field"].includes(type);

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Galaxy View</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">
            Coordinate: <span className="font-mono text-primary font-bold">[{galaxy}:{sector}:{system}]</span>
            {" · "}Quadrant <span className="font-mono text-blue-600 font-bold">{quadrantLabel}-{quadrant}</span>
            {" · "}Scan surrounding sectors and systems for resources and anomalies.
          </p>
        </div>

        {/* Navigation Bar */}
        <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-wrap justify-center items-center gap-4 shadow-sm">
          {/* Universe Selector */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase text-xs font-bold">Universe</span>
            <Select value={universe} onValueChange={setUniverse}>
              <SelectTrigger className="w-[140px] bg-slate-50 border-slate-200 text-slate-900 h-8">
                <SelectValue placeholder="Select Universe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uni1">Nexus-Alpha</SelectItem>
                <SelectItem value="uni2">Cyborg-Beta</SelectItem>
                <SelectItem value="uni3">Quantum-Gamma</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block" />

          {/* Galaxy Nav */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase text-xs font-bold">Galaxy</span>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setGalaxy(g => Math.max(1, g - 1))}><ChevronLeft className="w-4 h-4" /></Button>
              <Input className="w-14 h-8 text-center font-mono bg-slate-50 border-slate-200 text-slate-900" value={galaxy} onChange={(e) => setGalaxy(parseInt(e.target.value) || 1)} />
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setGalaxy(g => Math.min(256, g + 1))}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>

          {/* Sector Nav */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase text-xs font-bold text-primary">Sector</span>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSector(s => Math.max(1, s - 1))}><ChevronLeft className="w-4 h-4" /></Button>
              <Input className="w-14 h-8 text-center font-mono bg-slate-50 border-primary/30 text-primary font-bold" value={sector} onChange={(e) => setSector(parseInt(e.target.value) || 1)} />
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSector(s => Math.min(64, s + 1))}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>

          {/* System Nav */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase text-xs font-bold">System</span>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSystem(s => Math.max(1, s - 1))}><ChevronLeft className="w-4 h-4" /></Button>
              <Input className="w-16 h-8 text-center font-mono bg-slate-50 border-slate-200 text-slate-900" value={system} onChange={(e) => setSystem(parseInt(e.target.value) || 1)} />
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSystem(s => Math.min(500, s + 1))}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block" />

          {/* Positions per Page */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase text-xs font-bold">Per Page</span>
            <Select value={String(positionsPerPage)} onValueChange={(v) => setPositionsPerPage(Number(v) as PositionsPerPage)}>
              <SelectTrigger className="w-[80px] bg-slate-50 border-slate-200 text-slate-900 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POSITIONS_PER_PAGE_OPTIONS.map(n => (
                  <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button className="ml-auto bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 h-8 text-xs uppercase tracking-wider">
            <Orbit className="w-3 h-3 mr-2" /> Expedition
          </Button>
        </div>

        {/* Coordinate display strip */}
        <div className="bg-slate-900 text-white px-4 py-2 rounded-lg flex flex-wrap items-center gap-4 text-xs font-mono shadow">
          <span className="text-slate-400 uppercase tracking-widest">Coordinate</span>
          <span className="text-blue-400 font-bold text-base">[{galaxy}:{sector}:{system}]</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Quadrant</span>
          <span className="text-cyan-400 font-bold">{quadrantLabel}-{quadrant}</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Positions shown</span>
          <span className="text-green-400 font-bold">{positionsPerPage}</span>
          <span className="text-slate-500 ml-auto hidden md:block">OGame-compatible: [Galaxy:Sector:System:Position]</span>
        </div>

        {/* Galaxy Table */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 border-slate-200 hover:bg-slate-50">
                <TableHead className="text-center w-[90px] text-slate-700">Pos</TableHead>
                <TableHead className="w-[80px] text-slate-700">Visual</TableHead>
                <TableHead className="text-slate-700">Name / Coordinates</TableHead>
                <TableHead className="text-slate-700">Type / Class</TableHead>
                <TableHead className="text-slate-700">Moon / Resources</TableHead>
                <TableHead className="text-slate-700">Player / Status</TableHead>
                <TableHead className="text-slate-700">Alliance</TableHead>
                <TableHead className="text-right text-slate-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: positionsPerPage }).map((_, i) => {
                const pos = i + 1;
                const data = getSystemData(pos);
                const isMe = data.owner === "Commander";

                return (
                  <TableRow key={pos} className="border-slate-100 hover:bg-slate-50 transition-colors">
                    <TableCell className="text-center font-mono text-muted-foreground text-xs">
                      <div className="font-bold text-slate-700">{pos}</div>
                      <div className="text-[10px] text-slate-400">[{galaxy}:{sector}:{system}:{pos}]</div>
                    </TableCell>

                    <TableCell>{objectVisual(data)}</TableCell>

                    <TableCell>
                      {data.type !== "empty" ? (
                        <div className={cn("font-medium", isMe ? "text-primary" : "text-slate-700")}>
                          {data.name}
                        </div>
                      ) : (
                        <span className="text-muted-foreground/30 italic text-sm">-- Empty Space --</span>
                      )}
                    </TableCell>

                    <TableCell>{objectBadge(data)}</TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 flex-wrap">
                        {data.moon && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <div className="w-3 h-3 rounded-full bg-slate-300 border border-slate-400" />
                            <span>Moon</span>
                          </div>
                        )}
                        {data.debris && (
                          <div className="flex items-center gap-1 text-xs text-yellow-600 font-mono" title={`Metal: ${data.debris.metal.toLocaleString()}, Crystal: ${data.debris.crystal.toLocaleString()}`}>
                            <Triangle className="w-3 h-3 fill-yellow-600 rotate-180" />
                            <span>{(data.debris.metal / 1000).toFixed(1)}k / {(data.debris.crystal / 1000).toFixed(1)}k</span>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      {data.owner && (
                        <span className={cn(
                          "font-medium text-sm",
                          isMe ? "text-green-600" : data.type === "station" ? "text-red-600" : "text-red-500"
                        )}>
                          {data.owner}
                          {data.type === "station" && <span className="text-xs ml-1">(Hostile)</span>}
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      {data.alliance && <span className="text-blue-500 font-bold text-sm">[{data.alliance}]</span>}
                    </TableCell>

                    <TableCell className="text-right">
                      {data.type !== "empty" && !isMe && (
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-blue-50 hover:text-blue-600" title="Scan" onClick={() => alert(`Scanning ${data.name} at [${galaxy}:${sector}:${system}:${pos}]`)}>
                            <Search className="w-3.5 h-3.5" />
                          </Button>
                          {(data.type === "planet" || data.type === "station") && (
                            <>
                              <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-blue-50 hover:text-blue-600" title="Message" onClick={() => alert("Messaging " + data.name)}><MessageSquare className="w-3.5 h-3.5" /></Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-red-50 hover:text-red-600" title="Attack" onClick={() => alert("Attacking " + data.name)}><ShieldAlert className="w-3.5 h-3.5" /></Button>
                            </>
                          )}
                          {isHarvestable(data.type) && (
                            <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-yellow-50 hover:text-yellow-600" title="Harvest / Send Fleet" onClick={() => alert(`Launching fleet to ${data.name}`)}><Rocket className="w-3.5 h-3.5" /></Button>
                          )}
                          {data.type === "ion_storm" && (
                            <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-yellow-50 hover:text-yellow-600" title="Monitor Storm" onClick={() => alert("Monitoring ion storm")}><Wind className="w-3.5 h-3.5" /></Button>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Legend */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-widest">Object Types Legend</h3>
          <div className="flex flex-wrap gap-2 text-xs">
            {([
              ["bg-green-100 text-green-700 border-green-200",   "Planet"],
              ["bg-slate-100 text-slate-600 border-slate-200",   "Asteroid Belt"],
              ["bg-orange-100 text-orange-600 border-orange-200","Meteorite"],
              ["bg-cyan-100 text-cyan-600 border-cyan-200",      "Comet"],
              ["bg-yellow-50 text-yellow-700 border-yellow-300", "Dwarf Planet"],
              ["bg-purple-100 text-purple-700 border-purple-200","Nebula"],
              ["bg-black text-white border-gray-800",             "Black Hole"],
              ["bg-yellow-500 text-black border-yellow-600",     "Ion Storm"],
              ["bg-red-100 text-red-600 border-red-200",         "Station / Base"],
              ["bg-slate-100 text-slate-600 border-slate-300",   "Debris Field"],
            ] as const).map(([cls, label]) => (
              <span key={label} className={cn("px-2 py-0.5 rounded-full border font-medium", cls)}>{label}</span>
            ))}
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
