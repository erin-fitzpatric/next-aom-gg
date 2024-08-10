import { Input } from "@/components/ui/input";
import { getMythRecs } from "@/server/controllers/mongo-controller";
import React, { useState } from "react";
import { FilterProps } from "@/types/Filters";
import { debounce } from "lodash";

export default function RecSearch({
  setRecs,
  setIsLoading,
  filters,
  setFilters,
}: FilterProps) {
  const [query, setQuery] = useState("");

  // Debounced version of the handleInputChange function
  const debouncedHandleInputChange = debounce(
    async (searchQueryString: string) => {
      setIsLoading(true);
      const updatedFilters = { ...filters, searchQueryString };
      setFilters(updatedFilters);
      const recs = await getMythRecs(0, updatedFilters);
      if (recs) {
        setRecs(recs);
      }
      setIsLoading(false);
    },
    300
  ); // Adjust the debounce delay as needed

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const searchQueryString = e.target.value;
    setQuery(searchQueryString);
    if (searchQueryString.length > 3 || searchQueryString.length === 0) {
      debouncedHandleInputChange(searchQueryString);
    }
  }

  return (
<div className="w-full sm:w-[240px] text-primary">
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
