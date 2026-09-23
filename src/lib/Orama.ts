import {Product} from "@/generated/prisma/client";

export const OramaProductSchema = {
    productId: "string",
    name: "string",
    description: "string",
    price: "number",
    grams: "number",
    priceWeightRatio: "number",
    hasWeight: "boolean",
} as const;

export type OramaProduct = {
    productId: string;
    name: string;
    description: string;
    price: number;
    grams: number;
    priceWeightRatio: number;
    hasWeight: boolean;
};

export function ProductPrismaToOrama(product: Product): OramaProduct {
    return {
        productId: product.id,
        name: product.name,
        description: product.description || "",
        price: product.price,
        grams: product.grams || 0,
        priceWeightRatio: product.grams != undefined ? Math.round((product.grams / product.price) * 1000) / 1000 : 0,
        hasWeight: product.grams != null && product.grams > 0,
    };
}
