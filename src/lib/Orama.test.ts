import {expect, test} from "vitest";
import {ProductPrismaToOrama} from "@/lib/Orama";
import {Product} from "@/generated/prisma/client";

test("Convert Product to OramaProduct: base test", () => {
    const mockProduct = {
        id: "4",
        grams: 100,
        price: 1,
        name: "Blueberry",
        description: "It's blue",
        storeId: 5,
    } as Product;

    const returnedOramaProduct = ProductPrismaToOrama(mockProduct);

    const {id,storeId, ...oramaProductFields} = mockProduct;

    //Orama product has productId in place of id
    const expectedOramaProduct = {productId: id, ...oramaProductFields, hasWeight: true, priceWeightRatio: 100};

    expect(returnedOramaProduct).toEqual(expectedOramaProduct);
})
test("Convert Product to OramaProduct: handle null values", () => {
    const mockProduct = {
        id: "4",
        price: 5,
        name: "Blueberry",
        storeId: 5,
    } as Product;

    const returnedOramaProduct = ProductPrismaToOrama(mockProduct);

    const {id,storeId, ...oramaProductFields} = mockProduct;

    //Orama product has productId in place of id
    const expectedOramaProduct = {productId: id, ...oramaProductFields, grams: 0, description: "", hasWeight: false, priceWeightRatio: 0};

    expect(returnedOramaProduct).toEqual(expectedOramaProduct);
})