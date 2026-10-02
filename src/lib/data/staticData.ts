import {prisma} from "@/lib/prisma";
import assert from "node:assert";

export const volumeMeasurementType = await prisma.measurementType.findUniqueOrThrow({
    where: {measurementType: 'volume'}
});
export const weightMeasurementType = await prisma.measurementType.findUniqueOrThrow({
    where: {measurementType: 'weight'}
});

export const woolworthsStoreId = (await prisma.store.findUniqueOrThrow({
    where: {
        name: "Woolworths"
    }
})).id;

export const aldiStoreId = (await prisma.store.findUniqueOrThrow({
    where: {
        name: "Aldi"
    }
})).id;