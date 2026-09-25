'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  FileText,
  Search,
  Printer,
  Download,
  ShieldCheck,
  QrCode,
  Building,
  User,
  Calendar,
  AlertCircle,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { formatCOP } from '@/lib/utils';

function InvoiceContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || 'OK-2026-10492';

  const [query, setQuery] = useState(initialOrderId);
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoice = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/invoices/${encodeURIComponent(id.trim())}`);
      const json = await res.json();
      if (json.success) {
        setInvoice(json.data);
      } else {
        setError(json.error || 'No se encontró factura electrónica para este pedido.');
        setInvoice(null);
      }
    } catch (e: any) {
      setError('Error al consultar el portal de facturación DIAN.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      fetchInvoice(initialOrderId);
    }
  }, [initialOrderId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInvoice(query);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-8 print:hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-brand-green text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Sistema de Facturación Electrónica DIAN</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
            Factura Electrónica de Venta
          </h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Consulta y descarga la representación gráfica de tu factura avalada legalmente ante la Dirección de Impuestos y Aduanas Nacionales (DIAN).
          </p>

          {/* Search Box */}
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-6 flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Número de orden (ej: OK-2026-10492) o factura..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green text-sm font-semibold uppercase shadow-sm"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-brand-green hover:bg-green-700 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md disabled:bg-gray-400"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Consultar</span>}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl flex items-start gap-3 text-xs mb-8 print:hidden">
            <AlertCircle className="w-5 h-5 text-brand-red flex-shrink-0" />
            <div>
              <p className="font-bold">Factura no disponible</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Official DIAN Electronic Invoice Visual */}
        {invoice && (
          <div className="space-y-4">
            {/* Action buttons bar */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm print:hidden">
              <div className="flex items-center gap-2 text-xs text-brand-green font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>{invoice.statusLabel}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-colors shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir / PDF</span>
                </button>

                <a
                  href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(invoice, null, 2))}`}
                  download={`Factura-${invoice.invoiceNumber}.json`}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar XML/JSON</span>
                </a>
              </div>
            </div>

            {/* Invoice Graphic Representation Document */}
            <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-2xl text-gray-900 text-xs space-y-8 font-sans print:p-0 print:border-none print:shadow-none">
              {/* Header: Company & Invoice Number */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-gray-900">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-gray-950 font-sans">
                      OK <span className="text-brand-red">SHOP</span>
                    </span>
                    <span className="text-[10px] bg-red-600 text-white font-extrabold px-1.5 py-0.2 rounded">
                      DIAN
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-gray-900">{invoice.seller.businessName}</h3>
                  <p className="text-gray-600">NIT: {invoice.seller.nit} • {invoice.seller.taxRegime}</p>
                  <p className="text-gray-600">{invoice.seller.address}</p>
                  <p className="text-gray-600">Tel: {invoice.seller.phone} • {invoice.seller.email}</p>
                </div>

                <div className="text-left sm:text-right bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-1 min-w-[240px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Factura Electrónica de Venta
                  </span>
                  <p className="text-xl font-black text-brand-red">{invoice.invoiceNumber}</p>
                  <p className="text-[11px] text-gray-500">Orden de Compra: <strong>{invoice.orderNumber}</strong></p>
                  <p className="text-[11px] text-gray-500">Fecha de Emisión: <strong>{invoice.issueDate}</strong></p>
                </div>
              </div>

              {/* DIAN Authorization Box */}
              <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/80 text-[11px] text-emerald-950 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-brand-green">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{invoice.dianResolution}</span>
                </p>
                <p className="text-[10px] text-gray-500 break-all font-mono">
                  CUFE: {invoice.cufe}
                </p>
              </div>

              {/* Buyer Information Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Datos del Adquirente / Cliente
                  </span>
                  <p className="font-bold text-sm text-gray-900">{invoice.buyer.name}</p>
                  <p className="text-gray-600">{invoice.buyer.documentType}: {invoice.buyer.documentNumber}</p>
                  <p className="text-gray-600">Dirección: {invoice.buyer.address}</p>
                </div>
                <div className="space-y-1 sm:text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Información de Pago
                  </span>
                  <p className="font-semibold text-gray-800">Forma de Pago: {invoice.payment.condition}</p>
                  <p className="text-gray-600">Medio: {invoice.payment.method}</p>
                  <p className="text-gray-600">Moneda: {invoice.payment.currency} (Pesos Colombianos)</p>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-900 text-gray-900 font-extrabold text-[11px] uppercase tracking-wider">
                      <th className="py-2.5">Cód / SKU</th>
                      <th className="py-2.5">Descripción del Artículo</th>
                      <th className="py-2.5 text-center">Cant.</th>
                      <th className="py-2.5 text-right">Valor Unit.</th>
                      <th className="py-2.5 text-center">IVA</th>
                      <th className="py-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {invoice.items.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="py-3 font-mono font-semibold text-gray-500">{item.code}</td>
                        <td className="py-3 font-medium text-gray-900">{item.description}</td>
                        <td className="py-3 text-center font-bold text-gray-800">{item.quantity}</td>
                        <td className="py-3 text-right">{formatCOP(item.unitPrice)}</td>
                        <td className="py-3 text-center">{item.ivaRate}%</td>
                        <td className="py-3 text-right font-bold text-gray-950">{formatCOP(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Totals Breakdown & QR Validation */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-4 border-t-2 border-gray-900">
                {/* QR Code Simulation and DIAN verification link */}
                <div className="sm:col-span-6 flex items-start gap-4">
                  <div className="w-24 h-24 bg-white p-2 rounded-xl border border-gray-300 shadow-sm flex items-center justify-center flex-shrink-0">
                    <QrCode className="w-20 h-20 text-gray-900" />
                  </div>
                  <div className="space-y-1 text-[11px] text-gray-500">
                    <p className="font-bold text-gray-800">Verificación DIAN Oficial</p>
                    <p className="leading-snug">
                      Escanea este código QR con la app de la DIAN o tu celular para verificar la validez jurídica de este comprobante fiscal.
                    </p>
                    <a
                      href={invoice.qrVerificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-red font-bold hover:underline inline-flex items-center gap-1 text-[10px] pt-1"
                    >
                      <span>Validar en Portal DIAN</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Subtotal, Taxes, Total */}
                <div className="sm:col-span-6 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal Base Gravable:</span>
                    <span className="font-semibold text-gray-900">{formatCOP(invoice.financials.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>IVA Régimen Común (19%):</span>
                    <span className="font-semibold text-gray-900">{formatCOP(invoice.financials.ivaTotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Costo de Transporte y Flete:</span>
                    <span className="font-semibold text-gray-900">
                      {invoice.financials.shippingCost === 0 ? 'GRATIS' : formatCOP(invoice.financials.shippingCost)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-black text-gray-950">
                    <span>Total Factura:</span>
                    <span className="text-base text-brand-red font-black">{formatCOP(invoice.financials.totalToPay)}</span>
                  </div>
                  {invoice.financials.totalInWords && (
                    <p className="text-[10px] text-gray-400 italic pt-1">
                      Son: {invoice.financials.totalInWords}
                    </p>
                  )}
                </div>
              </div>

              {/* Legal Footer Note */}
              <div className="pt-6 border-t border-gray-100 text-[10px] text-gray-400 text-center space-y-1">
                <p>
                  Esta factura electrónica de venta se asimila en sus efectos a una Letra de Cambio según el Art. 774 del Código de Comercio.
                </p>
                <p>
                  OK SHOP COMERCIALIZADORA S.A.S. • Carrera 15 # 93-60, Bogotá D.C., Colombia • PBX: 301 777 77 60
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InvoicePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Cargando portal de facturación...</div>}>
      <InvoiceContent />
    </Suspense>
  );
}
