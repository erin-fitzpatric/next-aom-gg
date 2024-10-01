import { listMajorGods } from "@/types/MajorGods";
import { SelectWithImage } from "./select-with-image-filter";
import { ALL_GODS } from "@/utils/consts";

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
          name: ALL_GODS,
          portraitPath: "/gods/greeks/major-gods/UI_god_pantheon_Greek.png",
        },
        ...majorGods,
      ] // Something better can be created for all gods image later
    : majorGods;

  return (
    <SelectWithImage
      data={godsWithAllOption}
      selectedValue={civilization || ALL_GODS}
      setSelectedValue={setCivilization}
      getLabel={(god) => god.name}
      getImageSrc={(god) => god.portraitPath}
      placeholder="Select Major God"
    />
  );
}
