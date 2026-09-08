import 'dotenv/config';
import { createApp } from './app.js';

const PORT = Number(process.env.PORT ?? 3002);
const app = createApp();

app.listen(PORT, () => {
  console.log(`scheduling-service listening on :${PORT}`);
});