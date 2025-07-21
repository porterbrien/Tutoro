// src/routes/user.routes.ts
import { Router } from 'express';
import { createUser, getUsers } from '../controllers/user.controller';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating user');
  }
});

//TEST POST
router.post('/test', async (_req, res) => {
  try {
    const user = await createUser({
      f_name: 'Test',
      l_name: 'User',
      phone_num: '1234567890'
    });
    res.json(user);
  } catch (err: any) {
    console.error('❌ Test user error:', err.message);
    console.error(err);
    res.status(500).send('Failed to create test user');
  }
});

router.get('/', async (_req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching users');
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { f_name, l_name, phone_num } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { idUser: parseInt(id) },
      data: { f_name, l_name, phone_num }
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({ where: { idUser: parseInt(id) } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});


export default router;
