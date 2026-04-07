"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.use(auth_middleware_1.requireAuth);
router.post('/', async (req, res) => {
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude) {
        res.status(400).json({ error: 'Latitude and longitude are required' });
        return;
    }
    try {
        const location = await prisma.gps.create({
            data: {
                latitude: latitude.toString(),
                longitude: longitude.toString(),
            },
        });
        res.json(location);
    }
    catch (error) {
        console.error('Error saving location:', error);
        res.status(500).json({ error: 'Failed to save location' });
    }
});
exports.default = router;
