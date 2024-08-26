"use client";
import { useCallback, useEffect, useState, useMemo } from "react";
import { Player } from "@/types/Player";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { debounce } from "@/utils/debounce";
import dynamic from "next/dynamic";
import { Spinner } from "./spinner";
const Countdown = dynamic(() => import("./countdown"), { ssr: false });

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
  const [loading, setLoading] = useState(true);
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

  // Memoize the debounced version of getLeaderboardData
  const debouncedGetLeaderboardData = useMemo(
    () => debounce((searchQuery: string) => getLeaderboardData(searchQuery), 300),
    [getLeaderboardData]
  );

  useEffect(() => {
    if (initialLoad) {
      // Fetch data immediately on initial load
      getLeaderboardData(searchQuery);
      setInitialLoad(false);
    } else {
      // Debounced search query fetch
      debouncedGetLeaderboardData(searchQuery);
    }
  }, [searchQuery, getLeaderboardData, debouncedGetLeaderboardData, initialLoad]);

  function handleSearchQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    onPaginationChange({ pageIndex: 0, pageSize: pagination.pageSize });
    setSearchQuery(event.target.value);
  }

  return (
    <>
      {/* Mobile Countdown */}
      <div className="block sm:hidden mb-2">
        <Countdown
          targetDate={"2024-08-28T00:00:00Z"}
          title={"Retold Premium Early Access"}
        />
      </div>

      <Card className="p-4 h-full">
        <div className="card-header">
          <p className="text-gold">Coming Soon!</p>
          <h2>Retold Leaderboard</h2>
        </div>
        <div className="container mx-auto py-4">
          <Input
            placeholder="Filter players..."
            value={searchQuery}
            onChange={handleSearchQueryChange} // Update search query
            className="max-w-sm mx-auto"
          />
          {loading ? (
            <Spinner size={"large"} className="m-4" />
          ) : (
            <DataTable
              columns={columns}
              data={leaderboardData} // Pass fetched data
              onPaginationChange={onPaginationChange}
              pageCount={Math.ceil(totalRecords / limit)}
              pagination={pagination}
            />
          )}
        </div>
      </Card>
    </>
  );
}
