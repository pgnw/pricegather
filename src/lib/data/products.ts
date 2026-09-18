import {prisma} from "@/lib/prisma";
import {Product} from "@/generated/prisma/client";
import {Orama} from "@orama/orama";
import {OramaProduct, ProductPrismaToOrama} from "@/lib/Orama";

export async function getProducts(search?: { name: string }): Promise<Product[]> {
    const products =   prisma.product.findMany({
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

    return products;
}