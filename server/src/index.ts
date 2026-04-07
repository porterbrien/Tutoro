// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import locationRoutes from './routes/location.routes';
import authRoutes from './routes/auth.routes';
import healthRoutes from './routes/health.routes';
import contactsRoutes from './routes/contacts.routes';


dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Middleware first — always before routes
app.use(cors({
  origin: [
    'https://tutorohealth.com',
    'https://www.tutorohealth.com',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes after middleware
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/contacts', contactsRoutes);

app.get('/', (_req, res) => {
  res.send('API running from the backend 🎉');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});