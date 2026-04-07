"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const client_1 = require("@prisma/client");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.use(auth_middleware_1.requireAuth);
router.get('/', (0, auth_middleware_1.requireRole)('admin'), async (_req, res) => {
    try {
        const users = await (0, user_controller_1.getUsers)();
        res.json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error fetching users');
    }
});
router.put('/:id', (0, auth_middleware_1.requireRole)('admin'), async (req, res) => {
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
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});
router.delete('/:id', (0, auth_middleware_1.requireRole)('admin'), async (req, res) => {
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
