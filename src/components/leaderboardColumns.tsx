"use client";

import { ILeaderboardPlayer } from "@/types/LeaderboardPlayer";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";

export const columns: ColumnDef<ILeaderboardPlayer>[] = [
  {
    accessorKey: "rank",
    header: "Rank",
    cell: ({ row }) => (
      <div className="flex items-center">
        <span>{String(row.original.rank)}.</span>
      </div>
    ),
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
    header: () => <span className="hidden lg:flex">Highest Elo</span>,
    cell: ({ row }) => (
      <span className="hidden lg:flex">
        {Number(row.original.highestrating)}
      </span>
    ),
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
    header: () => <span className="hidden lg:flex">Wins</span>,
    cell: ({ row }) => (
      <div className="items-center hidden lg:flex">
        <span className="text-primary hidden lg:flex">
          {String(row.original.wins)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "losses",
    header: () => <span className="hidden lg:flex">Losses</span>,
    cell: ({ row }) => (
      <div className="items-center hidden lg:flex">
        <span className="text-red-500 hidden lg:flex">
          {String(row.original.losses)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "totalGames",
    header: () => <span className="hidden lg:flex">Total Games</span>,
    cell: ({ row }) => (
      <div className="hidden lg:flex">
        <span className="hidden lg:flex">
          {String(row.original.totalGames)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "streak",
    header: "Streak",
    cell: ({ row }) => {
      const isWinningStreak = Number(row.original.streak) > 0;
      const streakColor = isWinningStreak ? "text-primary" : "text-red-500";
      const streak = Math.abs(Number(row.original.streak));
      return (
        <div className="flex items-center">
          {isWinningStreak ? (
            <>
              <ArrowUp className={streakColor} />
              <span className={streakColor}>
                {Number(streak)}
              </span>
            </>
          ) : (
            <>
              <ArrowDown className={streakColor} />
              <span className={streakColor}>
                {Number(streak)}
              </span>
            </>
          )}
        </div>
      );
    },
  },
];
