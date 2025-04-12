import { Schema, model, Document } from 'mongoose';

interface IOrder extends Document {
  userId: string;
  products: {
    productId: string;
    quantity: number;
  }[];
  amount: number;
  address: string;
  status: string;
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: String,
      required: true,
    },
    products: [
      {
        productId: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);
const Order = model<IOrder>('Order', orderSchema);
export default Order;

