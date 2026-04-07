import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

router.use(requireAuth as any);

router.post('/', async (req: Request, res: Response) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    res.status(400).json({ error: 'Latitude and longitude are required' });
    return;
  }

  try {
    const location = await prisma.gps.create({
      data: {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      },
    });
    res.json(location);
  } catch (error) {
    console.error('Error saving location:', error);
    res.status(500).json({ error: 'Failed to save location' });
  }
});

export default router;