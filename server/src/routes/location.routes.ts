import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    const location = await prisma.gps_saved_location.create({
      data: {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      },
    });
    res.json(location);
  } catch (error) {
    console.error('❌ Error saving location:', error);
    res.status(500).json({ error: 'Failed to save location' });
  }
});

export default router;
