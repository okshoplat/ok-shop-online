'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  FileCheck,
  Send,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Phone,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react';

export default function PQRSPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'track' | 'faq'>('create');

  // Form State
  const [formData, setFormData] = useState({
    type: 'PETICION',
    customerName: '',
    email: '',
    phone: '',
    orderNumber: '',
    subject: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Track State
  const [searchRadicado, setSearchRadicado] = useState('');
  const [isTrackLoading, setIsTrackLoading] = useState(false);
  const [trackedData, setTrackedData] = useState<any>(null);
  const [trackError, setTrackError] = useState<string | null>(null);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const FAQS = [
    {
      q: '¿Cuánto tiempo tarda en llegar mi pedido a ciudades principales?',
      a: 'Para ciudades principales como Bogotá, Medellín, Cali, Barranquilla y Bucaramanga, el tiempo de entrega habitual es de 24 a 48 horas hábiles a través de Coordinadora o Servientrega con guía rastreable.',
    },
    {
      q: '¿Cómo obtengo el descuento especial de Nequi o Transferencia Bancaria?',
      a: 'Al momento de seleccionar Nequi, Daviplata, Bancolombia o PSE como método de pago en el carrito, se aplicará automáticamente el precio especial de transferencia con hasta 5% de descuento adicional.',
    },
    {
      q: '¿Qué garantía tienen las bicicletas eléctricas y patinetas?',
      a: 'Nuestros vehículos eléctricos cuentan con 1 a 2 años de garantía directa de OK Shop en marco, motor y componentes electrónicos principales. Conserva tu factura electrónica para hacerla efectiva.',
    },
    {
      q: '¿Cómo radicar una petición, queja o reclamo formal?',
      a: 'Puedes diligenciar el formulario en esta misma sección. El sistema generará automáticamente un número de radicado oficial con el cual podrás hacer seguimiento y recibirás respuesta en un plazo máximo de 48 horas hábiles.',
    },
  ];

  const handleCreatePQRS = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/v1/pqrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        setSubmitSuccess(json.data);
        setFormData({
          type: 'PETICION',
          customerName: '',
          email: '',
          phone: '',
          orderNumber: '',
          subject: '',
          description: '',
        });
      } else {
        setSubmitError(json.error || 'Ocurrió un error al radicar tu solicitud.');
      }
    } catch (err) {
      setSubmitError('Error de conexión al enviar el requerimiento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackPQRS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRadicado.trim()) return;

    setIsTrackLoading(true);
    setTrackError(null);

    try {
      const res = await fetch(`/api/v1/pqrs/${encodeURIComponent(searchRadicado.trim())}`);
      const json = await res.json();
      if (json.success) {
        setTrackedData(json.data);
      } else {
        setTrackError(json.error || 'No se encontró ninguna solicitud con ese número de radicado.');
        setTrackedData(null);
      }
    } catch (err) {
      setTrackError('Error al consultar radicado PQRS.');
    } finally {
      setIsTrackLoading(false);
    }
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Atención al Cliente • Superintendencia de Industria y Comercio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
            PQRS &amp; Centro de Ayuda OK Shop
          </h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Garantizamos tus derechos como consumidor. Radica tu Petición, Queja, Reclamo o Sugerencia y haz seguimiento en tiempo real.
          </p>

          {/* Navigation Tabs */}
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'create'
                  ? 'bg-brand-red text-white shadow-md shadow-red-200'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Radicar Nueva PQRS
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'track'
                  ? 'bg-brand-red text-white shadow-md shadow-red-200'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Consultar Radicado
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'faq'
                  ? 'bg-brand-red text-white shadow-md shadow-red-200'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Preguntas Frecuentes
            </button>
          </div>
        </div>

        {/* Tab 1: Create PQRS */}
        {activeTab === 'create' && (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-200 shadow-xl space-y-6 animate-fadeIn">
            {submitSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 text-brand-green mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">
                    ¡Solicitud Radicada con Éxito!
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Tu número de radicado oficial es:
                  </p>
                  <p className="text-2xl font-mono font-black text-brand-red mt-1">
                    {submitSuccess.radicado}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl text-xs text-gray-600 max-w-md mx-auto space-y-1">
                  <p><strong>Tipo:</strong> {submitSuccess.type}</p>
                  <p><strong>Estado:</strong> {submitSuccess.statusLabel}</p>
                  <p><strong>Plazo de respuesta:</strong> Hasta {submitSuccess.estimatedResponseHours} horas hábiles.</p>
                </div>

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => setSubmitSuccess(null)}
                    className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors"
                  >
                    Radicar otra solicitud
                  </button>
                  <button
                    onClick={() => {
                      setSearchRadicado(submitSuccess.radicado);
                      setActiveTab('track');
                    }}
                    className="px-5 py-2.5 bg-brand-red text-white rounded-xl text-xs font-bold hover:bg-brand-red-dark transition-colors"
                  >
                    Consultar este radicado
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreatePQRS} className="space-y-5">
                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Type Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Tipo de Requerimiento *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { type: 'PETICION', label: 'Petición / Consulta' },
                      { type: 'QUEJA', label: 'Queja de Servicio' },
                      { type: 'RECLAMO', label: 'Reclamo de Producto' },
                      { type: 'SUGERENCIA', label: 'Sugerencia de Mejora' },
                    ].map((item) => (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: item.type })}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                          formData.type === item.type
                            ? 'border-brand-red bg-red-50 text-brand-red shadow-sm'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre y apellidos"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      placeholder="Para enviar la respuesta oficial"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Teléfono Móvil *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej: 301 777 77 60"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red font-medium"
                    />
                  </div>
                </div>

                {/* Order Number optional */}
                <div className="text-xs">
                  <label className="block text-gray-700 font-semibold mb-1">
                    Número de Pedido (Opcional si aplica a una compra)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: OK-2026-10492"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red font-medium uppercase"
                  />
                </div>

                {/* Subject & Description */}
                <div className="text-xs space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Asunto de la Solicitud *</label>
                    <input
                      type="text"
                      required
                      placeholder="Resumen breve del caso..."
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Descripción Detallada de los Hechos *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe con claridad lo sucedido, fechas, referencias del producto o requerimientos específicos..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red font-medium"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <p className="text-[11px] text-gray-400">
                    * Todos los campos son obligatorios salvo el número de orden.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-brand-red hover:bg-brand-red-dark disabled:bg-gray-400 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-red-200"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Radicando requerimiento...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Radicar Solicitud Oficial</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Track PQRS */}
        {activeTab === 'track' && (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-200 shadow-xl space-y-6 animate-fadeIn">
            <div className="text-center max-w-md mx-auto space-y-3">
              <h3 className="text-xl font-bold text-gray-900">Consultar Estado de Radicado</h3>
              <p className="text-xs text-gray-500">
                Ingresa el código que recibiste al momento de radicar (ej: <strong>PQRS-2026-4819</strong>).
              </p>

              <form onSubmit={handleTrackPQRS} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="PQRS-2026-XXXX"
                  value={searchRadicado}
                  onChange={(e) => setSearchRadicado(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
                <button
                  type="submit"
                  disabled={isTrackLoading}
                  className="px-5 py-2.5 bg-brand-red text-white text-xs font-bold rounded-xl hover:bg-brand-red-dark transition-colors disabled:bg-gray-400"
                >
                  {isTrackLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Buscar</span>}
                </button>
              </form>
            </div>

            {trackError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{trackError}</span>
              </div>
            )}

            {trackedData && (
              <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50/70 space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-gray-200 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Radicado</span>
                    <h4 className="text-base font-black text-brand-red font-mono">{trackedData.radicado}</h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-extrabold text-[11px]">
                    {trackedData.statusLabel}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                  <div>
                    <span className="text-gray-400">Titular:</span>
                    <p className="font-semibold">{trackedData.customerName}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Tipo:</span>
                    <p className="font-semibold">{trackedData.type}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-400">Asunto:</span>
                    <p className="font-semibold text-gray-900">{trackedData.subject}</p>
                  </div>
                  <div className="sm:col-span-2 bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400">Detalle radicado:</span>
                    <p className="text-gray-700 mt-0.5">{trackedData.description}</p>
                  </div>
                </div>

                {trackedData.response && (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-brand-green" />
                      <span>Respuesta Oficial del Área de Calidad</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed pt-1">{trackedData.response}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: FAQ */}
        {activeTab === 'faq' && (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-200 shadow-xl space-y-3 animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h3>
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-gray-900 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-brand-red" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-gray-600 bg-gray-50/50 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
