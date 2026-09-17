import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/auth.routes';
import houseRoutes from './routes/house.routes';
import paymentRoutes from './routes/payment.routes';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/houses', houseRoutes);
app.use('/api/v1/payments', paymentRoutes);

app.get('/', (req, res) => {
  res.send('House Rent Ethiopia API is running!');
});

// Vercel serverless handler endpoint.
export default app;