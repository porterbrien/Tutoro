"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { phone_num, password } = req.body;
    if (!phone_num || !password) {
        res.status(400).json({ error: 'Phone number and password are required' });
        return;
    }
    try {
        const user = await prisma.user.findFirst({
            where: { phone_num }
        });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            idUser: user.idUser,
            f_name: user.f_name,
            role: user.role,
        }, JWT_SECRET, { expiresIn: '8h' });
        res.json({
            token,
            user: {
                idUser: user.idUser,
                f_name: user.f_name,
                role: user.role,
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});
// POST /api/auth/register  (admin use only for now)
router.post('/register', async (req, res) => {
    const { f_name, l_name, phone_num, password, role } = req.body;
    if (!f_name || !l_name || !phone_num || !password) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }
    try {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                f_name,
                l_name,
                phone_num,
                password: hashedPassword,
                role: role || 'client',
            }
        });
        res.json({
            idUser: user.idUser,
            f_name: user.f_name,
            role: user.role,
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});
exports.default = router;
