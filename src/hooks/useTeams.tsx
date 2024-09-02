import { useMemo } from "react";
import { IRecordedGame } from "@/types/RecordedGame";
import { splitTeams } from "@/server/teams";
import TeamTile from "@/components/recs/team-tile";

export function useTeams(rec: IRecordedGame) {
  const teamSplit = splitTeams(rec);

  const { leftTeams, rightTeams } = useMemo(() => {
    let teamCount = 0;
    const mapTeams = (teamArray: number[]) =>
      teamArray.map(
        (teamIndex) => (
          teamCount++,
          (
            <TeamTile
              key={`${rec.gameGuid}-${teamCount}`}
              recData={rec}
              teamIndex={teamIndex}
            />
          )
        ),
      );

    return {
      leftTeams: mapTeams(teamSplit.left),
      rightTeams: mapTeams(teamSplit.right),
    };
  }, [rec, teamSplit.left, teamSplit.right]);

  return { leftTeams, rightTeams };
}
