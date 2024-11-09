import { Input } from "@/components/ui/input";
import { getMythRecs } from "@/server/controllers/mongo-controller";
import React, { useEffect, useRef } from "react";
import { FilterProps } from "@/types/Filters";
import { debounce } from "lodash";

export default function RecSearch({
  setRecs,
  setIsLoading,
  filters,
  setFilters,
  query,
  setQuery,
}: FilterProps) {
  // Create a ref to store the debounced function
  const debouncedHandleInputChange = useRef(
    debounce((searchQueryString: string) => {
      setFilters((prevFilters) => ({ ...prevFilters, searchQueryString }));
    }, 500) // Debounce delay
  ).current;

  // Effect to handle API call when filters change
  // TODO - this should probably be refactored to be called from recorded-games.tsx when the query changes as a dependency
  useEffect(() => {
    const fetchRecs = async () => {
      setIsLoading(true);
      setRecs([]);
      const recs = await getMythRecs(0, filters);
      if (recs) {
        setRecs(recs);
      }
      setIsLoading(false);
    };

    fetchRecs();
  }, [filters, setRecs, setIsLoading]); // Run effect when filters change

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
