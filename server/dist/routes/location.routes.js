"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.post('/', async (req, res) => {
    // latitude throwing errors for not specifing the type
    const { latitude, longitude } = req.body;
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
        console.error('❌ Error saving location:', error);
        res.status(500).json({ error: 'Failed to save location' });
    }
});
exports.default = router;
