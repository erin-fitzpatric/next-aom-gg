import { useState, useEffect, Key } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  listMajorGods,
  majorGodIndexToData,
  majorGodNameToIndex,
} from "@/types/MajorGods";
import Image from "next/image";

interface GodStats {
  godData: any;
  civilization_id: number;
  win_rate: number;
  play_rate: number;
  number_of_games: number;
  game_mode: string;
  patch?: string;
}

interface PlayerGodStatsProps {
  playerId: string;
}

export default function PlayerGodStats({ playerId }: PlayerGodStatsProps) {
  const [sortColumn, setSortColumn] =
    useState<keyof GodStats>("civilization_id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [patch, setPatch] = useState("");
  const [civilization, setCivilization] = useState("");
  const [gameMode, setGameMode] = useState("");
  const [godStats, setGodStats] = useState<GodStats[]>([]);
  const [loading, setLoading] = useState(false);

  const [builds, setBuilds] = useState<string[]>([]);
  const [gameModes, setGameModes] = useState<string[]>([]);

  const MAJOR_GODS = listMajorGods();

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const response = await fetch(`/api/data/builds`);
        if (!response.ok) {
          console.log("Failed to fetch builds");
          throw new Error("Failed to fetch builds");
        }
        const data = await response.json();
        setBuilds(data);
      } catch (error) {
        console.error("Error fetching builds:", error);
      }
    };
    fetchBuilds();
  }, []);

  useEffect(() => {
    const fetchGameModes = async () => {
      console.log("Fetching available game modes");
      try {
        const response = await fetch(`/api/data/game_modes`);
        if (!response.ok) {
          console.log("Failed to fetch game modes");
          throw new Error("Failed to fetch game modes");
        }
        const data = await response.json();
        console.log("TEST", data);
        setGameModes(data);
      } catch (error) {
        console.error("Error fetching game modes:", error);
      }
    };
    fetchGameModes();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching user god stats");
      setLoading(true);
      try {
        const params = new URLSearchParams({ playerId: playerId.toString() });

        if (patch) {
          params.append("patchDescription", patch);
        }
        if (civilization) {
          const godIndex = majorGodNameToIndex(civilization);
          if (godIndex !== undefined) {
            params.append("civilization", godIndex.toString());
          }
        }
        if (gameMode) {
          params.append("gameMode", gameMode);
        }

        const response = await fetch(
          `/api/stats/user/gods?${params.toString()}`
        );
        if (!response.ok) {
          console.log("Failed to fetch user god stats");
          throw new Error("Failed to fetch user god stats");
        }
        const data = await response.json();
        console.log("TEST", data);
        const mappedData = data.map((item: any) => {
          const godData = majorGodIndexToData(item.civilization_id);
          return {
            ...item,
            godData,
            patch: item.patch_description,
          };
        });
        setGodStats(mappedData);
      } catch (error) {
        console.error("Error fetching user god stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [playerId, gameMode, civilization, patch]);

  const sortedGodStats = [...godStats].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (column: keyof GodStats) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ column }: { column: keyof GodStats }) => {
    if (sortColumn !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const getWinRateColor = (winRate: number) => {
    if (winRate > 55) return "text-green-700";
    if (winRate > 52.5) return "text-green-600";
    if (winRate > 50) return "text-green-500";
    if (winRate < 45) return "text-red-700";
    if (winRate < 47.5) return "text-red-600";
    if (winRate < 50) return "text-red-500";
    return "";
  };

  const selectedGod = MAJOR_GODS.find((god) => god.name === civilization);

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="flex space-x-4 justify-start">
          <div className="flex flex-col">
            <Label htmlFor="patch-dropdown" className="mb-1 text-gold">
              Patch
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  id="patch-dropdown"
                  variant="outline"
                  className="bg-gray-100 dark:bg-gray-700 flex justify-between items-center"
                >
                  {patch || "Select Patch"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setPatch("")}>
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </DropdownMenuItem>
                {builds.map((build) => (
                  <DropdownMenuItem
                    key={build as Key}
                    onSelect={() => setPatch(build)}
                  >
                    {build}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-col">
            <Label htmlFor="civilization-dropdown" className="mb-1 text-gold">
              Major God
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  id="civilization-dropdown"
                  variant="outline"
                  className="bg-gray-100 dark:bg-gray-700 flex justify-between items-center"
                >
                  {selectedGod ? (
                    <div className="flex items-center">
                      <Image
                        src={selectedGod.portraitPath}
                        alt={selectedGod.name}
                        width={24}
                        height={24}
                        className="mr-2"
                      />
                      {selectedGod.name}
                    </div>
                  ) : (
                    "Select Major God"
                  )}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setCivilization("")}>
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </DropdownMenuItem>
                {MAJOR_GODS.map((god) => (
                  <DropdownMenuItem
                    key={god.name}
                    onSelect={() => setCivilization(god.name)}
                  >
                    <div className="flex items-center">
                      <Image
                        src={god.portraitPath}
                        alt={god.name}
                        width={24}
                        height={24}
                        className="mr-2"
                      />
                      {god.name}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-col">
            <Label htmlFor="gamemode-dropdown" className="mb-1 text-gold">
              Game Mode
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  id="gamemode-dropdown"
                  variant="outline"
                  className="bg-gray-100 dark:bg-gray-700 flex justify-between items-center"
                >
                  {gameMode || "Select Game Mode"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setGameMode("")}>
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </DropdownMenuItem>
                {gameModes.map((mode) => (
                  <DropdownMenuItem
                    key={mode as Key}
                    onSelect={() => setGameMode(mode)}
                  >
                    {mode}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="w-[90vw] overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading...</p>
            </div>
          ) : godStats.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p>No Games Played</p>
            </div>
          ) : (
            <div style={{ maxHeight: "25vh", overflowY: "auto" }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      onClick={() => handleSort("civilization_id")}
                      className="cursor-pointer text-gold text-sm"
                    >
                      God
                      <SortIcon column="civilization_id" />
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("win_rate")}
                      className="cursor-pointer text-gold text-sm"
                    >
                      Win Rate
                      <SortIcon column="win_rate" />
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("play_rate")}
                      className="cursor-pointer text-gold text-sm"
                    >
                      Play Rate
                      <SortIcon column="play_rate" />
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("number_of_games")}
                      className="cursor-pointer text-gold text-sm"
                    >
                      #Games
                      <SortIcon column="number_of_games" />
                    </TableHead>
                    {patch && (
                      <TableHead className="text-gold text-sm">Patch</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedGodStats.map((god, index) => (
                    <TableRow key={`${god.civilization_id}-${index}`}>
                      <TableCell>
                        <div className="flex items-center">
                          <Image
                            src={god.godData.portraitPath}
                            alt={god.godData.name}
                            width={24}
                            height={24}
                            className="mr-2"
                          />
                          <span>{god.godData.name}</span>
                        </div>
                      </TableCell>
                      <TableCell
                        className={getWinRateColor(god.win_rate * 100)}
                      >
                        {(god.win_rate * 100).toFixed(2)}%
                      </TableCell>
                      <TableCell>{(god.play_rate * 100).toFixed(2)}%</TableCell>
                      <TableCell>{god.number_of_games}</TableCell>
                      {patch && <TableCell>{god.patch}</TableCell>}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
