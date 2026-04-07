"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const deleted = await prisma.user.deleteMany({});
    console.log(`Deleted ${deleted.count} users`);
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
