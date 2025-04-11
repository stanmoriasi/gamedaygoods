import db from '../config/connection.js';
import { Thought, User, Product } from '../models/index.js';
import cleanDB from './cleanDB.js';

import userData from './userData.json' with { type: 'json'};
import thoughtData from './thoughtData.json' with { type: 'json' };
import productData from './productData.json' with { type: 'json' };

const seedDatabase = async (): Promise<void> => {
  try {
    await db();
    await cleanDB();

    await Thought.insertMany(thoughtData);
    await User.create(userData);
    await Product.insertMany(productData);
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
