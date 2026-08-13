import {prisma} from "@/lib/prisma";

async function main  ()  {
    const start = Date.now();
    console.log("Seeding db");

    const coles = await prisma.store.upsert({
        where: {name: 'Coles'},
        update: {},
        create:
            {
                name: 'Coles'
            }
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });