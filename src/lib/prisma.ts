import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
        log: ["query", "info", "warn", "error"],
    });

// @ts-ignore
prisma.$on("query", (e) => {
// @ts-ignore
    console.log(e.query);
// @ts-ignore
    console.log(e.params);
});

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}