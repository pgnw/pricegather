import {expect, test} from "vitest";
import {ProductPrismaToOrama} from "@/lib/Orama";
import {Product} from "@/generated/prisma/client";
import {ProductWithMeasurement} from "@/lib/data/products";

test("Convert Product to OramaProduct: base test", () => {
    const mockMeasurementType = 'weight';
    const mockProduct = {
        id: "4",
        grams: 100,
        price: 1,
        name: "Blueberry",
        description: "It's blue",
        storeId: 5,
        url: '02928',
        measurementTypeId: 1,
        measurementType: {
            id: 1,
            measurementType: mockMeasurementType,
        },
    } as ProductWithMeasurement;

    const returnedOramaProduct = ProductPrismaToOrama(mockProduct);

    const {id,storeId, measurementTypeId, ...oramaProductFields} = mockProduct;

    //Orama product has productId in place of id
    const expectedOramaProduct = {productId: id,  ...oramaProductFields, measurementType: mockMeasurementType, grams: 100, priceWeightRatio: 0.01};

    expect(returnedOramaProduct).toEqual(expectedOramaProduct);
})
test("Convert Product to OramaProduct: handle null values", () => {
    const mockMeasurementType = 'volume';
    const mockProduct = {
        id: "4",
        price: 5,
        name: "Blueberry",
        storeId: 5,
        measurementTypeId: 1,
        url: '02928',
        measurementType: {
            id: 2,
            measurementType: mockMeasurementType,
        },
    } as ProductWithMeasurement;

    const returnedOramaProduct = ProductPrismaToOrama(mockProduct);

    const {id,storeId, measurementTypeId, measurementType, ...oramaProductFields} = mockProduct;

    //Orama product has productId in place of id
    const expectedOramaProduct = {productId: id,  ...oramaProductFields, measurementType: mockMeasurementType, grams: 0, description: "", priceWeightRatio: 0};


    expect(returnedOramaProduct).toEqual(expectedOramaProduct);
})