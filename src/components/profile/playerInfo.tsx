import React, { useState } from "react";
import { ILeaderboardPlayer } from "@/types/LeaderboardPlayer";
import {
  Frown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import StatCard from "./statCard";
import { ProfileAvatar } from "./profileAvatar";
import { SteamProfile } from "@/types/Steam";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

export function PlayerInfo({
  playerName,
  loading,
  dataFetched,
  playerStats,
  steamProfile,
  error,
  currentCardIndex,
}: {
  playerName: string;
  loading: boolean;
  dataFetched: boolean;
  playerStats: ILeaderboardPlayer[];
  steamProfile?: SteamProfile | undefined;
  error: boolean;
  currentCardIndex: number;
}) {
  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="flex-shrink-0 flex flex-col items-center">
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
              <div className="my-4 relative">
                <StatCard playerStats={playerStats[currentCardIndex]} />
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <p className="text-center mt-2 pb-4">
        {currentCardIndex + 1} / {playerStats.length}
      </p>
    </Card>
  );
}
