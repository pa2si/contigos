-- Rename settings columns to new names requested by user
-- IMPORTANT: Take a DB backup before applying. Test on staging first.

ALTER TABLE "settings" RENAME COLUMN "restgeld_vormonat" TO "restgeld_gk_vormonat";
ALTER TABLE "settings" RENAME COLUMN "ahorros_betrag" TO "sparen_tagesgeld";
ALTER TABLE "settings" RENAME COLUMN "comida_betrag" TO "budget_lebensmittel";
ALTER TABLE "settings" RENAME COLUMN "tagesgeldkonto_betrag" TO "tagesgeldkonto_aktuell";
ALTER TABLE "settings" RENAME COLUMN "investieren" TO "sparen_depot";
