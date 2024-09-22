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
}: {
  playerName: string;
  loading: boolean;
  dataFetched: boolean;
  playerStats: ILeaderboardPlayer[];
  steamProfile?: SteamProfile | undefined;
  error: boolean;
}) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handlePrevCard = () => {
    setCurrentCardIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : playerStats.length - 1,
    );
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) =>
      prevIndex < playerStats.length - 1 ? prevIndex + 1 : 0,
    );
  };

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl w-[600px]">
      <CardContent className="flex gap-20 py-0">
        <div className="flex flex-col justify-between">
          <Button onClick={handlePrevCard} variant="outline" size="icon">
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button onClick={handleNextCard} variant="outline" size="icon">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-col justify-center items-center">
          <ProfileAvatar steamProfile={steamProfile} loading={loading} />
          {loading ? (
            <Skeleton className="w-48 h-8 rounded-md mt-4" />
          ) : (
            <h3 className="font-semibold text-gold">
              {playerName ||
                (dataFetched && !playerStats.length && error
                  ? "Player Not Found"
                  : "")}
            </h3>
          )}
        </div>
        {dataFetched && playerStats.length === 0 && !loading && error && (
          <p className="text-center text-gray-500 mx-auto flex items-center justify-center h-full">
            <Frown className="text-primary" size={100} />
          </p>
        )}
        {playerStats.length > 0 && (
          <div className="my-4 relative">
            <StatCard playerStats={playerStats[currentCardIndex]} />
          </div>
        )}
      </CardContent>
      <p className="text-center mt-2">
        {currentCardIndex + 1} / {playerStats.length}
      </p>
    </Card>
  );
}
