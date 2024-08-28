"use client";

import { AoeApiPlayer } from "@/app/api/leaderboards/service";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const columns: ColumnDef<AoeApiPlayer>[] = [
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
    accessorKey: "userName",
    header: "Name",
    cell: ({ row }: any) => (
      <div className="flex items-center">
        <Image
          src={row.original.avatarUrl}
          alt={`Rank ${row.original.rank}`}
          width={40}
          height={40}
          className="mr-4 rounded-full"
        />
        <span className="text-primary">{row.original.userName}</span>
      </div>
    ),
  },
  {
    accessorKey: "elo",
    header: "Elo",
  },
  {
    accessorKey: "eloHighest",
    header: "Highest Elo",
  },
  {
    accessorKey: "winPercent",
    header: "Win %",
    cell: (currentRow) => {
      const { row } = currentRow;
      const value = row.original.winPercent;
      const percentage = value;
      return `${percentage.toFixed()}%`;
    },
  },
  {
    accessorKey: "wins",
    header: "Wins",
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="text-primary">{row.original.wins}</span>
      </div>
    ),
  },
  {
    accessorKey: "losses",
    header: "Losses",
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="text-red-500">{row.original.losses}</span>
      </div>
    ),
  },
  {
    accessorKey: "totalGames",
    header: "Total Games",
  },
  {
    accessorKey: "winStreak",
    header: "Current Streak",
    cell: ({ row }) => {
      const streakColor =
        row.original.winStreak > 0 ? "text-primary" : "text-red-500";
      return (
        <div className="flex items-center">
          <span className={streakColor}>{row.original.winStreak}</span>
        </div>
      );
    },
  },
];
