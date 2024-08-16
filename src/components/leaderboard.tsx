"use client";
import { useEffect, useState } from "react";
import { Player } from "@/types/Player";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Card } from "./ui/card";

export type IGetLeaderboardDataParams = {
  platform: string;
  leaderboardId: number;
  skip?: number;
  limit?: number;
  sort?: number;
};

export default function Leaderboard() {
  // TODO - add real pagination and call API on page change
  const [leaderboardData, setLeaderboardData] = useState<Player[]>([]);

  useEffect(() => {
    async function getLeaderboardData(params: IGetLeaderboardDataParams) {
      const {
        skip = 1,
        limit = 200,
        sort = 1,
        platform,
        leaderboardId,
      } = params;
      try {
        const response = await fetch(
          "/api/leaderboards?" +
            new URLSearchParams({
              leaderboardId: leaderboardId.toString(),
              platform,
              skip: skip.toString(),
              limit: limit.toString(),
              sort: sort.toString(),
            }).toString(),
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const leaderboardData = await response.json();
        setLeaderboardData(leaderboardData);
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
      }
    }

    const params: IGetLeaderboardDataParams = {
      leaderboardId: 3,
      platform: "PC_STEAM",
      sort: 1,
      skip: 1,
      limit: 200,
    };

    getLeaderboardData(params);
  }, []);

  return (
    <>
      <Card className="p-4 h-full">
        <div className="card-header">
          <p className="text-gold">Coming Soon!</p>
          <h2>Retold Leaderboard</h2>
        </div>
        <div className="container mx-auto py-4">
          <DataTable
            columns={columns}
            data={leaderboardData}
            sort={[
              {
                id: "rank",
                desc: false,
              },
            ]}
          />
        </div>
      </Card>
    </>
  );
}
