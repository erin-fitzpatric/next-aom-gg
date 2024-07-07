"use client";

import { Player } from "@/types/player";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "../ui/button";

export const columns: ColumnDef<Player>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "rank",
    header: "Rank",
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

    // `${(row.cell. .winPercent * 100).toFixed(2)}%`,
  },
  {
    accessorKey: "totalGames",
    header: "Total Games",
  },
];
