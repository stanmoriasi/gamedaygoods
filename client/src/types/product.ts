export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string; // URL to the product image
  category: string; // category ID or name
  stock: number;
  rating?: number; // optional average rating
  reviews?: Review[]; // optional array of reviews
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  _id: string;
  userId: string;
  username: string;
  rating: number; // 1–5
  comment: string;
  createdAt: string;
}
