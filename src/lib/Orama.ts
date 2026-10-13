import {Prisma, Product} from "@/generated/prisma/client";
import {ProductWithMeasurement} from "@/lib/data/products";
import {DisplayProduct} from "@/lib/types";

export const OramaProductSchema = {
    productId: "string",
    name: "string",
    description: "string",
    price: "number",
    grams: "number",
    priceWeightRatio: "number",
    url: "string",
    measurementType: "string",
} as const;

export type OramaProduct = {
    productId: string;
    name: string;
    description: string;
    price: number;
    grams: number;
    priceWeightRatio: number;
    url: string;
    measurementType: string;
};

export function ProductPrismaToOrama(product: ProductWithMeasurement): OramaProduct {
    return {
        productId: product.id,
        name: product.name,
        description: product.description || "",
        price: product.price,
        grams: product.grams || 0,
        priceWeightRatio: product.grams != undefined ? Math.round((product.price / product.grams) * 1000) / 1000 : 0,
        url: product.url,
        measurementType: product?.measurementType?.measurementType ?? '',
    };
}

export type SearchOptions = {
    searchTerm?: string;
    sortBy?: "price" | "grams" | "priceWeightRatio" | 'name';
    sortDirection?: "ASC" | "DESC";
    minPrice?: number;
    maxPrice?: number;
    minWeight?: number;
    maxWeight?: number;
}

export type SearchFilter = {
    field: "grams" | "price" | "priceWeightRatio";
    operator: ">" | ">=" | "<" | "<=" | "=";
    value: number;
};

export function compareNullableNumber(
    a: number | null | undefined,
    b: number | null | undefined,
    direction: "ASC" | "DESC"
) {

    if (a == null) return 1;
    if (b == null) return -1;

    return direction === "ASC"
        ? a - b
        : b - a;
}

export function getWeightString(product:  DisplayProduct): string {
    if (product.grams == null || product.measurementType == null)
        return "-";

    const measurementType = product.measurementType.measurementType;

    if (measurementType === "weight") {
        if (product.grams >= 1000)
            return `${product.grams / 1000} kg`;
        else if (product.grams > 0)
            return `${product.grams} g`;
    } else if (measurementType === "volume") {
        if (product.grams >= 1000)
            return `${product.grams / 1000} L`;
        else if (product.grams > 0)
            return `${product.grams} ml`;
    }
    return '-';
}