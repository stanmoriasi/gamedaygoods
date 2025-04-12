import { Schema, model, Document } from 'mongoose';


interface IProduct extends Document {
  productName: string;
  category: string;
   description: string;
  price: number;
  quantity: number;
  createdAt: Date;
  images: string[];
 
}

// Define the schema for the Product document
const productSchema = new Schema<IProduct>(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
        type: String,
        required: false,
        trim: true,
        },
    
    description: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: false,
    },
    quantity: {
        type: Number,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    images: {
        type: [String],
        required: false,
    },
  }
);

const Product = model<IProduct>('Product', productSchema);

export default Product;
