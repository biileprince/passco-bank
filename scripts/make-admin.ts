/**
 * Script to make a user an admin
 * Usage: npx tsx scripts/make-admin.ts <email>
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(__dirname, "../.env") });

// Create Prisma client with adapter
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function makeAdmin(email: string) {
  if (!email) {
    console.error("Usage: npx tsx scripts/make-admin.ts <email>");
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: "admin" },
    });

    console.log(`✅ Successfully made ${user.email} an admin!`);
    console.log(`Name: ${user.name || "N/A"}`);
    console.log(`Role: ${user.role}`);
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      console.error(`❌ User with email "${email}" not found.`);
    } else {
      console.error("Error:", error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2];
makeAdmin(email);
