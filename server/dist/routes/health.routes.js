"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.use(auth_middleware_1.requireAuth);
// GET /api/health/:userId — get health profile
router.get('/:userId', async (req, res, next) => {
    const { userId } = req.params;
    const requestingUser = req.user;
    // Clients can only view their own health profile
    if (requestingUser.role === 'client' && requestingUser.idUser !== parseInt(userId)) {
        res.status(403).json({ error: 'Forbidden' });
        return;
    }
    try {
        const profile = await prisma.health_profile.findUnique({
            where: { user_id: parseInt(userId) }
        });
        if (!profile) {
            // Return empty profile if none exists yet
            res.json({
                user_id: parseInt(userId),
                medical_history: '',
                allergies: '',
                current_medications: '',
                previous_medications: '',
                blood_type: '',
                emergency_notes: '',
            });
            return;
        }
        res.json(profile);
    }
    catch (error) {
        console.error('Error fetching health profile:', error);
        res.status(500).json({ error: 'Failed to fetch health profile' });
    }
});
// PUT /api/health/:userId — save health profile
router.put('/:userId', async (req, res, next) => {
    const { userId } = req.params;
    const requestingUser = req.user;
    if (requestingUser.role === 'client' && requestingUser.idUser !== parseInt(userId)) {
        res.status(403).json({ error: 'Forbidden' });
        return;
    }
    // Handle empty body gracefully
    const body = req.body || {};
    const { medical_history = '', allergies = '', current_medications = '', previous_medications = '', blood_type = '', emergency_notes = '', } = body;
    try {
        const profile = await prisma.health_profile.upsert({
            where: { user_id: parseInt(userId) },
            update: {
                medical_history,
                allergies,
                current_medications,
                previous_medications,
                blood_type,
                emergency_notes,
            },
            create: {
                user_id: parseInt(userId),
                medical_history,
                allergies,
                current_medications,
                previous_medications,
                blood_type,
                emergency_notes,
            }
        });
        res.json(profile);
    }
    catch (error) {
        console.error('Error saving health profile:', error);
        res.status(500).json({ error: 'Failed to save health profile' });
    }
});
exports.default = router;
