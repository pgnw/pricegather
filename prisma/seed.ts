import {prisma} from "@/lib/prisma";

async function main() {
    const start = Date.now();
    console.log("Seeding db");

    const coles =  await prisma.store.upsert({
        where: {name: 'Coles'},
        update: {},
        create:
            {
                name: 'Coles'
            }
    });

    const aldi =  await prisma.store.upsert({
        where: {name: "Aldi"},
        update: {},
        create:
            {
                name: 'Aldi'
            }
    })

    const weight = await prisma.measurementType.upsert({
        where: { measurementType: 'weight' },
        update: {},
        create: {
            measurementType: 'weight'
        }
    });
    const volume = await prisma.measurementType.upsert({
        where: { measurementType: 'volume' },
        update: {},
        create: {
            measurementType: 'volume'
        }
    });

}

// async function createProducts() {
//         const productsData = [{
//             id: "1",
//             storeId: 1,
//             name: 'Peanut Butter',
//             description: 'Peanut butter for u.',
//             grams: 200,
//             price: 3
//         },
//             {
//                 id: "2",
//                 storeId: 1,
//                 name: 'Apple',
//                 description: 'Fruit',
//                 grams: 150,
//                 price: 1
//             },
//             {
//                 id: "3",
//                 storeId: 1,
//                 name: 'Orange',
//                 description: 'Orange',
//                 grams: 100,
//                 price: 1.5
//             }
//             ];
//
//         await prisma.product.deleteMany({});
//
//         prisma.product.createMany(
//             {
//                 data: [...productsData],
//                 skipDuplicates: false
//             });
//
// }

main()
    .then(async () => {
        await prisma.$disconnect();

    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });