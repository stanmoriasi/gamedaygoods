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
      required: false,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
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
      default: 0,
    },
    address: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'cancelled', 'cart'],
      default: 'cart',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);
const Order = model<IOrder>('Order', orderSchema);
export default Order;

