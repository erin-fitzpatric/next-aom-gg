import { Dispatch, SetStateAction } from "react";

export type Filters = {
  godIds?: number[];
  mapNames?: string[];
  searchQueryString?: string;
};

export interface FilterProps {
  setRecs: Dispatch<SetStateAction<any[]>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setFilters: Dispatch<SetStateAction<Filters>>;
  filters: Filters;
}
