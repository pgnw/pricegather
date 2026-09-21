import {expect, test, vi} from "vitest";
import {createProduct, populateStore} from "@/lib/data/products";
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
    };

    prisma.product.create.mockResolvedValueOnce(newProduct);

    const product = await createProduct(newProduct);

    expect(product).eql(newProduct);
});

test("Get Products", async () => {
    const newProducts = [
        {
            id: "1",
            grams: 100,
            price: 5,
            name: "apple",
            description: "fruit",
            storeId: 2,
        },
        {
            id: "2",
            grams: 20,
            price: 1,
            name: "food",
            description: "desc",
            storeId: 2,
        }
    ];

    prisma.product.findMany.mockResolvedValueOnce(newProducts);

    const returnedProducts = await prisma.product.findMany();

    expect(returnedProducts).toStrictEqual(newProducts);
});


test("populates store", async () => {
    const storeId = 2;
    const products = [
        {
            id: "1",
            storeId: storeId,
            name: "Milk",
            description: "",
            grams: 1000,
            price: 3.99,
        },
    ];

    prisma.product.deleteMany.mockResolvedValueOnce({ count: 3 });
    prisma.product.createMany.mockResolvedValueOnce({ count: 1 });

    prisma.$transaction.mockResolvedValueOnce([
        { count: 3 },
        { count: 1 },
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