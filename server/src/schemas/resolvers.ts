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

interface OrderInput {
  products: string[]; // Array of product IDs
  total: number; // Total amount for the order
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
    cart: async (_parent: any, _args: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to view the cart.');
      }
    
      // Try to find existing cart
      let cart = await Orders.findOne({
        userId: context.user._id,
        status: 'cart',
      }).populate('products.productId');
    
      // If no cart, create one
      if (!cart) {
        cart = await Orders.create({
          userId: context.user._id,
          products: [],
          amount: 0,
          address: '',
          status: 'cart',
          createdAt: new Date(),
        });
        return cart;
      }
    
      // Calculate total from populated products
      let total = 0;
      if (cart.products && cart.products.length > 0) {
        for (const item of cart.products) {
          const product: any = item.productId;
          const quantity = item.quantity || 1;
          if (product && product.price != null) {
            total += product.price * quantity;
          }
        }
      }
    
      // Update cart amount and return
      cart.amount = total;
      await cart.save();
      return cart;
    }
  },

  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs) => {
      const user = await User.create({ ...input });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    addOrder: async (_parent: any, { input }: { input: OrderInput }, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to place an order.');
      }
    
      const newOrder = await Orders.create({
        user: context.user._id,
        products: input.products, // assuming input has a 'products' array of product IDs
        total: input.total,
      });
    
      // Optionally, you can also push the new order to the user's record
      await User.findByIdAndUpdate(context.user._id, {
        $push: { orders: newOrder._id },
      });
    
      return newOrder;
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
        amount: total,
        createdAt: new Date(),
      });
      for (const product of products) {
        product.quantity -= 1; // Decrement the quantity by 1
        await product.save(); // Save the updated product
      }

      await User.findByIdAndUpdate(context.user._id, {
        $addToSet: { orders: order._id },
      });

      return (await order.populate('products'));
    },
  },
};

export default resolvers;
