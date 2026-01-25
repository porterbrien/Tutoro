"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/user.routes.ts
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.post('/', async (req, res) => {
    try {
        const user = await (0, user_controller_1.createUser)(req.body);
        res.json(user);
    }
    catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Error creating user');
    }
});
//TEST POST
router.post('/test', async (_req, res) => {
    try {
        const user = await (0, user_controller_1.createUser)({
            f_name: 'Test',
            l_name: 'User',
            phone_num: '1234567890'
        });
        res.json(user);
    }
    catch (err) {
        console.error('Test user error:', err.message);
        console.error(err);
        res.status(500).send('Failed to create test user');
    }
});
router.get('/', async (_req, res) => {
    try {
        const users = await (0, user_controller_1.getUsers)();
        res.json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error fetching users');
    }
});
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { f_name, l_name, phone_num } = req.body;
    console.log('🛠️ PUT request body:', req.body);
    console.log('🆔 ID param:', id);
    try {
        const updatedUser = await prisma.user.update({
            where: { idUser: parseInt(id) },
            data: { f_name, l_name, phone_num }
        });
        res.json(updatedUser);
    }
    catch (error) {
        console.error('Error updating user:', error.message);
        console.error(error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({ where: { idUser: parseInt(id) } });
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});
exports.default = router;
