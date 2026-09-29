-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "measurementTypeId" INTEGER;

-- CreateTable
CREATE TABLE "measurementType" (
    "id" SERIAL NOT NULL,
    "measurementType" TEXT NOT NULL,

    CONSTRAINT "measurementType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_measurementTypeId_fkey" FOREIGN KEY ("measurementTypeId") REFERENCES "measurementType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
