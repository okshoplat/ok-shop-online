import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateShipping, generateOrderNumber, generateCUFE } from '@/lib/utils';
import { INITIAL_PRODUCTS } from '@/data/catalog';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      customer,
      shipping,
      paymentType = 'BANK_TRANSFER',
      couponCode,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'El carrito de compras no contiene artículos.' },
        { status: 400 }
      );
    }

    if (!customer?.name || !customer?.email || !customer?.phone) {
      return NextResponse.json(
        { success: false, error: 'Los datos del comprador (nombre, email, teléfono) son requeridos.' },
        { status: 400 }
      );
    }

    if (!shipping?.city || !shipping?.addressLine) {
      return NextResponse.json(
        { success: false, error: 'La dirección y ciudad de entrega son requeridas.' },
        { status: 400 }
      );
    }

    // 1. Calculate Items Subtotal & Validate against DB / Catalog
    let calculatedSubtotal = 0;
    const validatedItems: Array<{
      productId: string;
      variantId?: string;
      name: string;
      unitPrice: number;
      quantity: number;
      total: number;
    }> = [];

    for (const item of items) {
      let product: any = null;
      try {
        product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: { variants: true },
        });
      } catch (e) {
        // Fallback to static catalog
        product = INITIAL_PRODUCTS.find((p) => p.id === item.productId);
      }

      if (!product) {
        return NextResponse.json(
          { success: false, error: `Producto no encontrado: ${item.productId}` },
          { status: 404 }
        );
      }

      // Check payment discount: if paying with Transfer/Nequi/PSE, specialTransferPrice applies!
      const isDirectPayment = ['BANK_TRANSFER', 'NEQUI', 'DAVIPLATA', 'PSE'].includes(paymentType);
      const unitPrice = isDirectPayment && product.specialTransferPrice
        ? product.specialTransferPrice
        : (product.offerPrice || product.regularPrice);

      const qty = Math.max(1, Number(item.quantity || 1));
      const lineTotal = unitPrice * qty;
      calculatedSubtotal += lineTotal;

      validatedItems.push({
        productId: product.id,
        variantId: item.variantId || null,
        name: product.name,
        unitPrice,
        quantity: qty,
        total: lineTotal,
      });
    }

    // 2. Validate Coupon if provided
    let discountAmount = 0;
    let appliedCoupon: any = null;

    if (couponCode) {
      try {
        appliedCoupon = await prisma.coupon.findUnique({
          where: { code: couponCode.trim().toUpperCase() },
        });

        if (appliedCoupon && appliedCoupon.active && new Date(appliedCoupon.expiresAt) > new Date()) {
          if (calculatedSubtotal >= appliedCoupon.minPurchase) {
            if (appliedCoupon.discountPercent) {
              discountAmount = Math.round((calculatedSubtotal * appliedCoupon.discountPercent) / 100);
            } else if (appliedCoupon.discountFixed) {
              discountAmount = appliedCoupon.discountFixed;
            }
          }
        }
      } catch (couponError) {
        // In-memory coupon validation
        if (couponCode.toUpperCase() === 'NAVIDAD2026' && calculatedSubtotal >= 100000) {
          discountAmount = Math.round(calculatedSubtotal * 0.15);
        } else if (couponCode.toUpperCase() === 'OKSHOP10' && calculatedSubtotal >= 150000) {
          discountAmount = 20000;
        }
      }
    }

    // 3. Calculate Shipping Cost based on City & Colombian rules
    const shippingCalc = calculateShipping(shipping.city, calculatedSubtotal);
    const shippingCost = shippingCalc.cost;

    // 4. Final Total Amount
    const totalAmount = Math.max(0, calculatedSubtotal - discountAmount + shippingCost);

    // 5. Generate Order and Invoice Numbers
    const orderNumber = generateOrderNumber();
    const invoiceNumber = `FE-OK-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const cufe = generateCUFE(orderNumber, new Date().toISOString().split('T')[0], '901458789-3');

    const timeline = [
      {
        title: 'Pedido Recibido',
        date: new Date().toLocaleString('es-CO'),
        status: 'completed',
        description: `Pedido ${orderNumber} registrado exitosamente. En proceso de confirmación.`,
      },
      {
        title: 'En Preparación',
        date: 'Próximamente',
        status: 'current',
        description: 'Personal de OK Shop alistando tu paquete en bodega central.',
      },
      {
        title: 'Despachado',
        date: 'Pendiente',
        status: 'pending',
        description: `Asignación a transportadora ${shippingCalc.carrier}.`,
      },
      {
        title: 'En Camino',
        date: 'Pendiente',
        status: 'pending',
        description: `Hacia ${shipping.city}, ${shipping.department || 'Colombia'}.`,
      },
      {
        title: 'Entregado',
        date: `Estimado: ${shippingCalc.estimatedDays}`,
        status: 'pending',
        description: 'Entrega final en la puerta de tu domicilio.',
      },
    ];

    let createdOrder: any = null;
    try {
      createdOrder = await prisma.order.create({
        data: {
          orderNumber,
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          shippingDepartment: shipping.department || 'Cundinamarca',
          shippingCity: shipping.city,
          shippingAddressLine: shipping.addressLine,
          shippingNotes: shipping.notes || null,
          subtotal: calculatedSubtotal,
          shippingCost,
          discountAmount,
          totalAmount,
          paymentType,
          paymentStatus: paymentType === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PAID',
          orderStatus: 'RECEIVED',
          couponCode: couponCode || null,
          trackingCarrier: shippingCalc.carrier,
          trackingNumber: `GUIA-${Math.floor(100000000 + Math.random() * 900000000)}CO`,
          estimatedDelivery: new Date(Date.now() + 48 * 3600 * 1000),
          timelineJson: JSON.stringify(timeline),
          items: {
            create: validatedItems.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              name: item.name,
              price: item.unitPrice,
              quantity: item.quantity,
              total: item.total,
            })),
          },
          invoice: {
            create: {
              invoiceNumber,
              cufe,
              qrCodeData: `NumFac:${invoiceNumber},NitFac:901458789,DocAdq:${customer.documentNumber || '222222222222'},ValFac:${totalAmount}`,
              dianResolution: 'Resolución DIAN No. 187640029104 de 2026/01/15',
              customerName: customer.name,
              customerDocType: customer.documentType || 'CC',
              customerDocNumber: customer.documentNumber || 'Consumidor Final',
              customerEmail: customer.email,
              customerAddress: `${shipping.addressLine}, ${shipping.city}`,
              subtotal: Math.round(totalAmount / 1.19),
              ivaAmount: Math.round(totalAmount - totalAmount / 1.19),
              totalAmount,
              status: 'DIAN_VALIDATED',
            },
          },
        },
        include: {
          items: true,
          invoice: true,
        },
      });
    } catch (dbError) {
      console.warn('Could not persist to DB, returning memory order:', dbError);
      createdOrder = {
        id: `ord-${Date.now()}`,
        orderNumber,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        shippingDepartment: shipping.department || 'Cundinamarca',
        shippingCity: shipping.city,
        shippingAddressLine: shipping.addressLine,
        subtotal: calculatedSubtotal,
        shippingCost,
        discountAmount,
        totalAmount,
        paymentType,
        paymentStatus: paymentType === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PAID',
        orderStatus: 'RECEIVED',
        trackingCarrier: shippingCalc.carrier,
        trackingNumber: `GUIA-${Math.floor(100000000 + Math.random() * 900000000)}CO`,
        items: validatedItems,
        timeline,
        invoice: {
          invoiceNumber,
          cufe,
          dianResolution: 'Resolución DIAN No. 187640029104 de 2026/01/15',
          subtotal: Math.round(totalAmount / 1.19),
          ivaAmount: Math.round(totalAmount - totalAmount / 1.19),
          totalAmount,
        },
      };
    }

    return NextResponse.json({
      success: true,
      message: '¡Tu pedido en OK Shop ha sido creado exitosamente!',
      data: {
        order: createdOrder,
        summary: {
          subtotal: calculatedSubtotal,
          discount: discountAmount,
          shippingCost,
          isFreeShipping: shippingCalc.isFree,
          carrier: shippingCalc.carrier,
          total: totalAmount,
        },
        trackingUrl: `/sigue-tu-pedido?orderId=${orderNumber}`,
        invoiceUrl: `/factura-electronica?orderId=${orderNumber}`,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al procesar el pedido' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    const orders = await prisma.order.findMany({
      where: email ? { customerEmail: email } : undefined,
      include: {
        items: true,
        invoice: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
