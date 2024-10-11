import React, { useCallback, useEffect, useState } from "react";
import { LeaderboardTypeNames } from "@/types/LeaderBoard";
import { ILeaderboardPlayer } from "@/types/LeaderboardPlayer";
import { Frown } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import StatCard from "./statCard";
import { ProfileAvatar } from "./profileAvatar";
import { SteamProfile } from "@/types/Steam";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { getMatchRatings } from "@/server/controllers/profile-rating";
import RatingLineChart from "./ratingGraph";
import { ChartData, CombinedChartData } from "@/types/ChartData";

export function PlayerInfo({
  playerId,
  playerName,
  loading,
  dataFetched,
  playerStats,
  steamProfile,
  error,
}: {
  playerId: string;
  playerName: string;
  loading: boolean;
  dataFetched: boolean;
  playerStats: ILeaderboardPlayer[];
  steamProfile?: SteamProfile | undefined;
  error: boolean;
}) {
  const [chartData, setChartData] = useState<{
    solo: ChartData[];
    team: ChartData[];
  }>({
    solo: [],
    team: [],
  });
  const gameTypes = playerStats.map((stat) => stat.leaderboard_id);
  const defaultTab = gameTypes[0]?.toString() || "1";

  const startDate = 0;
  const endDate = 0;

  const fetchChartData = useCallback(
    async (playerId: number) => {
      try {
        const { chartData } = await getMatchRatings({
          playerId,
          startDate,
          endDate,
        });
        setChartData(chartData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    },
    [startDate, endDate]
  );

  useEffect(() => {
    fetchChartData(parseInt(playerId, 10));
  }, [playerId, fetchChartData]);

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <Card className="pt-5 sm:pt-0 border-0 w-full bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl min-w-96">
        <CardContent className="sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-shrink-0 flex flex-col items-center self-center mb-4 sm:mb-0">
              <ProfileAvatar steamProfile={steamProfile} loading={loading} />
              {loading ? (
                <Skeleton className="w-48 h-8 rounded-md mt-4" />
              ) : (
                <h3 className="font-semibold text-gold mt-4 text-center">
                  {playerName ||
                    (dataFetched && !playerStats.length && error
                      ? "Player Not Found"
                      : "")}
                </h3>
              )}
            </div>
            <div className="flex-grow w-full sm:w-auto">
              {dataFetched && playerStats.length === 0 && !loading && error && (
                <p className="text-center text-gray-500 flex items-center justify-center h-full">
                  <Frown className="text-primary" size={100} />
                </p>
              )}
              {playerStats.length > 0 && (
                <div className="w-full">
                  {playerStats.map((stats) => (
                    <TabsContent
                      key={stats.leaderboard_id.toString()}
                      value={stats.leaderboard_id.toString()}
                    >
                      <StatCard playerStats={stats} />
                    </TabsContent>
                  ))}
                </div>
              )}
            </div>
            <div className="w-full sm:w-1/2 lg:w-2/5 mt-4 sm:mt-0">
              <RatingLineChart
                soloData={chartData.solo}
                teamData={chartData.team}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="w-full lg:w-96 m-0 p-0">
          <TabsList className={`grid w-full grid-cols-${gameTypes.length}`}>
            {gameTypes.map((type) => (
              <TabsTrigger key={type?.toString()} value={type.toString()}>
                {LeaderboardTypeNames[type]}
              </TabsTrigger>
            ))}
          </TabsList>
        </CardFooter>
      </Card>
    </Tabs>
  );
}
