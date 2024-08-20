import { SortOrder } from "mongoose";

export type MongoSort = {
  [key: string]: SortOrder;
};
