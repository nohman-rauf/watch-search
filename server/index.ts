import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import { whatsappClient } from './whatsapp';
import { getSession } from './db';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(routes);

async function startServer() {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  const session = await getSession();
  if (session && session.status === 'connected') {
    console.log('Attempting to restore WhatsApp connection...');
    try {
      await whatsappClient.connect();
    } catch (error) {
      console.error('Failed to restore WhatsApp connection:', error);
    }
  }
}

startServer();
