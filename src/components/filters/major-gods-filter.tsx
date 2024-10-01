import { listMajorGods } from "@/types/MajorGods";
import { SelectWithImage } from "./select-with-image-filter";

interface MajorGodFilterProps {
  civilization: string;
  setCivilization: (value: string) => void;
  includeAllOption?: boolean; // New prop to include "All Gods"
}

export function MajorGodFilter({
  civilization,
  setCivilization,
  includeAllOption,
}: MajorGodFilterProps) {
  const majorGods = listMajorGods();

  const godsWithAllOption = includeAllOption
    ? [
        {
          name: "All Gods",
          portraitPath: "/gods/greeks/major-gods/UI_god_pantheon_Greek.png",
        },
        ...majorGods,
      ] // Something better can be created for all gods image later
    : majorGods;

  return (
    <SelectWithImage
      data={godsWithAllOption}
      selectedValue={civilization || "All Gods"}
      setSelectedValue={setCivilization}
      getLabel={(god) => god.name}
      getImageSrc={(god) => god.portraitPath}
      placeholder="Select Major God"
    />
  );
}
