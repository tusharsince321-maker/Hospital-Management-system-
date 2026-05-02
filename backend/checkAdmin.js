import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from './models/userSchema.js';

dotenv.config({ path: './config/config.env' });

try {
  await mongoose.connect(process.env.MONGO_URI);
  const count = await User.countDocuments({ role: 'Admin' });
  const admin = await User.findOne({ role: 'Admin' }).select('-password');
  console.log('adminCount', count);
  console.log('admin', admin);
} catch (err) {
  console.error('ERROR', err);
  process.exit(1);
} finally {
  await mongoose.disconnect();
}
