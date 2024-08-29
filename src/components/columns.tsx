"use client";

import { ILeaderboardPlayer } from "@/types/LeaderboardPlayer";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<ILeaderboardPlayer>[] = [
  {
    accessorKey: "rank",
    header: "Rank",
  },
  // {
  //   accessorKey: "rank",
  //   header: ({ column }) => {
  //     return (
  //       <div
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         className="flex justify-items-start hover:cursor-pointer hover:opacity-75 hover:underline"
  //       >
  //         Rank
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }: any) => (
      <div className="flex items-center">
        {/* TODO - fetch avatar */}
        {/* <Image
          src={row.original.avatarUrl} 
          alt={`Rank ${row.original.rank}`}
          width={40}
          height={40}
          className="mr-4 rounded-full"
        /> */}
        <span className="text-primary">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "rating",
    header: "Elo",
  },
  {
    accessorKey: "highestrating",
    header: "Highest Elo",
  },
  {
    accessorKey: "winPercent",
    header: "Win %",
    cell: (currentRow) => {
      const { row } = currentRow;
      const value = Number(row.original.winPercent);
      const percentage = value * 100;
      return `${percentage.toFixed()}%`;
    },
  },
  {
    accessorKey: "wins",
    header: "Wins",
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="text-primary">{String(row.original.wins)}</span>
      </div>
    ),
  },
  {
    accessorKey: "losses",
    header: "Losses",
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="text-red-500">{String(row.original.losses)}</span>
      </div>
    ),
  },
  {
    accessorKey: "totalGames",
    header: "Total Games",
  },
  {
    accessorKey: "streak",
    header: "Current Streak",
    cell: ({ row }) => {
      const streakColor =
        Number(row.original.streak) > 0 ? "text-primary" : "text-red-500";
      return (
        <div className="flex items-center">
          <span className={streakColor}>{String(row.original.streak)}</span>
        </div>
      );
    },
  },
];
