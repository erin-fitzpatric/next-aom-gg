import { Dispatch, SetStateAction } from "react";
import { MajorGods } from "@/types/MajorGods";
import { IFilterOptions } from "./gods"; // Import the correct interface

interface MajorGodFilterProps {
  selectedGod: MajorGods | null;
  setFilterOptions: Dispatch<SetStateAction<IFilterOptions>>;
}

export const MajorGodFilter = ({
  selectedGod,
  setFilterOptions,
}: MajorGodFilterProps) => {
  const gods = Object.values(MajorGods); // Get the list of gods

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700">Select God</label>
      <select
        value={selectedGod || ""}
        onChange={(e) =>
          setFilterOptions((prev) => ({
            ...prev,
            godId: e.target.value as any, // Cast the value to MajorGods type
          }))
        }
        className="border rounded p-2"
      >
        <option value="">All Gods</option>
        {gods.map((god) => (
          <option key={god} value={god}>
            {god}
          </option>
        ))}
      </select>
    </div>
  );
};
