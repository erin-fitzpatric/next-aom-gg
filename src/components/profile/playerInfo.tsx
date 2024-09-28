import React from "react";
import { ILeaderboardPlayer } from "@/types/LeaderboardPlayer";
import { Frown } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import StatCard from "./statCard";
import { ProfileAvatar } from "./profileAvatar";
import { SteamProfile } from "@/types/Steam";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function PlayerInfo({
  playerName,
  loading,
  dataFetched,
  playerStats,
  steamProfile,
  error,
}: {
  playerName: string;
  loading: boolean;
  dataFetched: boolean;
  playerStats: ILeaderboardPlayer[];
  steamProfile?: SteamProfile | undefined;
  error: boolean;
}) {
  const hasBothStats = playerStats.length === 2;
  const defaultTab = "single"; // Always default to single, as it's the first item if present

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <Card className="border-0 w-full bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl min-w-96 ">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="flex-shrink-0 flex flex-col items-center self-center">
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
                  {playerStats.map((stats, index) => (
                    <TabsContent
                      key={index}
                      value={index === 0 ? "single" : "team"}
                    >
                      <StatCard playerStats={stats} />
                    </TabsContent>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        {hasBothStats && (
          <CardFooter className="w-full lg:w-96 m-0 p-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single">1v1</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
          </CardFooter>
        )}
      </Card>
    </Tabs>
  );
}
