"use client";

import { Player } from "@/types/Player";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button";

export const columns: ColumnDef<Player>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "rank",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex justify-items-start hover:cursor-pointer hover:opacity-75 hover:underline"
        >
          Rank
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
  },
  {
    accessorKey: "winPercent",
    header: "Win %",
    cell: (currentRow) => {
      const { row } = currentRow;
      const value = row.original.winPercent;
      const percentage = value * 100;
      return `${percentage.toFixed()}%`;
    },
  },
  {
    accessorKey: "totalGames",
    header: "Total Games",
  },
];
