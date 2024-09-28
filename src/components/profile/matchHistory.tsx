import { Match } from "@/types/Match";
import { Frown } from "lucide-react";
import Loading from "../loading";
import MatchComponent from "./match";

export function MatchHistory({
  loading,
  matchHistoryStats,
  dataFetched,
  error,
  playerId,
}: {
  loading: boolean;
  matchHistoryStats: Match[];
  dataFetched: boolean;
  error: boolean;
  playerId: string;
}) {
  return (
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
          <MatchComponent
            key={match.matchId}
            match={match}
            playerId={playerId}
          />
        ))
      )}
    </div>
  );
}
