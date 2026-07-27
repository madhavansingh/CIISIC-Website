import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Attempting database connection with Prisma...");
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    console.log("Database connection successful!", result);
  } catch (error) {
    console.error("Prisma connection error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
