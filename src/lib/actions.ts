import { prisma } from "@/lib/prisma";

export async function createUser() {
    const user = await prisma.user.create({
        data: {
            email: "john@example.com",
            name: "John",
        },
    });

    return user;
}