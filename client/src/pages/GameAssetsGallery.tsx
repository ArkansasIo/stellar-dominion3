import { useMemo, useState } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ASSET_SIZES,
  BACKGROUND_ASSETS,
  MENU_ASSETS,
  OGAMEX_ASSET_COLLECTIONS,
  PLANET_ASSETS,
  SHIP_ASSETS,
  TECH_BRANCH_ASSETS,
} from "@shared/config";
import { Check, Copy, Image, Layers3, LayoutGrid, List, Package } from "lucide-react";

type AssetCategory = "menu" | "planets" | "ships" | "tech_branches" | "backgrounds" | "ogamex";

type AssetItem = {
  id: string;
  name: string;
  path: string;
  description: string;
  sizeLabel: string;
  tint?: string;
  sourcePath?: string;
  tags?: string[];
};

const CATEGORY_LABELS: Record<AssetCategory, string> = {
  menu: "Menu & UI",
  planets: "Planets",
  ships: "Ships",
  tech_branches: "Tech Branches",
  backgrounds: "Backgrounds",
  ogamex: "OGameX Pack",
};

function normalizeCoreAsset(asset: {
  id: string;
  name: string;
  path: string;
  description: string;
  size: { name: string };
  color?: string;
  bgColor?: string;
}): AssetItem {
  return {
    id: asset.id,
    name: asset.name,
    path: asset.path,
    description: asset.description,
    sizeLabel: asset.size.name,
    tint: asset.color || asset.bgColor,
  };
}

function getAssetsForCategory(category: AssetCategory): AssetItem[] {
  switch (category) {
    case "menu":
      return [
        ...Object.values(MENU_ASSETS.NAVIGATION),
        ...Object.values(MENU_ASSETS.BUILDINGS),
        ...Object.values(MENU_ASSETS.RESOURCES),
        ...Object.values(MENU_ASSETS.STATUS),
      ].map(normalizeCoreAsset);
    case "planets":
      return [
        ...Object.values(PLANET_ASSETS.TERRESTRIAL),
        ...Object.values(PLANET_ASSETS.GAS_GIANTS),
        ...Object.values(PLANET_ASSETS.EXOTIC),
      ].map(normalizeCoreAsset);
    case "ships":
      return [
        ...Object.values(SHIP_ASSETS.FIGHTERS),
        ...Object.values(SHIP_ASSETS.CAPITALS),
        ...Object.values(SHIP_ASSETS.SPECIAL),
      ].map(normalizeCoreAsset);
    case "tech_branches":
      return Object.values(TECH_BRANCH_ASSETS).map(normalizeCoreAsset);
    case "backgrounds":
      return Object.values(BACKGROUND_ASSETS).map(normalizeCoreAsset);
    case "ogamex":
      return OGAMEX_ASSET_COLLECTIONS.map((asset) => ({
        id: asset.id,
        name: asset.name,
        path: asset.path,
        description: asset.description,
        sizeLabel: "Imported OGameX",
        sourcePath: asset.sourcePath,
        tags: asset.tags,
      }));
    default:
      return [];
  }
}

