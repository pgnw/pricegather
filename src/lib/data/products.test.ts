import {expect, test, vi} from "vitest";
import {
    createProduct,
    createProducts,
    deleteProductsFromStore,
    getProducts,
    populateStore,
    ProductWithMeasurement
} from "@/lib/data/products";
import {prisma} from "@/lib/__mocks__/prisma";

vi.mock("@/lib/prisma");

test("make product", async () => {
    const newProduct = {
        id: "0299qdwq",
        grams: 0,
        price: 1,
        name: "food",
        description: "desc",
        storeId: 2,
        url: '0229',
        measurementTypeId: 1,
        measurementType: {
            id: 2,
            measurementType: "volume",
        },
    };

    prisma.product.create.mockResolvedValueOnce(newProduct);

    const product = await createProduct(newProduct);

    expect(prisma.product.create).toHaveBeenCalledWith({data: newProduct});
    expect(product).toStrictEqual(newProduct);
});

test("Get Products", async () => {
    const newProducts = [
        {
            id: "1",
            grams: 100,
            price: 5,
            name: "green apple",
            description: "fruit",
            storeId: 2,
            url: 'green_apple',
            measurementTypeId: 1,
            measurementType: {
                id: 1,
                measurementType: "weight",
            },
        },
        {
            id: "2",
            grams: 20,
            price: 1,
            name: "red apple",
            description: "desc",
            storeId: 2,
            url: 'red_apple',
            measurementTypeId: 1,
            measurementType: {
                id: 1,
                measurementType: "weight",
            },
        }
    ];

    const searchName = 'apple';
    const searchLimit = 10;
    const searchOffset = 0;
    const searchOrderby = 'asc';

    prisma.product.findMany.mockResolvedValueOnce(newProducts);

    const returnedProducts = await getProducts(searchName, searchLimit, searchOffset, searchOrderby);

    expect(returnedProducts).toStrictEqual(newProducts);
    expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: {
            name: {
                contains: searchName,
                mode: "insensitive",
            },
        },
        take: searchLimit,
        skip: searchOffset,
        orderBy: {
            'name': searchOrderby
        },
    });
});

test('Delete Products From Store', async () => {
    const storeId = 2;
    const expectedDeleteCount = 5;

    prisma.product.deleteMany.mockResolvedValueOnce({count: expectedDeleteCount});

    const deleteCount = await deleteProductsFromStore(storeId);

    expect(prisma.product.deleteMany).toHaveBeenCalledWith({
        where: {storeId: storeId}
    });

    expect(prisma.product.deleteMany).toHaveBeenCalledTimes(1);
    expect(deleteCount).eql(expectedDeleteCount);
})

test("Populates Store", async () => {
    const storeId = 2;
    const products = [
        {
            id: "1",
            storeId: storeId,
            name: "Milk",
            description: "",
            grams: 1000,
            price: 3.99,
            url: 'milk_',      measurementTypeId: 1,
            measurementType: {
                id: 1,
                measurementType: "weight",
            },
        },
    ];

    prisma.product.deleteMany.mockResolvedValueOnce({count: 3});
    prisma.product.createMany.mockResolvedValueOnce({count: 1});

    prisma.$transaction.mockResolvedValueOnce([
        {count: 3},
        {count: 1},
    ]);

    await populateStore(storeId, products);

    expect(prisma.product.deleteMany).toHaveBeenCalledWith({
        where: {
            storeId: storeId,
        },
    });

    expect(prisma.product.createMany).toHaveBeenCalledWith({
        data: products,
    });

    expect(prisma.$transaction).toHaveBeenCalledOnce();
});

test("Create Products", async () => {
    const mockProducts = [
        {
            id: "1",
            grams: 100,
            price: 5,
            name: "green apple",
            description: "fruit",
            storeId: 2,
            url: 'green_apple',
            measurementTypeId: 1,
            measurementType: {
                id: 1,
                measurementType: "weight",
            },
        },
        {
            id: "2",
            grams: 20,
            price: 1,
            name: "red apple",
            description: "desc",
            storeId: 2,
            url: 'red_apple',
            measurementTypeId: 1,
            measurementType: {
                id: 1,
                measurementType: "weight",
            },
        }
    ];

    prisma.product.createMany.mockResolvedValueOnce({count: 2});

    const createdProducts = (await createProducts(mockProducts)).count;

    expect(createdProducts).eql(2);
    expect(prisma.product.createMany).toHaveBeenCalledOnce();
    expect(prisma.product.createMany).toHaveBeenCalledWith({data: mockProducts});


})