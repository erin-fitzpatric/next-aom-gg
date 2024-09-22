import { ILeaderboardPlayer } from "@/types/LeaderboardPlayer";
import { Frown } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import StatCard from "./statCard";
import { ProfileAvatar } from "./profileAvatar";
import { SteamProfile } from "@/types/Steam";

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
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex flex-col justify-center">
        <ProfileAvatar steamProfile={steamProfile} loading={loading} />
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
      </div>
      {dataFetched && playerStats.length === 0 && !loading && error && (
        <p className="text-center text-gray-500 mx-auto flex items-center justify-center h-full">
          <Frown className="text-primary" size={100} />
        </p>
      )}
      {playerStats.length > 0 && (
        <div className="my-4">
          {playerStats.map((stat) => (
            <div key={Number(stat.leaderboard_id)}>
              <StatCard playerStats={stat} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
