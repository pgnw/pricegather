import {Decimal} from "@prisma/client/runtime/client";
import {Product} from "@/generated/prisma/client";

export const OramaProductSchema = {
    productId: "string",
    name: "string",
    description: "string",
    price: "number",
    grams: "number",
    hasWeight: "boolean",
} as const;

export type OramaProduct = {
    productId: string;
    name: string;
    description: string;
    price: number;
    grams: number;
    hasWeight: boolean;
};

export function ProductPrismaToOrama(product: Product): OramaProduct {
    return {
        productId: product.id,
        name: product.name,
        description: product.description || "",
        price: new Decimal(product.price).toNumber(),
        grams: product.grams || 0,
        hasWeight: product.grams != null,
    };
}