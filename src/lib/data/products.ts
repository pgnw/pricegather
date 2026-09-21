import {prisma} from "@/lib/prisma";
import {Product} from "@/generated/prisma/client";

export async function getProducts(productName?: string, limit?: number, offset?: number): Promise<Product[]> {
    const productsPromise = prisma.product.findMany({
        where: {
            name: {
                contains: productName,
                mode: 'insensitive'
            }
        },
        orderBy: {
            name: 'asc'
        },
        take: limit,
        skip: offset
    });

    return productsPromise;
}

export async function createProduct(product: Product): Promise<Product> {
    const newProduct = prisma.product.create({data: product});

    return newProduct;
}