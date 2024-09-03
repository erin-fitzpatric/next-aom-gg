import { type ClassValue, clsx } from "clsx";
import mongoose from "mongoose";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type MetadataSchemaEntries<T extends (...args: any) => any> = {
  [key: string]: { type: T; default: ReturnType<T>; required: boolean };
};

export function recMetadataSchemaHelper<T extends (...args: any) => any>(
  keyArray: ReadonlyArray<string>,
  valueType: T,
  defaultValue: ReturnType<T>,
  isRequired: boolean,
) {
  const obj: MetadataSchemaEntries<T> = {};
  for (const keyName of keyArray) {
    obj[keyName] = { type: valueType, default: defaultValue, required: isRequired };
  }
  return obj;
}