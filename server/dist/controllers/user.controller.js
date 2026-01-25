"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.createUser = void 0;
// src/controllers/user.controller.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createUser = async (data) => {
    return await prisma.user.create({ data });
};
exports.createUser = createUser;
const getUsers = async () => {
    return await prisma.user.findMany();
};
exports.getUsers = getUsers;
