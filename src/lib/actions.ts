'use server';
import {userSchema} from '@/lib/data-validation';
import {revalidatePath} from "next/cache";
import {z} from 'zod';
import {redirect} from "next/navigation";
import {PrismaClient, Product} from "@/generated/prisma/client";
import {prisma} from '@/lib/prisma'

export async function goUp(prevState: number, formData: FormData) {
    return prevState + 1;
}


export async function getProducts(search?: { name: string }): Promise<Product[]> {
    return await prisma.product.findMany({
        where: {
            name: {
                contains: search?.name ?? '',
                mode: 'insensitive'
            }
        },
        orderBy: {
            name: 'asc'
        }
    });
}

export async function getUsers() {
    const users = await prisma.user.findMany();

    return users;
}

export async function createUser(prevState: State, formData: FormData) {
    const userValidation = userSchema.omit({id: true});
    const newUser = userValidation.safeParse(
        {
            username: formData.get('username'),
            email: formData.get('email'),
        });

    if (newUser.success) {
        const user = await prisma.user.create({
            data: {
                name: newUser.data.username,
                email: newUser.data.email,
            },
        });
    } else {
        return {
            errors: (z.flattenError(newUser.error).fieldErrors),
            message: 'Missing Fields. Failed to Create new user.',
        };
    }
    revalidatePath('/');
    return {
        errors: {},
        message: 'Success'
    }
}

export type State = {
    message: string | null;
    errors: {
        username?: string[];
        email?: string[];
    };
};