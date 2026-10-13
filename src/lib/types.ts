import {ProductWithMeasurement} from "@/lib/data/products";

export type DisplayProduct = ProductWithMeasurement & {
    priceWeightRatio?: number;
};