export default function GameAssetsGallery() {
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>("ogamex");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const assets = useMemo(() => getAssetsForCategory(selectedCategory), [selectedCategory]);

  const copyValue = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <GameLayout>
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div
            className="border-b border-slate-200 bg-cover bg-center px-6 py-6 text-white"
            style={{
              backgroundImage:
                "linear-gradient(rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.82)), url(/assets/ogamex/backgrounds/background-large.jpg)",
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
                  <Package className="h-4 w-4" />
                  Assets Vault
                </div>
                <h2 className="font-orbitron text-3xl font-bold">Game Assets Gallery</h2>
                <p className="max-w-3xl text-sm text-slate-200">
                  Unified art registry for the live UI plus a curated OGameX import pack now linked into the in-game shell.
                </p>
              </div>
              <div className="rounded-xl border border-cyan-200/20 bg-white/10 px-4 py-3 text-right">
                <div className="text-[10px] uppercase tracking-[0.24em] text-slate-300">Imported OGameX Assets</div>
                <div className="mt-1 font-orbitron text-2xl font-bold text-white">{OGAMEX_ASSET_COLLECTIONS.length}</div>
              </div>
            </div>
          </div>
          <div className="grid gap-4 px-6 py-5 md:grid-cols-3">
            <Card className="border-slate-200 bg-slate-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-[0.24em] text-slate-500">Asset Standards</CardTitle>
                <CardDescription>{Object.keys(ASSET_SIZES).length} size profiles available</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Use one shared asset registry for menus, planets, ships, technology branches, and imported OGameX reference art.
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-slate-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-[0.24em] text-slate-500">Linked Layout</CardTitle>
                <CardDescription>Shared sidebar and submenu shell active</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                This page now uses the same `GameLayout` as the rest of the in-game routes, so menus and submenus stay visible here too.
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-slate-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-[0.24em] text-slate-500">Imported Source</CardTitle>
                <CardDescription>Vendored from `ogamex-source/public/img`</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Selected OGameX art is copied into `client/public/assets/ogamex` so the Vite client can serve it directly in the running game.
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CATEGORY_LABELS) as AssetCategory[]).map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="h-9"
                >
                  {CATEGORY_LABELS[category]}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{assets.length} assets</Badge>
              <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")}>
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")}>
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 xl:grid-cols-3" : "space-y-4"}>
          {assets.map((asset) => (
            <Card key={asset.id} className="overflow-hidden border-slate-200 bg-white shadow-sm">
              <CardContent className={viewMode === "grid" ? "p-0" : "p-4"}>
                <div className={viewMode === "grid" ? "" : "flex gap-4"}>
                  <div
                    className={viewMode === "grid" ? "flex h-52 items-center justify-center border-b border-slate-200 bg-slate-100 p-4" : "flex h-28 w-32 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-3"}
                    style={{ backgroundColor: asset.tint ? `${asset.tint}18` : undefined }}
                  >
                    <img
                      src={asset.path}
                      alt={asset.name}
                      className="max-h-full max-w-full rounded object-contain"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/theme-temp.png";
                      }}
                    />
                  </div>

                  <div className={viewMode === "grid" ? "space-y-3 p-4" : "min-w-0 flex-1 space-y-3"}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">{CATEGORY_LABELS[selectedCategory]}</Badge>
                          <Badge variant="outline">{asset.sizeLabel}</Badge>
                        </div>
                        <h3 className="font-orbitron text-lg font-bold text-slate-900">{asset.name}</h3>
                        <p className="mt-1 text-sm text-slate-600">{asset.description}</p>
                      </div>
                      <Image className="h-5 w-5 text-slate-400" />
                    </div>

                    {asset.tags?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {asset.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px] uppercase tracking-[0.2em]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    ) : null}

                    <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                      <div>
                        <div className="mb-1 font-bold uppercase tracking-[0.2em] text-slate-500">Public Path</div>
                        <code className="break-all text-[11px] text-slate-700">{asset.path}</code>
                      </div>
                      {asset.sourcePath ? (
                        <div>
                          <div className="mb-1 font-bold uppercase tracking-[0.2em] text-slate-500">Source File</div>
                          <code className="break-all text-[11px] text-slate-700">{asset.sourcePath}</code>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => copyValue(asset.path, `${asset.id}-path`)}>
                        {copiedKey === `${asset.id}-path` ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                        Copy Path
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => copyValue(asset.id, `${asset.id}-id`)}>
                        {copiedKey === `${asset.id}-id` ? <Check className="mr-2 h-4 w-4" /> : <Layers3 className="mr-2 h-4 w-4" />}
                        Copy ID
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </GameLayout>
  );
}
