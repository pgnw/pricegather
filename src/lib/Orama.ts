import {Product} from "@/generated/prisma/client";
import {Decimal} from "@prisma/client/runtime/client";

export type OramaProduct = {
    id: Product["id"];
    name: Product['name'];
    description: Product['description'];
    price: number; // Decimal -> number, deliberately different
    grams: Product['grams'];
};

export function ProductPrismaToOrama(product: Product): OramaProduct {
    const newObject : OramaProduct = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: new Decimal(product.price).toNumber(),
        grams: product.grams
    };
    return newObject;
}