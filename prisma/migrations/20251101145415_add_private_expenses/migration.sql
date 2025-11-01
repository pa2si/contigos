-- CreateEnum
CREATE TYPE "Partner" AS ENUM ('Partner1', 'Partner2');

-- CreateTable
CREATE TABLE "private_expenses" (
    "id" SERIAL NOT NULL,
    "beschreibung" TEXT NOT NULL,
    "betrag" DOUBLE PRECISION NOT NULL,
    "person" "Partner" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "private_expenses_pkey" PRIMARY KEY ("id")
);
