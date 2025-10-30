import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Payer } from '@prisma/client';

// PUT /api/expenses/[id] - Update expense
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const expenseId = parseInt(id);

    if (isNaN(expenseId)) {
      return NextResponse.json(
        { error: 'Invalid expense ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { beschreibung, betrag, bezahlt_von } = body;

    // Validate input
    if (!beschreibung || typeof beschreibung !== 'string') {
      return NextResponse.json(
        { error: 'Description is required and must be a string' },
        { status: 400 }
      );
    }

    if (typeof betrag !== 'number' || betrag <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    if (!Object.values(Payer).includes(bezahlt_von)) {
      return NextResponse.json(
        {
          error:
            'Invalid payer. Must be Partner1, Partner2, or Gemeinschaftskonto',
        },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        beschreibung,
        betrag,
        bezahlt_von,
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error('Error updating expense:', error);

    if (
      error instanceof Error &&
      error.message.includes('Record to update not found')
    ) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Failed to update expense' },
      { status: 500 }
    );
  }
}

// DELETE /api/expenses/[id] - Delete expense
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const expenseId = parseInt(id);

    if (isNaN(expenseId)) {
      return NextResponse.json(
        { error: 'Invalid expense ID' },
        { status: 400 }
      );
    }

    await prisma.expense.delete({
      where: { id: expenseId },
    });

    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);

    if (
      error instanceof Error &&
      error.message.includes('Record to delete does not exist')
    ) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Failed to delete expense' },
      { status: 500 }
    );
  }
}
