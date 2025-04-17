import mongoose, { Schema, model, Document, Types } from 'mongoose';

interface IOrder extends Document {
  userId: Types.ObjectId;
  products: {
    productId: Types.ObjectId;
    quantity: number;
  }[];
  amount: number;
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  };
  status: string;
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
      type: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
      },
      required: false,
    },
    status: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

orderSchema.pre<IOrder>('save', async function (next) {
  const productIds = this.products.map((item) => item.productId);
  const products = await mongoose.model('Product').find({ _id: { $in: productIds } });

  let total = 0;
  for (const item of this.products) {
    const product = products.find((p) =>  p._id.toString().includes(item.productId));
    if (!product) {
      return next(new Error(`Product ${item.productId} not found`));
    }
    if (item.quantity > product.quantity) {
      return next(new Error(`Only ${product.quantity} ${product.productName}(s) in stock.`));
    }
    total += item.quantity * product.price;
  }

  this.amount = total;
  next();
});

const Order = model<IOrder>('Order', orderSchema);
export default Order;
