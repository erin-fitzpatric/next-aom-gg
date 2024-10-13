import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const rowOptions = [50, 100, 200]

  const searchParams = useSearchParams();
  const rows = searchParams.get("rows");
  const queryParams = useQueryParams({ rows: "50" });

  useEffect(() => {
    if (rowOptions.includes(Number(rows))) {
      table.setPageSize(Number(rows))
      return
    }
    table.setPageSize(rowOptions[0])
  }, []);

  return (
    <div className="flex px-2">
      {/* Left-aligned content */}
      <div className="flex items-center">
        <p className="text-sm font-medium">Rows per page</p>
        <div className="pl-2">
          <select
            className="text-base p-1 border border-gray-300 rounded w-full"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
              queryParams.rows(e.target.value);
            }}
          >
            {rowOptions.map((pageSize) => (
              <option
                className="font-normal text-base"
                key={pageSize}
                value={pageSize}
              >
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Center-aligned content */}
      <div className="flex items-center justify-center text-sm font-medium flex-1">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount() || 1}
      </div>

      {/* Right-aligned content */}
      <div className="flex items-center justify-end">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to first page</span>
          <DoubleArrowLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to last page</span>
          <DoubleArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
