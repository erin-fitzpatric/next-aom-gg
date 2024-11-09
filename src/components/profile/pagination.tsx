import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "../ui/pagination";

export function PaginationComponent({
  totalPages,
  pagination,
  handleFirstPageClick,
  handlePageClick,
  handleLastPageClick,
  showPages,
}: {
  totalPages: number;
  pagination: { pageIndex: number };
  handleFirstPageClick: () => void;
  handlePageClick: (page: number) => void;
  handleLastPageClick: () => void;
  showPages: number[];
}) {
  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            onClick={handleFirstPageClick}
            className={`hover:cursor-pointer ${
              pagination.pageIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="First Page"
          >
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>

        {showPages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => handlePageClick(page - 1)}
              aria-current={
                pagination.pageIndex === page - 1 ? "page" : undefined
              }
              className="hover:cursor-pointer"
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationLink
            onClick={handleLastPageClick}
            className={`hover:cursor-pointer ${
              pagination.pageIndex === totalPages - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            aria-label="Last Page"
          >
            <DoubleArrowRightIcon className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
