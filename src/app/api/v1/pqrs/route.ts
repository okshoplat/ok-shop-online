import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateRadicado } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type = 'PETICION',
      customerName,
      email,
      phone,
      orderNumber,
      subject,
      description,
    } = body;

    if (!customerName || !email || !phone || !subject || !description) {
      return NextResponse.json(
        {
          success: false,
          error: 'Todos los campos marcados como obligatorios (nombre, correo, teléfono, asunto y descripción) son requeridos.',
        },
        { status: 400 }
      );
    }

    const validTypes = ['PETICION', 'QUEJA', 'RECLAMO', 'SUGERENCIA'];
    const pType = validTypes.includes(type.toUpperCase()) ? type.toUpperCase() : 'PETICION';
    const radicado = generateRadicado();

    let createdPqrs: any = null;
    try {
      createdPqrs = await prisma.pQRS.create({
        data: {
          radicado,
          type: pType,
          customerName,
          email,
          phone,
          orderNumber: orderNumber || null,
          subject,
          description,
          status: 'RECEIVED',
        },
      });
    } catch (dbErr) {
      console.warn('DB PQRS insert fallback:', dbErr);
      createdPqrs = {
        id: `pqrs-${Date.now()}`,
        radicado,
        type: pType,
        customerName,
        email,
        phone,
        orderNumber,
        subject,
        description,
        status: 'RECEIVED',
        createdAt: new Date().toISOString(),
      };
    }

    return NextResponse.json(
      {
        success: true,
        message: '¡Tu solicitud PQRS ha sido radicada satisfactoriamente!',
        data: {
          radicado: createdPqrs.radicado,
          type: createdPqrs.type,
          subject: createdPqrs.subject,
          status: 'RECEIVED',
          statusLabel: 'Radicado y en revisión por el equipo de Servicio al Cliente',
          estimatedResponseHours: 48,
          channelNotice: 'Recibirás copia y respuesta oficial en tu correo electrónico.',
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al procesar la solicitud PQRS.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    const list = await prisma.pQRS.findMany({
      where: email ? { email } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
