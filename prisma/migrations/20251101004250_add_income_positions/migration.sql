-- CreateEnum
CREATE TYPE "IncomeSource" AS ENUM ('Partner1', 'Partner2');

-- CreateTable
CREATE TABLE "incomes" (
    "id" SERIAL NOT NULL,
    "beschreibung" TEXT NOT NULL,
    "betrag" DOUBLE PRECISION NOT NULL,
    "quelle" "IncomeSource" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incomes_pkey" PRIMARY KEY ("id")
);
