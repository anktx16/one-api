import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const result = await prisma.$queryRaw`SELECT current_user, current_database()`;
  console.log(result);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
