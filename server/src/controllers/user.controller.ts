import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (data: {
  f_name: string;
  l_name: string;
  phone_num: string;
  email?: string;
  password?: string;
  role?: string;
}) => {
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

export const getUsers = async () => {
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