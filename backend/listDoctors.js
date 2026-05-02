import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from './models/userSchema.js';

dotenv.config({ path: './config/config.env' });

try {
  await mongoose.connect(process.env.MONGO_URI);
  const doctors = await User.find({ role: 'Doctor' }).select('-password');
  console.log('doctors', doctors);
} catch (err) {
  console.error(err);
  process.exit(1);
} finally {
  await mongoose.disconnect();
}
