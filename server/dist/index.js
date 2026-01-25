"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const location_routes_1 = __importDefault(require("./routes/location.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/location', location_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.get('/', (_req, res) => {
    res.send('API running from the backend 🎉');
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
