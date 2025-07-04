// src/routes/user.routes.ts
import { Router } from 'express';
import { createUser, getUsers } from '../controllers/user.controller';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating user');
  }
});

//TEST 
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

export default router;
