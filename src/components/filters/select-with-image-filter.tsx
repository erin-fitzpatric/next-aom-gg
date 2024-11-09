import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Image from "next/image";

interface SelectWithImageProps<T> {
  data: T[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  getLabel: (item: T) => string;
  getImageSrc: (item: T) => string;
  placeholder?: string;
}

export function SelectWithImage<T>({
  data,
  selectedValue,
  setSelectedValue,
  getLabel,
  getImageSrc,
  placeholder = "Select an option",
}: SelectWithImageProps<T>) {
  const selectedItem = data.find((item) => getLabel(item) === selectedValue);

  return (
    <Select value={selectedValue} onValueChange={setSelectedValue}>
      <SelectTrigger className="border border-primary rounded-md p-2 text-primary sm:w-full md:w-auto">
        <SelectValue>
          {selectedItem ? (
            <div className="flex items-center">
              <Image
                src={getImageSrc(selectedItem)}
                alt={getLabel(selectedItem)}
                width={24}
                height={24}
                className="mr-2"
              />
              {getLabel(selectedItem)}
            </div>
          ) : (
            placeholder
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {data.map((item) => (
          <SelectItem key={getLabel(item)} value={getLabel(item)}>
            <div className="flex items-center">
              <Image
                src={getImageSrc(item)}
                alt={getLabel(item)}
                width={24}
                height={24}
                className="mr-2"
              />
              {getLabel(item)}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
