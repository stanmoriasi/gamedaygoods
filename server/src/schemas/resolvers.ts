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
  input: {
    products: string[];
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
      return Orders.find({ user: context.user._id }).populate('products');
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

    placeOrder: async (_parent: any, { input }: PlaceOrderArgs, context: any) => {
      if (!context.user) throw new AuthenticationError('You must be logged in to place an order.');

      const products = await Product.find({ _id: { $in: input.products } });
      const total = products.reduce((sum, product) => sum + product.price, 0);

      const order = await Orders.create({
        user: context.user._id,
        products: products.map((p) => p._id),
        total,
        createdAt: new Date(),
      });

      await User.findByIdAndUpdate(context.user._id, {
        $addToSet: { orders: order._id },
      });

      return order.populate('products');
    },
  },
};

export default resolvers;
