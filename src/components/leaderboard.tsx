"use client";
import { useCallback, useEffect, useState, useMemo } from "react";
import { columns } from "./leaderboardColumns";
import { DataTable } from "./data-table";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { debounce } from "@/utils/debounce";
import { Spinner } from "./spinner";
import { ILeaderboardPlayer } from "@/types/LeaderboardPlayer";
import { LeaderboardTypeValues } from "@/types/LeaderBoard";

export function usePagination() {
  const [pagination, setPagination] = useState({
    pageSize: 50,
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
  const [leaderboardData, setLeaderboardData] = useState<ILeaderboardPlayer[]>(
    []
  );
  const [leaderboardType, setLeaderboardType] = useState<number>(
    LeaderboardTypeValues["1v1Supremacy"]
  );
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [initialLoad, setInitialLoad] = useState(true);

  const { limit, onPaginationChange, skip, pagination } = usePagination();

  const getLiveStatus = async (userId:string) => {
    try {
    const abc = "66e2cc127feec120c8fa955f"
    const response = await fetch(`/api/twitch?userId=${abc}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const { isLive } = await response.json();
    return isLive;
  } catch (error) {
    console.error(`Failed to fetch live status for userId ${userId}:`, error);
    return false; // Default to false if there's an error
  }
  };
  
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
              searchQuery,
              leaderboardType: leaderboardType.toString(),
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
    [skip, limit, leaderboardType]
  );

  const debouncedGetLeaderboardData = useMemo(
    () =>
      debounce((searchQuery: string) => getLeaderboardData(searchQuery), 300),
    [getLeaderboardData]
  );

  useEffect(() => {
    if (initialLoad) {
      getLeaderboardData(searchQuery);
      setInitialLoad(false);
    } else {
      debouncedGetLeaderboardData(searchQuery);
    }
  }, [
    searchQuery,
    getLeaderboardData,
    debouncedGetLeaderboardData,
    initialLoad,
    leaderboardType,
  ]);

  function handleSearchQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    onPaginationChange({ pageIndex: 0, pageSize: pagination.pageSize });
    setSearchQuery(event.target.value);
  }

  const handleLeaderboardTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedType = parseInt(event.target.value);
    setLeaderboardType(selectedType);
  };

  return (
    <>
      <Card className="p-4 h-full">
        <div className="card-header">
          <p className="text-gold">Age of Mythology Retold</p>
          <h2>Leaderboard</h2>
        </div>

        <div className="container mx-auto py-4">
          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
            {/* Leaderboard Type Dropdown */}
            <div className="flex-shrink-0 w-full sm:w-auto">
              <select
                value={leaderboardType}
                onChange={handleLeaderboardTypeChange}
                className="p-2 border border-gray-300 rounded w-full"
              >
                <option value={LeaderboardTypeValues["1v1Supremacy"]}>
                  1v1 Supremacy
                </option>
                <option value={LeaderboardTypeValues.TeamSupremacy}>
                  Team Supremacy
                </option>
                <option value={LeaderboardTypeValues.Deathmatch}>
                  Deathmatch
                </option>
                <option value={LeaderboardTypeValues.TeamDeathmatch}>
                  Team Deathmatch
                </option>
              </select>
            </div>

            {/* Search Bar */}
            <div className="flex-grow flex justify-center sm:justify-end w-full sm:w-auto">
              <div className="w-full max-w-sm">
                <Input
                  placeholder="Search players..."
                  value={searchQuery}
                  onChange={handleSearchQueryChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Table Data */}
          {loading ? (
            <Spinner size={"large"} className="m-4" />
          ) : (
            <DataTable
              columns={columns}
              data={leaderboardData}
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
