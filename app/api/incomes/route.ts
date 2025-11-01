import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Validate input
    if (!beschreibung || !beschreibung.trim()) {
      return NextResponse.json(
        { error: 'Beschreibung is required' },
        { status: 400 }
      );
    }

    if (typeof betrag !== 'number' || betrag <= 0) {
      return NextResponse.json(
        { error: 'Valid betrag is required' },
        { status: 400 }
      );
    }

    if (!quelle || !['Partner1', 'Partner2'].includes(quelle)) {
      return NextResponse.json(
        { error: 'Valid quelle is required' },
        { status: 400 }
      );
    }

    const income = await prisma.income.create({
      data: {
        beschreibung: beschreibung.trim(),
        betrag: parseFloat(betrag.toString()),
        quelle,
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
