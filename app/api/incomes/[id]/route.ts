import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT /api/incomes/[id] - Update an income position
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const incomeId = parseInt(id);
    if (isNaN(incomeId)) {
      return NextResponse.json({ error: 'Invalid income ID' }, { status: 400 });
    }

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

    // Check if income exists
    const existingIncome = await prisma.income.findUnique({
      where: { id: incomeId },
    });

    if (!existingIncome) {
      return NextResponse.json({ error: 'Income not found' }, { status: 404 });
    }

    const updatedIncome = await prisma.income.update({
      where: { id: incomeId },
      data: {
        beschreibung: beschreibung.trim(),
        betrag: parseFloat(betrag.toString()),
        quelle,
      },
    });

    return NextResponse.json(updatedIncome);
  } catch (error) {
    console.error('Error updating income:', error);
    return NextResponse.json(
      { error: 'Failed to update income' },
      { status: 500 }
    );
  }
}

// DELETE /api/incomes/[id] - Delete an income position
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const incomeId = parseInt(id);
    if (isNaN(incomeId)) {
      return NextResponse.json({ error: 'Invalid income ID' }, { status: 400 });
    }

    // Check if income exists
    const existingIncome = await prisma.income.findUnique({
      where: { id: incomeId },
    });

    if (!existingIncome) {
      return NextResponse.json({ error: 'Income not found' }, { status: 404 });
    }

    await prisma.income.delete({
      where: { id: incomeId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting income:', error);
    return NextResponse.json(
      { error: 'Failed to delete income' },
      { status: 500 }
    );
  }
}
