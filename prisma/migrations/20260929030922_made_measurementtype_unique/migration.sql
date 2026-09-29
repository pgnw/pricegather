/*
  Warnings:

  - A unique constraint covering the columns `[measurementType]` on the table `measurementType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "measurementType_measurementType_key" ON "measurementType"("measurementType");
