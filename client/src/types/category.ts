// Define the shape of a Category object
export interface Category {
  _id: string;
  name: CategoryName;
  description?: string;
}

// Define possible category names — can add more as needed
export type CategoryName =
  | "Apparel"
  | "Footwear"
  | "Equipment"
  | "Accessories"
  | "Fan Gear"
  | "Training"
  | "Recovery"
  | "Electronics";
