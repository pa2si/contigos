-- CreateEnum
CREATE TYPE "Payer" AS ENUM ('Partner1', 'Partner2', 'Gemeinschaftskonto');

-- CreateTable
CREATE TABLE "settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "p1_einkommen" DOUBLE PRECISION NOT NULL DEFAULT 2215,
    "p2_einkommen" DOUBLE PRECISION NOT NULL DEFAULT 1600,
    "restgeld_vormonat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" SERIAL NOT NULL,
    "beschreibung" TEXT NOT NULL,
    "betrag" DOUBLE PRECISION NOT NULL,
    "bezahlt_von" "Payer" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);
