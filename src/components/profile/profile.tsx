"use client";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { LeaderboardTypeValues } from "@/types/LeaderBoard";
import { SteamProfile } from "@/types/Steam";
import { ILeaderboardPlayer } from "@/types/LeaderboardPlayer";
import { Match } from "@/types/Match";
import PlayerGodStats from "./playerGodStats";
import { usePagination } from "../leaderboard";
import { MatchHistory } from "./matchHistory";
import { PaginationComponent } from "./pagination";
import { PlayerInfo } from "./playerInfo";

function LoadingSkeleton() {
  return (
    <div className="flex justify-center items-center w-full">
      <Skeleton className="w-full h-16 rounded-full" />
    </div>
  );
}

function calculatePagesToShow(
  currentPage: number,
  totalPages: number
): number[] {
  if (totalPages <= 3) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 2) {
    return [1, 2, 3];
  }
  if (currentPage >= totalPages - 1) {
    return [totalPages - 2, totalPages - 1, totalPages];
  }
  return [currentPage - 1, currentPage, currentPage + 1];
}

export default function Profile() {
  const [state, setState] = useState({
    matchHistoryStats: [] as Match[],
    playerStats: [] as ILeaderboardPlayer[],
    playerName: "",
    steamProfile: undefined as SteamProfile | undefined,
    leaderboardId: LeaderboardTypeValues["1v1Supremacy"],
    totalPages: 1,
    loading: false,
    dataFetched: false,
    error: false,
  });
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const playerId = String(id);

  const { status } = useSession();
  const { limit, onPaginationChange, skip, pagination } = usePagination();

  const fetchProfileData = useCallback(
    async (playerId: string) => {
      const baseUrl = "/api/matchHistory";
      const params = new URLSearchParams({
        playerId,
        skip: skip.toString(),
        limit: limit.toString(),
      });
      const url = `${baseUrl}?${params.toString()}`;

      setState((prev) => ({ ...prev, loading: true }));

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch profile data");
        const { matches, total } = await response.json();
        setState((prev) => ({
          ...prev,
          matchHistoryStats: matches,
          totalPages: Math.ceil(total / limit),
          dataFetched: true,
          error: false,
        }));
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setState((prev) => ({
          ...prev,
          matchHistoryStats: [],
          dataFetched: true,
          error: true,
        }));
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [skip, limit]
  );

  const fetchPlayerStats = useCallback(
    async (playerId: string) => {
      const baseUrl = `/api/leaderboards/[${playerId}]`;
      const params = new URLSearchParams({
        leaderboardId: state.leaderboardId.toString(),
        playerId,
      });
      const url = `${baseUrl}?${params.toString()}`;
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch player stats");
        const data: ILeaderboardPlayer[] = await response.json();
        setState((prev) => ({ ...prev, playerStats: data }));

        if (data.length > 0) {
          setState((prev) => ({ ...prev, playerName: String(data[0].name) }));
          const steamId = data[0].profileUrl.split("/").pop();
          if (steamId) {
            fetchSteamProfile(steamId);
          }
        } else {
          setState((prev) => ({
            ...prev,
            playerName: "",
            steamProfile: undefined,
          }));
        }

        setState((prev) => ({ ...prev, error: false }));
      } catch (error) {
        console.error("Error fetching player stats:", error);
        setState((prev) => ({
          ...prev,
          playerStats: [],
          playerName: "",
          steamProfile: undefined,
          error: true,
        }));
      } finally {
        setState((prev) => ({ ...prev, loading: false, dataFetched: true }));
      }
    },
    [state.leaderboardId]
  );

  const fetchSteamProfile = async (steamId: string) => {
    const url = `/api/steam/${steamId}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch Steam profile");
      const data: SteamProfile = await response.json();
      setState((prev) => ({ ...prev, steamProfile: data, error: false }));
    } catch (error) {
      console.error("Error fetching Steam profile:", error);
      setState((prev) => ({ ...prev, steamProfile: undefined, error: true }));
    }
  };

  useEffect(() => {
    fetchProfileData(playerId);
    fetchPlayerStats(playerId);
  }, [playerId, pagination.pageIndex, fetchProfileData, fetchPlayerStats]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const page = parseInt(queryParams.get("page") || "1", 10) - 1;
    onPaginationChange((prev) => ({ ...prev, pageIndex: page }));
  }, [onPaginationChange]);

  const handlePageClick = (pageIndex: number) => {
    onPaginationChange((prev) => ({ ...prev, pageIndex }));
    setState((prev) => ({ ...prev, loading: true }));
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push(`?page=${pageIndex + 1}`);
  };

  const handleFirstPageClick = () => {
    if (pagination.pageIndex > 0) handlePageClick(0);
  };

  const handleLastPageClick = () => {
    if (pagination.pageIndex < state.totalPages - 1)
      handlePageClick(state.totalPages - 1);
  };

  const showPages = calculatePagesToShow(
    pagination.pageIndex + 1,
    state.totalPages
  );

  if (status === "loading") return <LoadingSkeleton />;

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="flex items-center">
        <PlayerInfo
          playerId={playerId}
          playerName={state.playerName}
          loading={state.loading}
          dataFetched={state.dataFetched}
          playerStats={state.playerStats}
          steamProfile={state.steamProfile}
          error={state.error}
        />
      </div>
      <PlayerGodStats playerId={playerId} />
      <MatchHistory
        loading={state.loading}
        matchHistoryStats={state.matchHistoryStats}
        dataFetched={state.dataFetched}
        error={state.error}
        playerId={playerId}
      />
      <PaginationComponent
        totalPages={state.totalPages}
        pagination={pagination}
        handleFirstPageClick={handleFirstPageClick}
        handlePageClick={handlePageClick}
        handleLastPageClick={handleLastPageClick}
        showPages={showPages}
      />
    </div>
  );
}
