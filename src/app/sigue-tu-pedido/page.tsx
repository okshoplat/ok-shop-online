'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  PackageSearch,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Calendar,
  AlertCircle,
  Phone,
  FileText,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { formatCOP } from '@/lib/utils';
import Link from 'next/link';

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || 'OK-2026-10492';

  const [query, setQuery] = useState(initialOrderId);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = async (searchId: string) => {
    if (!searchId.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/orders/track/${encodeURIComponent(searchId.trim())}`);
      const json = await res.json();
      if (json.success) {
        setOrderData(json.data);
      } else {
        setError(json.error || 'No pudimos localizar la orden especificada.');
        setOrderData(null);
      }
    } catch (e: any) {
      setError('Error al consultar el servicio de rastreo. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      fetchTracking(initialOrderId);
    }
  }, [initialOrderId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(query);
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tracking Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-brand-red text-xs font-bold uppercase tracking-wider">
            <PackageSearch className="w-4 h-4" />
            <span>Rastreo Nacional en Tiempo Real</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
            Sigue tu Pedido OK Shop
          </h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Ingresa tu número de orden (ej: <strong>OK-2026-10492</strong>) o número de guía de transportadora para conocer la ubicación exacta de tu paquete.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-6 flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Número de orden (ej: OK-2026-10492) o guía..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red text-sm font-semibold uppercase shadow-sm"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-red-200 disabled:bg-gray-400"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Rastrear</span>}
            </button>
          </form>
        </div>

        {/* Results Container */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl flex items-start gap-3 text-xs mb-8">
            <AlertCircle className="w-5 h-5 text-brand-red flex-shrink-0" />
            <div>
              <p className="font-bold">No se encontró el pedido</p>
              <p className="mt-0.5">{error}</p>
              <p className="mt-2 text-gray-600">
                ¿Necesitas ayuda? Escríbenos directamente a WhatsApp: <strong>301 777 77 60</strong>
              </p>
            </div>
          </div>
        )}

        {orderData && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden animate-fadeIn space-y-6 p-6 sm:p-8">
            {/* Top Status Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
              <div>
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  Número de Pedido
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5">
                  {orderData.orderNumber}
                </h3>
                <p className="text-xs text-gray-500">
                  Destinatario: <strong>{orderData.customerName}</strong>
                </p>
              </div>

              <div className="sm:text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black uppercase tracking-wider">
                  <Truck className="w-3.5 h-3.5" />
                  <span>{orderData.statusLabel}</span>
                </span>
                <p className="text-xs text-gray-400 mt-1 flex items-center sm:justify-end gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Entrega Estimada: <strong>{orderData.estimatedDelivery}</strong></span>
                </p>
              </div>
            </div>

            {/* Carrier Information Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-2xl text-xs">
              <div>
                <span className="text-gray-400">Empresa Transportadora:</span>
                <p className="font-bold text-gray-900 mt-0.5">{orderData.trackingCarrier}</p>
              </div>
              <div>
                <span className="text-gray-400">Guía de Despacho:</span>
                <p className="font-mono font-bold text-brand-red mt-0.5">{orderData.trackingNumber}</p>
              </div>
              <div>
                <span className="text-gray-400">Ciudad de Destino:</span>
                <p className="font-bold text-gray-900 mt-0.5">{orderData.shippingCity}, {orderData.shippingDepartment}</p>
              </div>
            </div>

            {/* Visual Stepper Milestone Timeline */}
            <div className="py-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">
                Progreso del Envío
              </h4>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
                {orderData.timeline?.map((step: any, index: number) => {
                  const isCompleted = step.status === 'completed';
                  const isCurrent = step.status === 'current';

                  return (
                    <div key={index} className="relative flex items-start gap-4">
                      {/* Step Indicator Dot */}
                      <div
                        className={`absolute -left-6 sm:-left-8 w-6 sm:w-7 h-6 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold shadow ${
                          isCompleted
                            ? 'bg-brand-green text-white ring-4 ring-green-100'
                            : isCurrent
                            ? 'bg-brand-red text-white ring-4 ring-red-100 animate-pulse'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                      </div>

                      {/* Step Details */}
                      <div className="flex-1 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h5 className={`text-sm font-bold ${isCurrent ? 'text-brand-red' : 'text-gray-900'}`}>
                            {step.title}
                          </h5>
                          <span className="text-xs text-gray-400 font-mono">
                            {step.date}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <a
                href={`https://wa.me/573017777760?text=${encodeURIComponent(
                  `Hola OK Shop! Necesito información sobre el estado de mi pedido ${orderData.orderNumber}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 bg-brand-whatsapp hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Asistencia WhatsApp (301 777 77 60)</span>
              </a>

              <Link
                href={`/factura-electronica?orderId=${orderData.orderNumber}`}
                className="w-full sm:w-auto px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-brand-green" />
                <span>Consultar Factura Electrónica</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Cargando módulo de rastreo...</div>}>
      <TrackingContent />
    </Suspense>
  );
}
