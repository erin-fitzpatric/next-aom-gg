import { Dispatch, SetStateAction } from "react";

export default function EloFilter({
  setEloFilter,
  eloFilter,
  eloBins,
}: {
  setEloFilter: Dispatch<SetStateAction<string>>;
  eloFilter: string;
  eloBins: string[];
}) {
  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-end text-primary p-4 w-full">
      <div className="flex items-center">
        <label htmlFor="elo-filter" className="mr-2">
          Filter By Elo:
        </label>
        <select
          id="elo-filter"
          className="border border-primary rounded-md p-1"
          value={eloFilter}
          onChange={(e) => setEloFilter(e.target.value)}
        >
          {eloBins.map((eloBin) => (
            <option key={eloBin} value={eloBin}>
              {eloBin}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}