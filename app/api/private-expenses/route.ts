import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Partner } from '@/types';

// GET /api/private-expenses - Get all private expenses
export async function GET() {
  try {
    const privateExpenses = await prisma.privateExpense.findMany({
      orderBy: [{ person: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(privateExpenses);
  } catch (error) {
    console.error('Error fetching private expenses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch private expenses' },
      { status: 500 }
    );
  }
}

// POST /api/private-expenses - Create new private expense
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { beschreibung, betrag, person } = body;

    // Validate required fields
    if (!beschreibung || !beschreibung.trim()) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    if (typeof betrag !== 'number' || betrag <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    if (!person || !['Partner1', 'Partner2'].includes(person)) {
      return NextResponse.json(
        { error: 'Person must be Partner1 or Partner2' },
        { status: 400 }
      );
    }

    const privateExpense = await prisma.privateExpense.create({
      data: {
        beschreibung: beschreibung.trim(),
        betrag,
        person: person as Partner,
      },
    });

    return NextResponse.json(privateExpense, { status: 201 });
  } catch (error) {
    console.error('Error creating private expense:', error);
    return NextResponse.json(
      { error: 'Failed to create private expense' },
      { status: 500 }
    );
  }
}
