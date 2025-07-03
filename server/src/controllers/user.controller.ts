// src/controllers/user.controller.ts
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (data: Prisma.userCreateInput) => {
  return await prisma.user.create({ data });
};

export const getUsers = async () => {
  return await prisma.user.findMany();
};