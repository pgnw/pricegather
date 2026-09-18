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
        price: product.price,
        grams: product.grams || 0,
        hasWeight: product.grams != null,
    };
}