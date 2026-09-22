import {prisma} from "@/lib/prisma";
import {Product} from "@/generated/prisma/client";
import {store} from "next/dist/build/output/store";
import {SortOrder} from "@/generated/prisma/internal/prismaNamespace";

export async function getProducts(productName?: string, limit?: number, offset?: number, orderBy?: SortOrder): Promise<Product[]> {
    const productsPromise = prisma.product.findMany({
        where: {
            name: {
                contains: productName,
                mode: 'insensitive'
            }
        },
        orderBy: {
            name: orderBy ?? "asc"
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

export async function createProducts(products: Product[]) {
    return prisma.product.createMany({data: products});
}

export async function deleteProductsFromStore(storeId: number) {
    const deleteReturn = await prisma.product.deleteMany({
        where: {
            storeId: storeId
        }
    });
    return deleteReturn.count;
}

export async function populateStore(storeId: number, products: Product[]) {
    const [deleteResult, createResult ] = await prisma.$transaction([
        prisma.product.deleteMany({
            where: {
                storeId: storeId
            }
        }),
        prisma.product.createMany({data: products})
    ]);
}