"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createUser = async (data) => {
    return await prisma.user.create({
        data: {
            f_name: data.f_name,
            l_name: data.l_name,
            phone_num: data.phone_num,
            email: data.email ?? '',
            password: data.password ?? '',
            role: data.role ?? 'client',
        }
    });
};
exports.createUser = createUser;
const getUsers = async () => {
    return await prisma.user.findMany({
        select: {
            idUser: true,
            f_name: true,
            l_name: true,
            phone_num: true,
            email: true,
            role: true,
        }
    });
};
exports.getUsers = getUsers;
