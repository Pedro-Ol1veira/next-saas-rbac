import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL ?? "";
const url = new URL(connectionString);
const schema = url.searchParams.get('schema');

const adapter = new PrismaPg({ connectionString }, { schema: schema ?? "public" });

export const prisma = new PrismaClient({ adapter });

 