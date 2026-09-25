'use client';

import React, { useState, useEffect } from 'react';
import { Phone, X, Send, Sparkles, MessageCircle } from 'lucide-react';

export const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);

  // Automatically show prompt after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasPrompted(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenWhatsApp = (message: string) => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/573017777760?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Chat Bubble */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-scaleUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-whatsapp to-green-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white text-brand-whatsapp flex items-center justify-center font-bold text-lg shadow">
                  OK
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-300 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold flex items-center gap-1">
                  <span>Asesoría OK Shop</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-normal">En línea</span>
                </h4>
                <p className="text-[11px] text-white/90">
                  WhatsApp Oficial: 301 777 77 60
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
              aria-label="Cerrar chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-gray-50/80 space-y-3 text-xs">
            <div className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-gray-800 space-y-2">
              <p className="font-semibold text-gray-900 flex items-center gap-1 text-[13px]">
                <span>¡Hola! Te damos la bienvenida a OK Shop 🎅</span>
              </p>
              <p className="text-gray-600 leading-relaxed">
                ¿Te gustaría recibir el <strong>Catálogo Navideño 2026</strong> en PDF, cotizar anchetas corporativas o asesoría para tu pedido?
              </p>
              <div className="pt-1 flex items-center gap-1 text-[10px] text-gray-400">
                <span>Respuesta habitual: Inmediata</span>
              </div>
            </div>

            {/* Quick action chips */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Opciones rápidas:
              </p>
              <button
                onClick={() =>
                  handleOpenWhatsApp('¡Hola! Me gustaría cotizar Anchetas Navideñas 2026.')
                }
                className="w-full text-left p-2 rounded-xl bg-white hover:bg-green-50 hover:text-green-800 text-gray-700 border border-gray-200/80 transition-colors flex items-center justify-between font-medium"
              >
                <span>🎁 Cotizar Anchetas Navideñas</span>
                <span className="text-gray-400">&rarr;</span>
              </button>
              <button
                onClick={() =>
                  handleOpenWhatsApp('¡Hola! Quiero información sobre Bicicletas Eléctricas y Normales.')
                }
                className="w-full text-left p-2 rounded-xl bg-white hover:bg-green-50 hover:text-green-800 text-gray-700 border border-gray-200/80 transition-colors flex items-center justify-between font-medium"
              >
                <span>🚲 Info Bicicletas Eléctricas</span>
                <span className="text-gray-400">&rarr;</span>
              </button>
              <button
                onClick={() =>
                  handleOpenWhatsApp('¡Hola OK Shop! Deseo realizar un pedido directo del catálogo.')
                }
                className="w-full text-left p-2 rounded-xl bg-white hover:bg-green-50 hover:text-green-800 text-gray-700 border border-gray-200/80 transition-colors flex items-center justify-between font-medium"
              >
                <span>🛒 Hacer pedido directo por WhatsApp</span>
                <span className="text-gray-400">&rarr;</span>
              </button>
            </div>
          </div>

          {/* Footer Input Button */}
          <div className="p-3 bg-white border-t border-gray-100">
            <button
              onClick={() =>
                handleOpenWhatsApp('¡Hola OK Shop! Quisiera asesoría para una compra.')
              }
              className="w-full py-2.5 px-4 bg-brand-whatsapp hover:bg-green-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-green-100"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chatear al 301 777 77 60</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Prompt Pill (before click) */}
      {!isOpen && hasPrompted && (
        <div
          onClick={() => setIsOpen(true)}
          className="mb-2 bg-white text-gray-800 text-xs font-semibold py-2 px-3.5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform animate-fadeIn"
        >
          <span className="w-2 h-2 rounded-full bg-brand-whatsapp animate-ping" />
          <span>¿Hacer pedido al <strong>301 777 77 60</strong>?</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setHasPrompted(false);
            }}
            className="text-gray-400 hover:text-gray-600 p-0.5"
            aria-label="Cerrar sugerencia"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-brand-whatsapp text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
        aria-label="Abrir chat de WhatsApp OK Shop"
      >
        <div className="absolute inset-0 rounded-full bg-brand-whatsapp animate-ping opacity-25" />
        <Phone className="w-7 h-7 relative z-10 fill-white" />
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-red text-white text-[11px] font-black flex items-center justify-center border-2 border-white shadow">
          1
        </span>
      </button>
    </div>
  );
};
