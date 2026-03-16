import GameLayout from "@/components/layout/GameLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  MapPin,
  Zap,
  ChevronRight,
  Map,
  Grid3x3,
  Hexagon,
  LayoutGrid,
} from "lucide-react";
import { useState } from "react";

interface Planet {
  id: string;
  name: string;
  class: string;
  owner?: string;
  alliance?: string;
  coordinates: string;
}

interface System {
  id: string;
  name: string;
  coordinates: string;
  planets: Planet[];
  activity: number;
}

interface Sector {
  id: string;
  name: string;
  coordinates: string;
  systems: System[];
  quadrant: 1 | 2 | 3 | 4;
}

interface Quadrant {
  id: number;
  name: string;
  label: string;
  color: string;
}

interface Galaxy {
  id: string;
  name: string;
  coordinates: string;
  sectors: Sector[];
}

// 4 quadrants per galaxy, each covering sectors 1-16, 17-32, 33-48, 49-64
const QUADRANTS: Quadrant[] = [
  { id: 1, name: "Quadrant Alpha", label: "α", color: "text-blue-600" },
  { id: 2, name: "Quadrant Beta",  label: "β", color: "text-purple-600" },
  { id: 3, name: "Quadrant Gamma", label: "γ", color: "text-green-600" },
  { id: 4, name: "Quadrant Delta", label: "δ", color: "text-orange-600" },
];

const GALAXIES: Galaxy[] = [
  {
    id: "gal1",
    name: "Nexus-Alpha",
    coordinates: "[1:0:0]",
    sectors: [
      {
        id: "sec1",
        name: "Sector 1",
        coordinates: "[1:1:0]",
        quadrant: 1,
        systems: [
          {
            id: "sys1",
            name: "Sol System",
            coordinates: "[1:1:100]",
            activity: 95,
            planets: [
              { id: "pl1", name: "Mercury", class: "R", coordinates: "[1:1:100:1]", owner: "Neutral" },
              { id: "pl2", name: "Venus", class: "V", coordinates: "[1:1:100:2]", owner: "Neutral" },
              { id: "pl3", name: "Earth", class: "M", coordinates: "[1:1:100:3]", owner: "Commander", alliance: "ADMIN" },
              { id: "pl4", name: "Mars", class: "D", coordinates: "[1:1:100:4]", owner: "Player_412", alliance: "SETTLERS" },
            ]
          },
          {
            id: "sys2",
            name: "Kepler System",
            coordinates: "[1:1:205]",
            activity: 72,
            planets: [
              { id: "pl5", name: "Kepler-452b", class: "M", coordinates: "[1:1:205:1]", owner: "Player_891", alliance: "EXPLORERS" },
              { id: "pl6", name: "Kepler-186f", class: "G", coordinates: "[1:1:205:2]", owner: "NPC_Station" },
            ]
          }
        ]
      },
      {
        id: "sec2",
        name: "Sector 2",
        coordinates: "[1:2:0]",
        quadrant: 1,
        systems: [
          {
            id: "sys3",
            name: "Andromeda Crossing",
            coordinates: "[1:2:156]",
            activity: 45,
            planets: [
              { id: "pl7", name: "Andromeda Prime", class: "M", coordinates: "[1:2:156:1]", owner: "Pirate Gang" },
              { id: "pl8", name: "Andromeda Minor", class: "A", coordinates: "[1:2:156:2]" },
            ]
          }
        ]
      },
      {
        id: "sec3-b",
        name: "Sector 17",
        coordinates: "[1:17:0]",
        quadrant: 2,
        systems: [
          {
            id: "sys5",
            name: "Vega Outpost",
            coordinates: "[1:17:44]",
            activity: 60,
            planets: [
              { id: "pl10", name: "Vega Prime", class: "M", coordinates: "[1:17:44:1]", owner: "Player_223", alliance: "VEGA" },
              { id: "pl11", name: "Vega Minor", class: "K", coordinates: "[1:17:44:2]" },
            ]
          }
        ]
      },
      {
        id: "sec4-c",
        name: "Sector 33",
        coordinates: "[1:33:0]",
        quadrant: 3,
        systems: [
          {
            id: "sys6",
            name: "Iron Forge",
            coordinates: "[1:33:77]",
            activity: 80,
            planets: [
              { id: "pl12", name: "Forge World", class: "V", coordinates: "[1:33:77:1]", owner: "Player_774", alliance: "IRON" },
            ]
          }
        ]
      },
      {
        id: "sec5-d",
        name: "Sector 49",
        coordinates: "[1:49:0]",
        quadrant: 4,
        systems: [
          {
            id: "sys7",
            name: "Deep Delta",
            coordinates: "[1:49:312]",
            activity: 22,
            planets: [
              { id: "pl13", name: "Delta Drift", class: "D", coordinates: "[1:49:312:1]" },
              { id: "pl14", name: "Delta Ice", class: "T", coordinates: "[1:49:312:2]" },
            ]
          }
        ]
      }
    ]
  },
  {
    id: "gal2",
    name: "Cyborg-Beta",
    coordinates: "[2:0:0]",
    sectors: [
      {
        id: "sec-b1",
        name: "Sector 1",
        coordinates: "[2:1:0]",
        quadrant: 1,
        systems: [
          {
            id: "sys-b1",
            name: "Binary Star",
            coordinates: "[2:1:98]",
            activity: 88,
            planets: [
              { id: "pl9", name: "Twin Alpha", class: "T", coordinates: "[2:1:98:1]", owner: "TechCorp", alliance: "INDUSTRIAL" },
            ]
          }
        ]
      },
      {
        id: "sec-b2",
        name: "Sector 18",
        coordinates: "[2:18:0]",
        quadrant: 2,
        systems: [
          {
            id: "sys-b2",
            name: "Nexus Hub",
            coordinates: "[2:18:500]",
            activity: 55,
            planets: [
              { id: "pl15", name: "Hub Core", class: "M", coordinates: "[2:18:500:1]", owner: "Player_101", alliance: "NEXUS" },
            ]
          }
        ]
      }
    ]
  },
  {
    id: "gal3",
    name: "Quantum-Gamma",
    coordinates: "[3:0:0]",
    sectors: [
      {
        id: "sec-g1",
        name: "Sector 1",
        coordinates: "[3:1:0]",
        quadrant: 1,
        systems: [
          {
            id: "sys-g1",
            name: "Quantum Gate",
            coordinates: "[3:1:1]",
            activity: 99,
            planets: [
              { id: "pl16", name: "Gate Keeper", class: "J", coordinates: "[3:1:1:1]", owner: "Ancient AI" },
            ]
          }
        ]
      }
    ]
  }
];

