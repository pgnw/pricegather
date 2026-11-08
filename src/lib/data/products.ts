import {prisma} from "@/lib/prisma";
import {Prisma, Product} from "@/generated/prisma/client";
import {store} from "next/dist/build/output/store";
import {SortOrder} from "@/generated/prisma/internal/prismaNamespace";

const productWithMeasurement = {include: {measurementType: true}} satisfies Prisma.ProductDefaultArgs;
export type ProductWithMeasurement = Prisma.ProductGetPayload<typeof productWithMeasurement>;

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

export async function getProductsWithMeasurementUnits(productName?: string, limit?: number, offset?: number, orderBy?: SortOrder): Promise<ProductWithMeasurement[]> {
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
        skip: offset,
        include: {
            measurementType: true
        }
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

    await prisma.product.deleteMany({
        where: {storeId: storeId}
    });

    // Prisma seems to fail inconsistently with larger bulk inserts.
    const batchSize = 5000;

    for (let i = 0; i < products.length; i += batchSize) {
        const currentBatch: Product[] = products.slice(i, i + batchSize);

        try {

            await prisma.product.createMany({
                data: currentBatch
            });
        } catch
            (e) {
            console.log('error', e);
        }

    }

    // const [deleteResult, createResult] = await prisma.$transaction([
    //     prisma.product.deleteMany({
    //         where: {
    //             storeId: storeId
    //         }
    //     }),
    //     prisma.product.createMany({data: products}),
    // ]);
}