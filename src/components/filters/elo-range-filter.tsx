import { Dispatch, SetStateAction } from "react";
import { SelectFilter } from "./select-filter";
import { IFilterOptions } from "../statistics/gods";

export default function EloFilter({
  setFilterOptions,
  eloFilter,
  eloBins,
}: {
  setFilterOptions: Dispatch<SetStateAction<IFilterOptions>>;
  eloFilter: string;
  eloBins: string[];
}) {
  return (
    <div>
      <SelectFilter
        data={eloBins}
        selectedValue={eloFilter}
        setSelectedValue={(value: string) =>
          setFilterOptions((prev) => ({ ...prev, eloRange: value }))
        }
        getLabel={(eloBin) => eloBin}
        placeholder="Select Elo Range"
      />
    </div>
  );
}
