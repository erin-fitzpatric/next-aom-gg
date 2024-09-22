import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";

export function usePagination() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [pagination, setPagination] = useState({
    pageSize: 50,
    pageIndex: 0,
  });

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    setPagination((prev) => ({ ...prev, pageIndex: page - 1 }));
  }, [searchParams]);

  const { pageSize, pageIndex } = pagination;

  const goToPage = useCallback(
    (newPageIndex: number) => {
      setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", (newPageIndex + 1).toString());
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
