import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
    // latitude throwing errors for not specifing the type
  const { latitude, longitude } = req.body as { latitude: number | string; longitude: number | string };

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
