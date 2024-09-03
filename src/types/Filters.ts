import { Dispatch, SetStateAction } from "react";

export type Filters = {
  godIds?: number[];
  mapNames?: string[];
  searchQueryString?: string;
  buildNumbers?: number[];
};

export interface FilterProps {
  setRecs: Dispatch<SetStateAction<any[]>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setFilters: Dispatch<SetStateAction<Filters>>;
  filters: Filters;
  buildNumbers?: number[];
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  selectedBuild: number | null;
  setSelectedBuild: Dispatch<SetStateAction<number | null>>;
}
