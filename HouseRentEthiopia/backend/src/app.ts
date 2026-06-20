import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('House Rent Ethiopia API is running!');
});

export default app;