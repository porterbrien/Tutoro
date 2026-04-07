import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const deleted = await prisma.user.deleteMany({});
  console.log(`Deleted ${deleted.count} users`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());