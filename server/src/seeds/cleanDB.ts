import { Thought, User, Product } from '../models/index.js';
import process from 'process';

const cleanDB = async (): Promise<void> => {
  try {
    // Delete documents from THought collection
    await Thought.deleteMany({});
    console.log('Thought collection cleaned.');

    // Delete documents from User collection
    await User.deleteMany({});
    console.log('User collection cleaned.');

    // Delete documents from Product collection
    await Product.deleteMany({});
    console.log('Product collection cleaned.');

  } catch (err) {
    console.error('Error cleaning collections:', err);
    process.exit(1);
  }
};

export default cleanDB;
