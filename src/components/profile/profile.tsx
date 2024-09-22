"use client";
import { CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import MatchComponent from "./match";
import { LeaderboardTypeValues } from "@/types/LeaderBoard";
import { SteamProfile } from "@/types/Steam";
import Image from "next/image";
import StatCard from "./statCard";
import { ILeaderboardPlayer } from "@/types/LeaderboardPlayer";
import { Match } from "@/types/Match";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "../ui/pagination";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import Loading from "../loading";
import { Frown } from "lucide-react";

export default function Profile() {
  const [matchHistoryStats, setMatchHistoryStats] = useState<Match[]>([]);
  const [playerStats, setPlayerStats] = useState<ILeaderboardPlayer[]>([]);
  const [playerName, setPlayerName] = useState<string>("");
  const [steamProfile, setSteamProfile] = useState<SteamProfile>();
  const [leaderboardId, setLeaderboardId] = useState<number>(
    LeaderboardTypeValues["1v1Supremacy"],
  );
  const [totalPages, setTotalPages] = useState<number>(1); // To manage total pages
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [dataFetched, setDataFetched] = useState<boolean>(false); // Track if data has been fetched
  const [error, setError] = useState<boolean>(false); // Track if an error occurred

  const params = useParams();
  const router = useRouter(); // For updating URL
  const { id } = params;
  const playerId = String(id);

  const { status } = useSession(); // get the client session status
  const { limit, onPaginationChange, skip, pagination } = usePagination();

  function usePagination() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [pagination, setPagination] = useState({
      pageSize: 50,
      pageIndex: 0,
    });

    useEffect(() => {
      // Update pageIndex based on the searchParams
      const page = parseInt(searchParams.get("page") || "1", 10);
      setPagination((prev) => ({ ...prev, pageIndex: page - 1 }));
    }, [searchParams]);

    const { pageSize, pageIndex } = pagination;

    const goToPage = useCallback(
      (newPageIndex: number) => {
        setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
        setLoading(true); // Set loading true when changing pages

        // Create a new URLSearchParams object
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("page", (newPageIndex + 1).toString());

        // Use router.push with the new search params
        router.push(`?${newSearchParams.toString()}`);
      },
      [router, searchParams],
    );

    return {
      limit: pageSize,
      onPaginationChange: setPagination,
      pagination,
      skip: pageSize * pageIndex,
      goToPage,
    };
  }

  const fetchProfileData = useCallback(
    async (playerId: string) => {
      const baseUrl = "/api/matchHistory";
      const params = new URLSearchParams({
        playerId,
        skip: skip.toString(),
        limit: limit.toString(),
      });
      const url = `${baseUrl}?${params.toString()}`;

      setLoading(true); // Set loading true when fetching data

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch profile data");
        const { matches, total } = await response.json();
        setMatchHistoryStats(matches);
        setTotalPages(Math.ceil(total / limit)); // Update total pages based on total matches
        setDataFetched(true); // Set dataFetched to true after fetching data
        setError(false); // Reset error state on successful fetch
      } catch (error: any) {
        console.error("Error fetching profile data:", error);
        setMatchHistoryStats([]);
        setDataFetched(true); // Ensure dataFetched is true even if there is an error
        setError(true); // Set error state if an error occurs
      } finally {
        setLoading(false); // Set loading false after fetching data
      }
    },
    [skip, limit],
  );

  const fetchPlayerStats = useCallback(
    async (playerId: string) => {
      const baseUrl = `/api/leaderboards/[${playerId}]`;
      const params = new URLSearchParams({
        leaderboardId: leaderboardId.toString(),
        playerId,
      });
      const url = `${baseUrl}?${params.toString()}`;
      setLoading(true); // Set loading true when fetching data
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch player stats");
        const data: ILeaderboardPlayer[] = await response.json();
        setPlayerStats(data);

        if (data.length > 0) {
          setPlayerName(String(data[0].name));
          const steamId = data[0].profileUrl.split("/").pop();
          if (steamId) {
            fetchSteamProfile(steamId);
          }
        } else {
          setPlayerName(""); // Clear playerName if no player stats found
          setSteamProfile(undefined); // Clear steamProfile if no player stats found
        }

        setError(false); // Reset error state on successful fetch
      } catch (error: any) {
        console.error("Error fetching player stats:", error);
        setPlayerStats([]);
        setPlayerName(""); // Clear playerName if an error occurs
        setSteamProfile(undefined); // Clear steamProfile if an error occurs
        setError(true); // Set error state if an error occurs
      } finally {
        setLoading(false); // Set loading false after fetching data
        setDataFetched(true); // Set dataFetched to true after fetching player stats
      }
    },
    [leaderboardId],
  );

  const fetchSteamProfile = async (steamId: string) => {
    const url = `/api/steam/${steamId}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch Steam profile");
      const data: SteamProfile = await response.json();
      setSteamProfile(data);
      setError(false); // Reset error state on successful fetch
    } catch (error: any) {
      console.error("Error fetching Steam profile:", error);
      setSteamProfile(undefined);
      setError(true); // Set error state if an error occurs
    }
  };

  useEffect(() => {
    fetchProfileData(playerId);
    fetchPlayerStats(playerId);
  }, [playerId, pagination.pageIndex, fetchProfileData, fetchPlayerStats]); // Re-fetch on page index change

  useEffect(() => {
    // Update pageIndex from query parameter on component mount
    const queryParams = new URLSearchParams(window.location.search);
    const page = parseInt(queryParams.get("page") || "1", 10) - 1;
    onPaginationChange((prev) => ({ ...prev, pageIndex: page }));
  }, [onPaginationChange]);

  const handlePageClick = (pageIndex: number) => {
    onPaginationChange((prev) => ({ ...prev, pageIndex }));
    setLoading(true); // Set loading true when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top
    router.push(`?page=${pageIndex + 1}`); // Update URL with the new page number
  };

  const handleFirstPageClick = () => {
    if (pagination.pageIndex > 0) {
      handlePageClick(0);
    }
  };

  const handleLastPageClick = () => {
    if (pagination.pageIndex < totalPages - 1) {
      handlePageClick(totalPages - 1);
    }
  };

  // Determine which pages to show
  const currentPage = pagination.pageIndex + 1; // Adjust to 1-based page index

  const showPages = (() => {
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
  })();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center w-full">
        <Skeleton className="w-full h-16 rounded-full" />
      </div>
    );
  }

  return (
    <div className="w-full text-2xl">
      <CardHeader className="w-full text-center">
        {loading ? (
          <Skeleton className="w-24 h-24 rounded-full mx-auto" />
        ) : steamProfile ? (
          <Image
            src={steamProfile.avatarfull}
            alt="Profile Picture"
            width={84}
            height={84}
            className="rounded-full mx-auto"
          />
        ) : (
          <div className="w-24 h-24 rounded-full mx-auto bg-gray-300"></div>
        )}
      </CardHeader>
      <div className="w-full flex flex-col items-center">
        {loading ? (
          <Skeleton className="w-48 h-8 rounded-md mt-4" />
        ) : (
          <h1 className="text-4xl font-semibold text-gold">
            {playerName ||
              (dataFetched && !playerStats.length && error
                ? "Player Not Found"
                : "")}
          </h1>
        )}
        {dataFetched && playerStats.length === 0 && !loading && error && (
          <p className="text-center text-gray-500 mx-auto flex items-center justify-center h-full">
            <Frown className="text-primary" size={100} />
          </p>
        )}
        {playerStats.length > 0 && (
          <div className="w-full my-4">
            {playerStats.map((stat) => (
              <div key={Number(stat.leaderboard_id)} className="w-full">
                <StatCard playerStats={stat} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col mx-auto gap-4">
        {loading ? (
          <div className="p-4">
            <Loading />
          </div>
        ) : matchHistoryStats.length === 0 && dataFetched && error ? (
          <p className="text-center text-gray-500 mx-auto flex items-center justify-center h-full">
            <Frown className="text-primary" size={100} />
          </p>
        ) : (
          matchHistoryStats.map((match) => (
            <MatchComponent key={match.matchId} match={match} />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {/* First Page Button */}
            <PaginationItem>
              <PaginationLink
                onClick={handleFirstPageClick}
                className={`hover:cursor-pointer ${
                  pagination.pageIndex === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                aria-label="First Page"
              >
                <DoubleArrowLeftIcon className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>

            {/* Page Numbers */}
            {showPages.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageClick(page - 1)}
                  aria-current={
                    pagination.pageIndex === page - 1 ? "page" : undefined
                  }
                  className="hover:cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Last Page Button */}
            <PaginationItem>
              <PaginationLink
                onClick={handleLastPageClick}
                className={`hover:cursor-pointer ${
                  pagination.pageIndex === totalPages - 1
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                aria-label="Last Page"
              >
                <DoubleArrowRightIcon className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
