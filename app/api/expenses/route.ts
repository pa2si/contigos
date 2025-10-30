import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Payer } from '@prisma/client'

// GET /api/expenses - Fetch all expenses
export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    )
  }
}

// POST /api/expenses - Create new expense
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { beschreibung, betrag, bezahlt_von } = body

    // Validate input
    if (!beschreibung || typeof beschreibung !== 'string') {
      return NextResponse.json(
        { error: 'Description is required and must be a string' },
        { status: 400 }
      )
    }

    if (typeof betrag !== 'number' || betrag <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      )
    }

    if (!Object.values(Payer).includes(bezahlt_von)) {
      return NextResponse.json(
        { error: 'Invalid payer. Must be Partner1, Partner2, or Gemeinschaftskonto' },
        { status: 400 }
      )
    }

    const expense = await prisma.expense.create({
      data: {
        beschreibung,
        betrag,
        bezahlt_von,
      }
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    console.error('Error creating expense:', error)
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    )
  }
}