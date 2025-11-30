import { PrismaClient } from "../generated/prisma";
import { Pool } from "@prisma/adapter-pg";

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize Prisma Client with adapter
const prisma = new PrismaClient({
  adapter: pool,
});

export default prisma;
