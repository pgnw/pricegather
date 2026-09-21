import {expect, test, vi} from "vitest";
import {createProduct} from "@/lib/data/products";
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