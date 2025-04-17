import { User } from '../models/index.js';
import Product from '../models/Product.js';
import Orders from '../models/Orders.js';
import { signToken, AuthenticationError } from '../utils/auth.js'; 

// Define types for the arguments
interface AddUserArgs {
  input:{
    username: string;
    email: string;
    password: string;
  }
}

interface LoginUserArgs {
  email: string;
  password: string;
}

interface UserArgs {
  username: string;
}

 interface ProductArgs {
  productId: string;
 }

 interface OrderArgs {
  orderId: string;
}

interface PlaceOrderArgs {
  order: {
    products: {productId: string, quantity: number}[];
    address: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
  };
}

const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },
    user: async (_parent: any, { username }: UserArgs) => {
      return User.findOne({ username });
    },
    products: async () => {
      return Product.find();
    },
    product: async (_parent: any, { productId }: ProductArgs) => {
      return Product.findById(productId);
    },
    orders: async (_parent: any, _args: any, context: any) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');
      return Orders.find({ userId: context.user._id });
    },
    order: async (_parent: any, { orderId }: OrderArgs, context: any) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');
      return Orders.findOne({ _id: orderId, user: context.user._id }).populate('products');
    },
    me: async (_parent: any, _args: any, context: any) => {
      if (context.user) {
        return User.findById(context.user._id).populate('orders');
      }
      throw new AuthenticationError('Could not authenticate user.');
    },
  },

  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs) => {
      const user = await User.create({ ...input });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError('Could not authenticate user.');
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    placeOrder: async (_parent: any, { order }: PlaceOrderArgs, context: any) => {
      if (!context.user) throw new AuthenticationError('You must be logged in to place an order.');

      try {
        if (!order.products || order.products.length === 0) {
          throw new Error('At least one product is required to place an order.');
        }
      
        const newOrder = new Orders({
          userId: context.user._id,
          products: order.products.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          address: order.address,
        });

        const savedOrder = await newOrder.save();

        await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { orders: savedOrder._id } },
        );
        for (const item of order.products) {
          const product = await Product.findById(item.productId);
          if (!product) {
            throw new Error(`Product with ID ${item.productId} not found.`);
          }
    
          // Check if there is enough stock
          if (product.quantity < item.quantity) {
            throw new Error(`Insufficient stock for product: ${product.productName}`);
          }
    
          // Decrement the product quantity
          product.quantity -= item.quantity;
          await product.save();
        }

        return savedOrder;
      } catch (error: unknown) {
        throw new Error(`Failed to place order: ${error}`);
      }
    },
  },
};

export default resolvers;
