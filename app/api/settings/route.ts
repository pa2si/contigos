import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/settings - Fetch settings (singleton)
export async function GET() {
  try {
    let settings = await prisma.settings.findFirst();

    // If no settings exist, create default settings
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: 1, // Force singleton pattern
          p1_einkommen: 2215,
          p2_einkommen: 1600,
          restgeld_vormonat: 0,
          comida_betrag: 1200,
          ahorros_betrag: 0,
          tagesgeldkonto_betrag: 0,
          investieren: 0,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      p1_einkommen,
      p2_einkommen,
      restgeld_vormonat,
      comida_betrag,
      ahorros_betrag,
      tagesgeldkonto_betrag,
      investieren,
    } = body;

    // Validate input
    if (
      typeof p1_einkommen !== 'number' ||
      typeof p2_einkommen !== 'number' ||
      typeof restgeld_vormonat !== 'number' ||
      typeof comida_betrag !== 'number' ||
      typeof ahorros_betrag !== 'number' ||
      typeof tagesgeldkonto_betrag !== 'number' ||
      typeof investieren !== 'number'
    ) {
      return NextResponse.json(
        { error: 'Invalid input: all fields must be numbers' },
        { status: 400 }
      );
    }

    // Upsert settings (update if exists, create if doesn't)
    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: {
        p1_einkommen,
        p2_einkommen,
        restgeld_vormonat,
        comida_betrag,
        ahorros_betrag,
        tagesgeldkonto_betrag,
        investieren,
      },
      create: {
        id: 1,
        p1_einkommen,
        p2_einkommen,
        restgeld_vormonat,
        comida_betrag,
        ahorros_betrag,
        tagesgeldkonto_betrag,
        investieren,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
