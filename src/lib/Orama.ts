import {Decimal} from "@prisma/client/runtime/client";
import {Product} from "@/generated/prisma/client";

export const OramaProductSchema = {
    productId: "number",
    name: "string",
    description: "string",
    price: "number",
    grams: "number"
} as const;

export type OramaProduct = {
    productId: number;
    name: string;
    description: string;
    price: number;
    grams: number;
};

export function ProductPrismaToOrama(product: Product): OramaProduct {
    return {
        productId: product.id,
        name: product.name,
        description: product.description,
        price: new Decimal(product.price).toNumber(),
        grams: product.grams
    };
}