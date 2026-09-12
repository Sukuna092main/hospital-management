import mongoose from 'mongoose';

export async function connectMongo(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI in .env');
  if (mongoose.connection.readyState === 1) return; // tsx watch reload: đã nối thì thôi
  await mongoose.connect(uri);
  console.log('clinical-service connected to MongoDB');
}