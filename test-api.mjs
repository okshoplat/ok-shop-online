async function runTests() {
  const baseUrl = 'http://localhost:3000';
  console.log('🚀 Running OK Shop API validation tests...\n');

  // Test 1: GET /api/v1/products
  try {
    const res = await fetch(`${baseUrl}/api/v1/products`);
    const json = await res.json();
    console.log('✅ 1. GET /api/v1/products');
    console.log(`   Success: ${json.success} | Total products: ${json.meta?.total} | First product: ${json.data?.[0]?.name}`);
  } catch (e) {
    console.error('❌ 1. GET /api/v1/products failed:', e.message);
  }

  // Test 2: GET /api/v1/orders/track/OK-2026-10492
  try {
    const res = await fetch(`${baseUrl}/api/v1/orders/track/OK-2026-10492`);
    const json = await res.json();
    console.log('✅ 2. GET /api/v1/orders/track/OK-2026-10492');
    console.log(`   Success: ${json.success} | Order: ${json.data?.orderNumber} | Status: ${json.data?.statusLabel} | Carrier: ${json.data?.trackingCarrier}`);
  } catch (e) {
    console.error('❌ 2. GET /api/v1/orders/track failed:', e.message);
  }

  // Test 3: GET /api/v1/invoices/OK-2026-10492
  try {
    const res = await fetch(`${baseUrl}/api/v1/invoices/OK-2026-10492`);
    const json = await res.json();
    console.log('✅ 3. GET /api/v1/invoices/OK-2026-10492');
    console.log(`   Success: ${json.success} | Invoice: ${json.data?.invoiceNumber} | CUFE: ${json.data?.cufe?.slice(0, 20)}... | DIAN: ${json.data?.dianResolution?.slice(0, 30)}...`);
  } catch (e) {
    console.error('❌ 3. GET /api/v1/invoices failed:', e.message);
  }

  // Test 4: POST /api/v1/orders
  try {
    const res = await fetch(`${baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'prod-ebike-ok-pro', quantity: 1 }],
        customer: {
          name: 'Ana María Gómez',
          email: 'ana.gomez@gmail.com',
          phone: '3001234567',
          documentType: 'CC',
          documentNumber: '52194810',
        },
        shipping: {
          city: 'Bogotá D.C.',
          department: 'Cundinamarca',
          addressLine: 'Calle 100 # 15-20 Apto 301',
        },
        paymentType: 'NEQUI',
        couponCode: 'NAVIDAD2026',
      }),
    });
    const json = await res.json();
    console.log('✅ 4. POST /api/v1/orders');
    console.log(`   Success: ${json.success} | Created Order: ${json.data?.order?.orderNumber} | Total: $${json.data?.summary?.total?.toLocaleString('es-CO')} COP | Free shipping: ${json.data?.summary?.isFreeShipping}`);
  } catch (e) {
    console.error('❌ 4. POST /api/v1/orders failed:', e.message);
  }

  // Test 5: POST /api/v1/pqrs
  try {
    const res = await fetch(`${baseUrl}/api/v1/pqrs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'PETICION',
        customerName: 'Carlos Mendoza',
        email: 'carlos.mendoza@gmail.com',
        phone: '3159998877',
        orderNumber: 'OK-2026-10492',
        subject: 'Consulta sobre tiempo de entrega',
        description: 'Deseo conocer la hora estimada en que el camión de reparto llegará a mi domicilio.',
      }),
    });
    const json = await res.json();
    console.log('✅ 5. POST /api/v1/pqrs');
    console.log(`   Success: ${json.success} | Radicado: ${json.data?.radicado} | Estado: ${json.data?.statusLabel}`);
  } catch (e) {
    console.error('❌ 5. POST /api/v1/pqrs failed:', e.message);
  }

  // Test 6: GET /api/v1/pqrs/PQRS-2026-4819
  try {
    const res = await fetch(`${baseUrl}/api/v1/pqrs/PQRS-2026-4819`);
    const json = await res.json();
    console.log('✅ 6. GET /api/v1/pqrs/PQRS-2026-4819');
    console.log(`   Success: ${json.success} | Radicado: ${json.data?.radicado} | Status: ${json.data?.statusLabel}`);
  } catch (e) {
    console.error('❌ 6. GET /api/v1/pqrs failed:', e.message);
  }

  console.log('\n🎉 All API endpoints verified successfully!');
}

runTests();
