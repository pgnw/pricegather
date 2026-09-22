import {expect, test} from "vitest";
import {ProductPrismaToOrama} from "@/lib/Orama";
import {Product} from "@/generated/prisma/client";

test("Convert Product to OramaProduct: base test", () => {
    const mockProduct = {
        id: "4",
        grams: 99,
        price: 5,
        name: "Blueberry",
        description: "It's blue",
        storeId: 5,
    } as Product;

    const returnedOramaProduct = ProductPrismaToOrama(mockProduct);

    const {id,storeId, ...oramaProductFields} = mockProduct;

    //Orama product has productId in place of id
    const expectedOramaProduct = {productId: id, ...oramaProductFields, hasWeight: true};

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
    const expectedOramaProduct = {productId: id, ...oramaProductFields, grams: 0, description: "", hasWeight: false};

    expect(returnedOramaProduct).toEqual(expectedOramaProduct);
})