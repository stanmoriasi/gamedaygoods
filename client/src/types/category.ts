export type CategoryName = "Soccer" | "Tennis" | "Golf" | "Baseball";

export interface Category {
  _id: string;
  name: CategoryName;
  description?: string;
}

// Optional: useful for dynamic dropdown rendering
export const CATEGORY_NAMES: CategoryName[] = [
  "Soccer",
  "Tennis",
  "Golf",
  "Baseball",
];
