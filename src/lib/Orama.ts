import {Product} from "@/generated/prisma/client";

export const OramaProductSchema = {
    productId: "string",
    name: "string",
    description: "string",
    price: "number",
    grams: "number",
    priceWeightRatio: "number",
    url: "string",
} as const;

export type OramaProduct = {
    productId: string;
    name: string;
    description: string;
    price: number;
    grams: number;
    priceWeightRatio: number;
    url: string;
};

export function ProductPrismaToOrama(product: Product): OramaProduct {
    return {
        productId: product.id,
        name: product.name,
        description: product.description || "",
        price: product.price,
        grams: product.grams || 0,
        priceWeightRatio: product.grams != undefined ? Math.round((product.grams / product.price) * 1000) / 1000 : 0,
        url: product.url,
    };
}

export type SearchOptions = {
    searchTerm?: string;
    sortBy?: "price" | "grams" | "priceWeightRatio" | 'name';
    sortDirection?: "ASC" | "DESC";
}

export function compareNullableNumber(
    a: number,
    b: number,
    direction: "ASC" | "DESC"
) {
    const aMissing = a === 0;
    const bMissing = b === 0;

    if (aMissing && !bMissing) return 1;
    if (!aMissing && bMissing) return -1;

    return direction === "ASC"
        ? a - b
        : b - a;
}
