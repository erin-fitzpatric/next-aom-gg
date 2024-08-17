"use client";
import { useCallback, useEffect, useState } from "react";
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
  const [leaderboardData, setLeaderboardData] = useState<Player[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  async function handlePageChange(page: number) {
    setCurrentPage(page);
    const params: IGetLeaderboardDataParams = {
      leaderboardId: 3,
      platform: "PC_STEAM",
      sort: 1,
      skip: page,
      limit: pageSize,
    };
    getLeaderboardData(params);
  }

  const getLeaderboardData = useCallback(
    async (params: IGetLeaderboardDataParams) => {
      const { skip = currentPage, limit = pageSize, sort = 1, platform, leaderboardId } = params;
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
    },
    [currentPage, pageSize]
  );
  


  useEffect(() => {
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
