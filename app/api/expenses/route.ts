import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Payer } from '@prisma/client';

// GET /api/expenses - Fetch all expenses
export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

// POST /api/expenses - Create new expense
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { beschreibung, betrag, bezahlt_von } = body;

    // Enhanced input validation and sanitization

    // Validate and sanitize description
    if (!beschreibung || typeof beschreibung !== 'string') {
      return NextResponse.json(
        { error: 'Description is required and must be a string' },
        { status: 400 }
      );
    }

    const sanitizedBeschreibung = beschreibung
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .slice(0, 100); // Limit length

    if (sanitizedBeschreibung.length === 0) {
      return NextResponse.json(
        { error: 'Description cannot be empty' },
        { status: 400 }
      );
    }

    // Validate amount with strict bounds
    if (
      typeof betrag !== 'number' ||
      betrag <= 0 ||
      betrag > 1000000 ||
      !isFinite(betrag)
    ) {
      return NextResponse.json(
        {
          error: 'Amount must be a positive number between 0.01 and 1,000,000',
        },
        { status: 400 }
      );
    }

    // Validate payer enum with explicit allowlist
    const validPayers: Payer[] = ['Partner1', 'Partner2', 'Gemeinschaftskonto'];
    if (!validPayers.includes(bezahlt_von)) {
      return NextResponse.json(
        {
          error:
            'Invalid payer. Must be Partner1, Partner2, or Gemeinschaftskonto',
        },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        beschreibung: sanitizedBeschreibung,
        betrag: Math.round(betrag * 100) / 100, // Round to 2 decimal places
        bezahlt_von,
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    );
  }
}
