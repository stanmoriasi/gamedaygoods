import { Product } from "./product";

// Represents a single product within an order
export interface OrderItem {
  product: Product;
  quantity: number;
}

// Represents the full order
export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Possible order statuses
export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";
