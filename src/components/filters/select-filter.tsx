import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface SelectFilterProps<T> {
  data: T[];
  selectedValue: string; // The value is either a number or string, but generally a string
  setSelectedValue: (value: string) => void; // It will pass the value as a string
  getLabel: (item: T) => string;
  getValue?: (item: T) => string; // Optional function to get the value (e.g., buildNumber as a string)
  placeholder?: string;
}

export function SelectFilter<T>({
  data,
  selectedValue,
  setSelectedValue,
  getLabel,
  getValue,
  placeholder = "Select an option",
}: SelectFilterProps<T>) {
  const selectedItem = data.find((item) => {
    if (getValue) {
      return getValue(item) === selectedValue;
    }
    return getLabel(item) === selectedValue;
  });

  return (
    <Select value={selectedValue} onValueChange={setSelectedValue}>
      <SelectTrigger className="border border-primary rounded-md p-2 text-primary sm:w-full md:w-auto">
        <SelectValue>
          {selectedItem ? getLabel(selectedItem) : placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {data.map((item) => (
          <SelectItem key={getValue ? getValue(item) : getLabel(item)} value={getValue ? getValue(item) : getLabel(item)}>
            {getLabel(item)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
