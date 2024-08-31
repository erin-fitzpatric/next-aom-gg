"use client";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import Match from "./match";
import { MatchHistory } from "@/types/MatchHistory";

export default function Profile() {
  const [matchHistoryStats, setMatchHistoryStats] = useState<
    MatchHistory["mappedMatchHistoryData"]
  >([]);
  const [playerName, setPlayerName] = useState<string>("");
  const params = useParams();
  const { id } = params;
  const playerId = String(id);

  // create a playerid context
  const PlayerIdContext = createContext(playerId);

  const { status } = useSession(); // get the client session status

  const fetchProfileData = async (playerId: string) => {
    const baseUrl = "/api/matchHistory";
    const params = new URLSearchParams({
      playerId,
    });
    const url = `${baseUrl}?${params.toString()}`;

    try {
      const response = await fetch(url);
      const data: MatchHistory = await response.json();
      setMatchHistoryStats(data.mappedMatchHistoryData);
      setPlayerName(data.playerName);
    } catch (error: any) {
      console.error("Error fetching profile data:", error);
      setMatchHistoryStats([]);
    }
  };

  useEffect(() => {
    fetchProfileData(playerId);
  }, [playerId]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center w-full">
        <Skeleton className="w-full h-16 rounded-full" />{" "}
      </div>
    );
  }

  return (
    <div className="w-full">
      <CardHeader className="text-center">
        <h1 className="text-4xl font-semibold text-gold">{playerName}</h1>
        <h2 className="mt-2 font-semibold">Match History</h2>
      </CardHeader>
      <Card className="w-full">
        {matchHistoryStats.map((match) => (
          <Match key={match.matchId} match={match} />
        ))}
      </Card>
    </div>
  );
}
