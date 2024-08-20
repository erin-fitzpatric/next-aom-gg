"use client";
import { useCallback, useEffect, useState, useMemo } from "react";
import { Player } from "@/types/Player";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { debounce } from "@/utils/debounce";

export function usePagination() {
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageIndex: 0,
  });
  const { pageSize, pageIndex } = pagination;

  return {
    limit: pageSize,
    onPaginationChange: setPagination,
    pagination,
    skip: pageSize * pageIndex,
  };
}



export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<Player[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [initialLoad, setInitialLoad] = useState(true);

  const { limit, onPaginationChange, skip, pagination } = usePagination();

  const getLeaderboardData = useCallback(
    async (searchQuery: string) => {
      try {
        setLoading(true);
        const sort = { rank: "asc" };
        const response = await fetch(
          "/api/leaderboards?" +
            new URLSearchParams({
              skip: skip.toString(),
              limit: limit.toString(),
              sort: JSON.stringify(sort),
              searchQuery, // Pass search query here
            }).toString(),
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const { leaderboardPlayers, totalRecords } = await response.json();
        setLeaderboardData(leaderboardPlayers);
        setTotalRecords(totalRecords);
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    },
    [skip, limit]
  );

  const debouncedGetLeaderboardData = useMemo(
    () => debounce((searchQuery: string) => getLeaderboardData(searchQuery), 300),
    [getLeaderboardData]
  );

  function handleSearchQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    onPaginationChange({ pageIndex: 0, pageSize: pagination.pageSize });
    setSearchQuery(event.target.value);
  }

  useEffect(() => {
    if (initialLoad) {
      // Fetch data immediately on initial load
      getLeaderboardData(searchQuery);
      setInitialLoad(false);
    } else {
      // Use debounced function for subsequent searchQuery changes
      debouncedGetLeaderboardData(searchQuery);
    }
  }, [searchQuery, skip, limit, getLeaderboardData, debouncedGetLeaderboardData, initialLoad]);

  return (
    <>
      <Card className="p-4 h-full">
        <div className="card-header">
          <p className="text-gold">Coming Soon!</p>
          <h2>Retold Leaderboard</h2>
        </div>
        <div className="container mx-auto py-4">
          <Input
            placeholder="Filter players..."
            value={searchQuery}
            onChange={(event) => handleSearchQueryChange(event)} // Update search query
            className="max-w-sm mx-auto"
          />
          <DataTable
            columns={columns}
            data={leaderboardData} // Pass fetched data
            onPaginationChange={onPaginationChange}
            pageCount={Math.ceil(totalRecords / limit)}
            pagination={pagination}
          />
        </div>
      </Card>
    </>
  );
}
