import {prisma} from "@/lib/prisma";
import {Product} from "@/generated/prisma/client";
import {Orama} from "@orama/orama";
import {OramaProduct, ProductPrismaToOrama} from "@/lib/Orama";

export async function getProducts(productName?: string, limit?: number, offset?: number  ): Promise<Product[]> {
    const productsPromise =   prisma.product.findMany({
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