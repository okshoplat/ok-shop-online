'use client';

import React, { useState } from 'react';
import { MapPin, X, Check, Truck } from 'lucide-react';
import { useLocationStore } from '@/store/useLocationStore';
import { COLOMBIA_CITIES, formatCOP } from '@/lib/utils';

export const LocationModal: React.FC = () => {
  const { city, department, isModalOpen, closeModal, setCity } = useLocationStore();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isModalOpen) return null;

  const filteredCities = COLOMBIA_CITIES.filter(
    (c) =>
      c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 animate-scaleUp"
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-modal-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-red to-brand-red-dark text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 id="location-modal-title" className="text-lg font-bold">
                Ingresa tu ubicación
              </h3>
              <p className="text-xs text-white/80">
                Calculamos tiempos y costos de entrega para tu ciudad
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar ciudad o departamento (ej: Bogotá, Medellín)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
              autoFocus
            />
            <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
          </div>
        </div>

        {/* City List */}
        <div className="max-h-72 overflow-y-auto p-3 space-y-1 divide-y divide-gray-50">
          {filteredCities.map((item) => {
            const isSelected = item.city === city;
            return (
              <button
                key={`${item.city}-${item.department}`}
                onClick={() => setCity(item.city, item.department)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                  isSelected
                    ? 'bg-red-50 text-brand-red border border-red-200 font-semibold'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div>
                  <p className="text-sm font-medium">{item.city}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <span>{item.department}</span>
                    <span>•</span>
                    <Truck className="w-3 h-3 text-brand-green" />
                    <span>Llega en {item.days}</span>
                  </p>
                </div>
                <div className="text-right flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600">
                    Desde {formatCOP(item.baseCost)}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-brand-red text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}

          {filteredCities.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              No encontramos resultados para tu búsqueda. Hacemos envíos a todo Colombia.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
          <p className="text-xs text-gray-500">
            🚚 <strong className="text-brand-green">¡Envío Gratis!</strong> En todas las compras superiores a $150.000 COP a nivel nacional.
          </p>
        </div>
      </div>
    </div>
  );
};
