import {Prisma} from "@/generated/prisma/client";

export type AldiAPIResponse = {
    meta: {
      pagination:{
          totalCount: number;
      }
    };
    data: AldiAPIProduct[];
}

export type AldiAPIProduct = {
    sku: string;
    name: string;
    sellingSize: string | null;
    price: {
        amountRelevant: number;
        comparison: number;
    };
};
