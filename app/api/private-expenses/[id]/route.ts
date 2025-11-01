import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Partner } from '@/types';

// GET /api/private-expenses/[id] - Get specific private expense
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const privateExpense = await prisma.privateExpense.findUnique({
      where: { id },
    });

    if (!privateExpense) {
      return NextResponse.json(
        { error: 'Private expense not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(privateExpense);
  } catch (error) {
    console.error('Error fetching private expense:', error);
    return NextResponse.json(
      { error: 'Failed to fetch private expense' },
      { status: 500 }
    );
  }
}

// PUT /api/private-expenses/[id] - Update private expense
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

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

    const privateExpense = await prisma.privateExpense.update({
      where: { id },
      data: {
        beschreibung: beschreibung.trim(),
        betrag,
        person: person as Partner,
      },
    });

    return NextResponse.json(privateExpense);
  } catch (error) {
    console.error('Error updating private expense:', error);
    if ((error as { code?: string })?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Private expense not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update private expense' },
      { status: 500 }
    );
  }
}

// DELETE /api/private-expenses/[id] - Delete private expense
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    await prisma.privateExpense.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Private expense deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting private expense:', error);
    if ((error as { code?: string })?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Private expense not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete private expense' },
      { status: 500 }
    );
  }
}
