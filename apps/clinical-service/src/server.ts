import 'dotenv/config';
import mongoose from 'mongoose';
import { createApp } from './app.js';
import { connectMongo } from './lib/mongoose.js';

const PORT = Number(process.env.PORT ?? 3003);

async function main(): Promise<void> {
  await connectMongo(); // fail-fast: Atlas sai thì crash ngay, khỏi test mới biết
  createApp().listen(PORT, () => {
    console.log(`clinical-service listening on :${PORT}`);
  });
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});