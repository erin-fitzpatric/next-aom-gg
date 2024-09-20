import { Dispatch, SetStateAction } from "react";
import { IFilterOptions } from "./statistics";

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
    <div className="flex items-center text-primary px-1">
      <select
        id="elo-filter"
        className="border border-primary rounded-md p-1"
        value={eloFilter}
        onChange={(e) =>
          setFilterOptions((prev) => ({ ...prev, eloRange: e.target.value }))
        }
      >
        {eloBins.map((eloBin) => (
          <option key={eloBin} value={eloBin}>
            {eloBin}
          </option>
        ))}
      </select>
    </div>
  );
}
