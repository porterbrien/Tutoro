"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_service_1 = require("../services/email.service");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
// Generate a random 6-digit code
const generateMFACode = () => Math.floor(100000 + Math.random() * 900000).toString();
// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { f_name, l_name, phone_num, email, password, role } = req.body;
    if (!f_name || !l_name || !phone_num || !email || !password) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }
    try {
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ phone_num }, { email }] }
        });
        if (existingUser) {
            res.status(409).json({
                error: existingUser.email === email
                    ? 'An account with this email already exists'
                    : 'An account with this phone number already exists'
            });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                f_name,
                l_name,
                phone_num,
                email,
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
// POST /api/auth/login — verifies credentials then sends MFA code
router.post('/login', async (req, res) => {
    const { phone_num, password } = req.body;
    if (!phone_num || !password) {
        res.status(400).json({ error: 'Phone number and password are required' });
        return;
    }
    try {
        const user = await prisma.user.findFirst({ where: { phone_num } });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        // Generate MFA code
        const code = generateMFACode();
        const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        // Store code in database
        await prisma.user.update({
            where: { idUser: user.idUser },
            data: { mfa_code: code, mfa_expiry: expiry }
        });
        // Send email
        await (0, email_service_1.sendMFACode)(user.email, code, user.f_name);
        // Return partial info so frontend knows where to send the user
        res.json({
            message: 'Verification code sent',
            userId: user.idUser,
            email: user.email.replace(/(.{2}).*(@.*)/, '$1***$2'), // mask email
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});
// POST /api/auth/verify — validates MFA code and issues JWT
router.post('/verify', async (req, res) => {
    const { userId, code } = req.body;
    if (!userId || !code) {
        res.status(400).json({ error: 'User ID and code are required' });
        return;
    }
    try {
        const user = await prisma.user.findUnique({
            where: { idUser: parseInt(userId) }
        });
        if (!user || !user.mfa_code || !user.mfa_expiry) {
            res.status(401).json({ error: 'Invalid or expired code' });
            return;
        }
        // Check expiry
        if (new Date() > user.mfa_expiry) {
            res.status(401).json({ error: 'Code has expired. Please log in again.' });
            return;
        }
        // Check code
        if (user.mfa_code !== code) {
            res.status(401).json({ error: 'Incorrect code. Please try again.' });
            return;
        }
        // Clear MFA code
        await prisma.user.update({
            where: { idUser: user.idUser },
            data: { mfa_code: null, mfa_expiry: null }
        });
        // Issue JWT
        const token = jsonwebtoken_1.default.sign({ idUser: user.idUser, f_name: user.f_name, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
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
        console.error('Verify error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});
// POST /api/auth/resend — resends MFA code
router.post('/resend', async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
    }
    try {
        const user = await prisma.user.findUnique({
            where: { idUser: parseInt(userId) }
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const code = generateMFACode();
        const expiry = new Date(Date.now() + 10 * 60 * 1000);
        await prisma.user.update({
            where: { idUser: user.idUser },
            data: { mfa_code: code, mfa_expiry: expiry }
        });
        await (0, email_service_1.sendMFACode)(user.email, code, user.f_name);
        res.json({ message: 'New code sent' });
    }
    catch (error) {
        console.error('Resend error:', error);
        res.status(500).json({ error: 'Failed to resend code' });
    }
});
exports.default = router;
