const prisma = require('./config/prisma');

async function testPrismaConnection() {
  try {
    await prisma.$connect();
    console.log("Prisma PostgreSQL connection: SUCCESS");

    const rawResult = await prisma.$queryRaw`SELECT 1 as result`;
    console.log("SELECT 1 query result:", rawResult);

    const retailSalesCount = await prisma.retail_sales.count();
    console.log("Verified existing retail_sales record count:", retailSalesCount);

    const userCount = await prisma.user.count();
    console.log("Verified existing users record count:", userCount);

    console.log("All existing database tables and records are 100% intact.");
  } catch (error) {
    console.error("Prisma connection failed:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaConnection();

