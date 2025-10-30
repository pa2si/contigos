# Contigos - Fair Household Calculator

## Project Overview

A full-stack web application for couples to calculate fair financial contributions to a shared household account based on income ratios and detailed expense tracking.

## Tech Stack Requirements

### Framework

- **Next.js 16+** with App Router
- **React 19.2** with latest features

### Styling

- **Tailwind CSS** for modern, responsive UI/UX

### Database

- **Supabase** (PostgreSQL)
- Project name: "contigos"

### ORM

- **Prisma** for database operations
- All data fetched live from database (no hardcoded values)

## Database Schema (prisma/schema.prisma)

### Enums

```prisma
enum Payer {
  Partner1
  Partner2
  Gemeinschaftskonto
}
```

### Models

#### Settings Model (Singleton Pattern)

- Only one record should exist in this table
- Fields:
  - `p1_einkommen` (Float, default: 2215)
  - `p2_einkommen` (Float, default: 1600)
  - `restgeld_vormonat` (Float, default: 0)

#### Expense Model

- Fields:
  - `beschreibung` (String)
  - `betrag` (Float)
  - `bezahlt_von` (Enum Payer)

## Frontend Requirements (app/page.tsx)

### Component Type

- **Client Component** (`'use client'`)
- Use React Hooks: `useState`, `useEffect`, `useMemo`
- Real-time calculations on value changes

### UI Sections

#### 1. Eingaben (Settings Input)

- Three number input fields:
  - Partner 1 Einkommen
  - Partner 2 Einkommen
  - Restgeld Vormonat

#### 2. Ausgabenliste (Expense List)

- Dynamic list showing all Expense entries
- Each row contains:
  - Input: `beschreibung` (text)
  - Input: `betrag` (number)
  - Dropdown: `bezahlt_von` (Payer enum values)
  - Delete button
- "Add Expense" button to create new empty rows

#### 3. Ergebnisse (Results) - Card Design

##### KARTE 1: AKTION (Highlighted)

- Partner 1 überweist auf GK: `[FINALE_ÜBERWEISUNG_P1]`
- Partner 2 überweist auf GK: `[FINALE_ÜBERWEISUNG_P2]`

##### KARTE 2: KONTROLLE GK

- Bedarf Gemeinschaftskonto: `[Bedarf_GK]`
- Restgeld Vormonat: `[restgeld_vormonat]`
- Benötigte neue Einzahlung: `[Kontrolle_EinzahlungNötig]`
- Summe der Überweisungen: `[Kontrolle_SummeÜberweisungen]`

##### KARTE 3: ZUSAMMENFASSUNG

- Verbleibt zur freien Verfügung (P1): `[Verbleibt_P1]`
- Verbleibt zur freien Verfügung (P2): `[Verbleibt_P2]`

## Calculation Logic (Frontend with useMemo)

### Step-by-step calculations (Excel logic):

1. **Gesamteinkommen** = `p1_einkommen + p2_einkommen`

2. **P1_AnteilProzent** = `p1_einkommen / Gesamteinkommen` (handle division by zero)

3. **P2_AnteilProzent** = `p2_einkommen / Gesamteinkommen`

4. **Gesamtkosten** = Sum of all `betrag` from Expense list

5. **P1_GesamtanteilKosten** = `Gesamtkosten * P1_AnteilProzent`

6. **P2_GesamtanteilKosten** = `Gesamtkosten * P2_AnteilProzent`

7. **P1_Direktzahlungen** = Sum of all `betrag` where `bezahlt_von == Partner1`

8. **P2_Direktzahlungen** = Sum of all `betrag` where `bezahlt_von == Partner2`

9. **Bedarf_GK** = Sum of all `betrag` where `bezahlt_von == Gemeinschaftskonto`

10. **P1_AnteilRestgeld** = `restgeld_vormonat * P1_AnteilProzent`

11. **P2_AnteilRestgeld** = `restgeld_vormonat * P2_AnteilProzent`

12. **FINALE_ÜBERWEISUNG_P1** = `P1_GesamtanteilKosten - P1_Direktzahlungen - P1_AnteilRestgeld`

13. **FINALE_ÜBERWEISUNG_P2** = `P2_GesamtanteilKosten - P2_Direktzahlungen - P2_AnteilRestgeld`

14. **Kontrolle_EinzahlungNötig** = `Bedarf_GK - restgeld_vormonat`

15. **Kontrolle_SummeÜberweisungen** = `FINALE_ÜBERWEISUNG_P1 + FINALE_ÜBERWEISUNG_P2`

16. **Verbleibt_P1** = `p1_einkommen - P1_GesamtanteilKosten`

17. **Verbleibt_P2** = `p2_einkommen - P2_GesamtanteilKosten`

## CRUD Requirements

### Functionality Needed

- **Loading**: Fetch all data on page load
- **Settings**: Update income values and previous month remainder
- **Expenses**:
  - Create new expense entries
  - Edit existing entries (description, amount, payer)
  - Delete expense entries
- **Extra Income**: Add additional income entries that affect percentage distribution

### API Endpoints Required

- `GET /api/settings` - Fetch settings
- `PUT /api/settings` - Update settings
- `GET /api/expenses` - Fetch all expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/[id]` - Update expense
- `DELETE /api/expenses/[id]` - Delete expense

## Development Plan

1. **Initialize Git Repository**
2. **Setup Supabase Database Connection**
3. **Setup Prisma ORM**
4. **Configure Database Schema**
5. **Create API Routes**
6. **Build Main UI Components**
7. **Implement Calculation Logic**
8. **Add CRUD Functionality**
9. **Enhanced Income Management**
10. **Testing and Polish**

## Git Strategy

- Repository name: "contigos"
- Regular commits for each major milestone
- Clear commit messages describing changes

## Key Features

- Real-time calculations
- Responsive design
- Fair contribution calculation based on income ratios
- Detailed expense tracking
- Shared account management
- Previous month remainder consideration
