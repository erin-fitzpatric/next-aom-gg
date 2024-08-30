"use client";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MatchHistoryResponse,
  MatchHistoryStat,
  Profile as ProfileType,
} from "@/types/MatchHistory";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Match from "./match";

export default function Profile() {
  const [matchHistoryStats, setMatchHistoryStats] = useState<
    MatchHistoryStat[]
  >([]);
  const [profiles, setProfiles] = useState<Record<number, ProfileType>>({});
  const params = useParams();
  const { id: playerId } = params;

  const { status } = useSession(); // get the client session status

  const fetchProfileData = async (playerId: string) => {
    const baseUrl = "/api/matchHistory";
    const params = new URLSearchParams({
      playerId,
    });

    const url = `${baseUrl}?${params.toString()}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }
      const data: MatchHistoryResponse = await response.json();
      if (data.matchHistoryStats && data.profiles) {
        setMatchHistoryStats(data.matchHistoryStats);

        // create a profile map for easy lookup
        const profileMap = data.profiles.reduce((acc, profile) => {
          acc[profile.profile_id] = profile;
          return acc;
        }, {} as Record<number, ProfileType>);
        setProfiles(profileMap);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setMatchHistoryStats([]);
      setProfiles([]);
    }
  };

  useEffect(() => {
    fetchProfileData(playerId as string);
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
        <h1 className="text-4xl font-semibold text-gold">
          {profiles[Number(playerId)]?.alias}
        </h1>
        <h2 className="mt-2">Match History (Beta)</h2>
      </CardHeader>
      <Card className="w-full">
        {/* Display the match history */}
        {matchHistoryStats.map((match) => (
          <Match
            key={match.id}
            match={match}
            profiles={profiles}
            playerId={Number(playerId)}
          />
        ))}
      </Card>
    </div>
  );
}
