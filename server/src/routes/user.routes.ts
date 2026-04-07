import { Router, Request, Response } from 'express';
import { createUser, getUsers } from '../controllers/user.controller';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

router.use(requireAuth as any);

router.get('/', requireRole('admin') as any, async (_req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching users');
  }
});


router.put('/:id', requireRole('admin') as any, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { f_name, l_name, phone_num } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { idUser: parseInt(id) },
      data: { f_name, l_name, phone_num },
      select: {
        idUser: true,
        f_name: true,
        l_name: true,
        phone_num: true,
        role: true,
      }
    });
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/:id', requireRole('admin') as any, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { idUser: parseInt(id) } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;