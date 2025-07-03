// src/controllers/user.controller.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (data: {
  f_name: string;
  l_name: string;
  phone_num: string;
}) => {
  return await prisma.user.create({ data });
};

export const getUsers = async () => {
  return await prisma.user.findMany();
};
