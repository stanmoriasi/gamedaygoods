// Define the shape of a Category object
export interface Category {
  _id: string;
  name: CategoryName;
  description?: string;
}

// Define possible category names — can add more as needed
export type CategoryName = "Soccer" | "Tennis" | "Golf" | "Baseball";