export default function Universe() {
  const [selectedGalaxy, setSelectedGalaxy] = useState<Galaxy | null>(GALAXIES[0]);
  const [selectedQuadrant, setSelectedQuadrant] = useState<number | null>(1);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(GALAXIES[0].sectors[0]);
  const [selectedSystem, setSelectedSystem] = useState<System | null>(GALAXIES[0].sectors[0].systems[0]);
  const [searchCoordinates, setSearchCoordinates] = useState("");

  const handleGalaxySelect = (galaxy: Galaxy) => {
    setSelectedGalaxy(galaxy);
    setSelectedQuadrant(1);
    const firstSector = galaxy.sectors.find(s => s.quadrant === 1) || galaxy.sectors[0];
    setSelectedSector(firstSector);
    setSelectedSystem(firstSector.systems[0]);
  };

  const handleQuadrantSelect = (qid: number) => {
    setSelectedQuadrant(qid);
    if (selectedGalaxy) {
      const firstSector = selectedGalaxy.sectors.find(s => s.quadrant === qid) || selectedGalaxy.sectors[0];
      setSelectedSector(firstSector);
      setSelectedSystem(firstSector.systems[0]);
    }
  };

  const handleSectorSelect = (sector: Sector) => {
    setSelectedSector(sector);
    setSelectedSystem(sector.systems[0]);
  };

  const getPlanetColor = (planetClass: string) => {
    const colors: Record<string, string> = {
      M: "bg-emerald-500",
      G: "bg-amber-400",
      D: "bg-slate-400",
      R: "bg-orange-600",
      V: "bg-yellow-500",
      T: "bg-cyan-500",
      A: "bg-gray-300"
    };
    return colors[planetClass] || "bg-blue-400";
  };

  const getActivityColor = (activity: number) => {
    if (activity > 75) return "text-red-600";
    if (activity > 50) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <GameLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-slate-900">Universe Map</h2>
          <p className="text-muted-foreground font-rajdhani text-lg">
            Navigate galaxies, quadrants, sectors, systems, and planets across the known universe.
            {selectedGalaxy && selectedSector && (
              <span className="ml-2 font-mono text-primary font-bold" aria-label={`${selectedGalaxy.name} to Quadrant ${selectedQuadrant} to ${selectedSector.name}`}>
                [{selectedGalaxy.coordinates} &rsaquo; Q{selectedQuadrant} &rsaquo; {selectedSector.coordinates}]
              </span>
            )}
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
          <div className="flex gap-2 items-center">
            <MapPin className="w-5 h-5 text-slate-600" />
            <Input
              placeholder="Search by coordinates (e.g., [1:1:100:3])"
              value={searchCoordinates}
              onChange={(e) => setSearchCoordinates(e.target.value)}
              className="flex-1 bg-slate-50 border-slate-200"
              data-testid="input-search-coordinates"
            />
          </div>
        </div>

        {/* Hierarchy: Galaxy → Quadrant → Sector → System → Planet */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Galaxies List */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-600" />
                Galaxies
              </CardTitle>
              <CardDescription className="text-xs">Known galaxies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {GALAXIES.map(gal => (
                <Button
                  key={gal.id}
                  variant={selectedGalaxy?.id === gal.id ? "default" : "outline"}
                  className="w-full justify-between text-left h-auto py-2 text-sm"
                  onClick={() => handleGalaxySelect(gal)}
                  data-testid={`button-galaxy-${gal.id}`}
                >
                  <div>
                    <p className="font-semibold">{gal.name}</p>
                    <p className="text-xs opacity-75 font-mono">{gal.coordinates}</p>
                  </div>
                  <ChevronRight className="w-3 h-3 flex-shrink-0" />
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Quadrants */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-slate-600" />
                Quadrants
              </CardTitle>
              <CardDescription className="text-xs">{selectedGalaxy?.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {QUADRANTS.map(q => {
                const sectorCount = selectedGalaxy?.sectors.filter(s => s.quadrant === q.id).length || 0;
                return (
                  <Button
                    key={q.id}
                    variant={selectedQuadrant === q.id ? "default" : "outline"}
                    className="w-full justify-between text-left h-auto py-2 text-sm"
                    onClick={() => handleQuadrantSelect(q.id)}
                    data-testid={`button-quadrant-${q.id}`}
                    disabled={sectorCount === 0}
                  >
                    <div>
                      <p className="font-semibold flex items-center gap-1">
                        <span className={q.color}>{q.label}</span> {q.name.replace("Quadrant ", "")}
                      </p>
                      <p className="text-xs opacity-75">Sectors {(q.id - 1) * 16 + 1}–{q.id * 16}</p>
                    </div>
                    <Badge variant="outline" className="text-xs ml-1">{sectorCount}</Badge>
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Sectors List */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Grid3x3 className="w-4 h-4 text-slate-600" />
                Sectors
              </CardTitle>
              <CardDescription className="text-xs">
                {QUADRANTS.find(q => q.id === selectedQuadrant)?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedGalaxy?.sectors
                .filter(s => s.quadrant === selectedQuadrant)
                .map(sec => (
                  <Button
                    key={sec.id}
                    variant={selectedSector?.id === sec.id ? "default" : "outline"}
                    className="w-full justify-between text-left h-auto py-2 text-sm"
                    onClick={() => handleSectorSelect(sec)}
                    data-testid={`button-sector-${sec.id}`}
                  >
                    <div>
                      <p className="font-semibold">{sec.name}</p>
                      <p className="text-xs opacity-75 font-mono">{sec.coordinates}</p>
                    </div>
                    <ChevronRight className="w-3 h-3 flex-shrink-0" />
                  </Button>
                ))}
            </CardContent>
          </Card>

          {/* Systems List */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Hexagon className="w-4 h-4 text-slate-600" />
                Systems
              </CardTitle>
              <CardDescription className="text-xs">{selectedSector?.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedSector?.systems.map(sys => (
                <Button
                  key={sys.id}
                  variant={selectedSystem?.id === sys.id ? "default" : "outline"}
                  className="w-full justify-between text-left h-auto py-2 text-sm"
                  onClick={() => setSelectedSystem(sys)}
                  data-testid={`button-system-${sys.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{sys.name}</p>
                    <div className="flex items-center gap-1 text-xs opacity-75 font-mono">
                      <MapPin className="w-3 h-3" />
                      {sys.coordinates}
                    </div>
                  </div>
                  <div className={`text-xs font-bold ml-1 ${getActivityColor(sys.activity)}`}>
                    {sys.activity}%
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Planets in Selected System */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Map className="w-4 h-4 text-slate-600" />
                Planets
              </CardTitle>
              <CardDescription className="text-xs">{selectedSystem?.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedSystem?.planets.map(planet => (
                <div
                  key={planet.id}
                  className="p-2 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
                  data-testid={`card-planet-${planet.id}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getPlanetColor(planet.class)}`} />
                      <div>
                        <p className="font-semibold text-xs">{planet.name}</p>
                        <p className="text-[10px] text-slate-500">{planet.class}-Class</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{planet.class}</Badge>
                  </div>
                  <div className="text-[10px] space-y-0.5">
                    <p className="text-slate-600 font-mono">{planet.coordinates}</p>
                    {planet.owner && (
                      <p className="text-slate-600">
                        <span className="font-semibold">{planet.owner}</span>
                        {planet.alliance && <span className="text-blue-500 ml-1">[{planet.alliance}]</span>}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information Panel */}
        {selectedSystem && (
          <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div>
                  <p className="text-xs text-slate-600 uppercase font-bold mb-1">Galaxy</p>
                  <p className="text-base font-bold text-slate-900">{selectedGalaxy?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 uppercase font-bold mb-1">Quadrant</p>
                  <p className="text-base font-bold text-slate-900">{QUADRANTS.find(q => q.id === selectedQuadrant)?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 uppercase font-bold mb-1">System Name</p>
                  <p className="text-base font-bold text-slate-900">{selectedSystem.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 uppercase font-bold mb-1">Coordinates</p>
                  <p className="text-base font-mono text-slate-900">{selectedSystem.coordinates}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 uppercase font-bold mb-1">Activity</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${selectedSystem.activity > 75 ? "bg-red-500" : selectedSystem.activity > 50 ? "bg-yellow-500" : "bg-green-500"}`}
                        style={{ width: `${selectedSystem.activity}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-900 text-sm">{selectedSystem.activity}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </GameLayout>
  );
}
