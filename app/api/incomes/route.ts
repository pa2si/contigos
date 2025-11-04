import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  sanitizeBeschreibung,
  sanitizeBetrag,
  validateEnum,
} from '@/lib/sanitization';

// GET /api/incomes - Fetch all income positions
export async function GET() {
  try {
    const incomes = await prisma.income.findMany({
      orderBy: [
        { quelle: 'asc' }, // Partner1 first, then Partner2
        { createdAt: 'desc' }, // Newest first within each partner
      ],
    });

    return NextResponse.json(incomes);
  } catch (error) {
    console.error('Error fetching incomes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incomes' },
      { status: 500 }
    );
  }
}

// POST /api/incomes - Create a new income position
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { beschreibung, betrag, quelle } = body;

    // Enhanced validation with sanitization
    let sanitizedBeschreibung: string;
    let sanitizedBetrag: number;
    let validatedQuelle: string;

    try {
      sanitizedBeschreibung = sanitizeBeschreibung(beschreibung);
      sanitizedBetrag = sanitizeBetrag(betrag);
      validatedQuelle = validateEnum(
        quelle,
        ['Partner1', 'Partner2'],
        'quelle'
      );
    } catch (validationError) {
      return NextResponse.json(
        {
          error:
            validationError instanceof Error
              ? validationError.message
              : 'Validation failed',
        },
        { status: 400 }
      );
    }

    const income = await prisma.income.create({
      data: {
        beschreibung: sanitizedBeschreibung,
        betrag: Math.round(sanitizedBetrag * 100) / 100, // Round to 2 decimal places
        quelle: validatedQuelle as 'Partner1' | 'Partner2',
      },
    });

    return NextResponse.json(income, { status: 201 });
  } catch (error) {
    console.error('Error creating income:', error);
    return NextResponse.json(
      { error: 'Failed to create income' },
      { status: 500 }
    );
  }
}
