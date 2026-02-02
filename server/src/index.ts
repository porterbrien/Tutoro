// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import locationRoutes from './routes/location.routes';


dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(cors());
app.use(express.json());
app.use('/api/location', locationRoutes);

app.use('/api/users', userRoutes);

app.get('/', (_req, res) => {
  res.send('API running from the backend 🎉');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
