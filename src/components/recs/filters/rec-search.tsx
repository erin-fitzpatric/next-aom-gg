import { Input } from "@/components/ui/input";
import React, { Dispatch, SetStateAction, useRef } from "react";
import { Filters } from "@/types/Filters";
import { debounce } from "lodash";

export default function RecSearch({
  setFilters,
  query,
  setQuery,
}: {
  setFilters: Dispatch<SetStateAction<Filters>>;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}) {
  // Create a ref to store the debounced function
  const debouncedHandleInputChange = useRef(
    debounce((searchQueryString: string) => {
      setFilters((prevFilters) => ({ ...prevFilters, searchQueryString }));
    }, 500), // Debounce delay
  ).current;

  // We no longer need to fetch data here as it's now handled in recorded-games.tsx
  // The useEffect hook that was here has been removed as part of centralizing data fetching

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const searchQueryString = e.target.value;
    setQuery(searchQueryString);
    if (searchQueryString.length > 3 || searchQueryString.length === 0) {
      debouncedHandleInputChange(searchQueryString);
    }
  }

  return (
    <div className="w-full sm:w-[240px] lg:w-[300px] text-primary">
      <Input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
      />
    </div>
  );
}
