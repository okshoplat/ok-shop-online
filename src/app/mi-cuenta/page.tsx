'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  User,
  MapPin,
  CreditCard,
  Package,
  Heart,
  FileText,
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Edit2,
} from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { INITIAL_PRODUCTS } from '@/data/catalog';
import { ProductCard } from '@/components/products/ProductCard';
import { formatCOP } from '@/lib/utils';

export default function CustomerPortalPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'payments' | 'orders' | 'favorites'>('profile');
  const { favorites } = useWishlistStore();

  const favoriteProducts = INITIAL_PRODUCTS.filter((p) => favorites.includes(p.id));

  // Customer Profile State
  const [profile, setProfile] = useState({
    name: 'Carlos Alberto Rodríguez',
    email: 'carlos.rodriguez@example.com',
    phone: '315 894 1203',
    documentType: 'Cédula de Ciudadanía (CC)',
    documentNumber: '1.017.203.491',
    city: 'Medellín',
    department: 'Antioquia',
  });

  // Saved Addresses
  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      title: 'Casa Principal',
      recipient: 'Carlos Alberto Rodríguez',
      phone: '315 894 1203',
      city: 'Medellín',
      department: 'Antioquia',
      addressLine: 'Calle 10 # 43E-12, Apto 502',
      neighborhood: 'El Poblado',
      isDefault: true,
    },
    {
      id: 'addr-2',
      title: 'Oficina / Trabajo',
      recipient: 'Carlos Rodríguez - OK Shop Pedidos',
      phone: '315 894 1203',
      city: 'Bogotá D.C.',
      department: 'Cundinamarca',
      addressLine: 'Carrera 15 # 93-60, Piso 4',
      neighborhood: 'Chicó Norte',
      isDefault: false,
    },
  ]);

  // Saved Payment Methods
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 'pay-1',
      type: 'NEQUI',
      label: 'Nequi Personal',
      accountInfo: 'Celular 315 *** 1203',
      isDefault: true,
    },
    {
      id: 'pay-2',
      type: 'VISA',
      label: 'Bancolombia Visa Débito',
      accountInfo: 'Terminada en 4242',
      isDefault: false,
    },
  ]);

  // Demo Orders
  const [orders] = useState([
    {
      id: 'OK-2026-10492',
      date: '2026-09-24',
      total: 3190000,
      status: 'IN_TRANSIT',
      statusLabel: 'En Camino a Medellín',
      itemsCount: 1,
      carrier: 'Coordinadora Express',
      trackingGuide: 'CRD-948102941CO',
      invoiceNumber: 'FE-OK-2026-000841',
    },
    {
      id: 'OK-2026-08194',
      date: '2026-08-15',
      total: 179000,
      status: 'DELIVERED',
      statusLabel: 'Entregado con Éxito',
      itemsCount: 1,
      carrier: 'Servientrega',
      trackingGuide: 'SER-89104819CO',
      invoiceNumber: 'FE-OK-2026-000412',
    },
  ]);

  return (
    <div className="py-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-gray-900 via-brand-red-dark to-brand-red text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-2xl font-black shadow-inner">
              CR
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-xl sm:text-2xl font-black">{profile.name}</h1>
                <span className="text-[10px] bg-brand-gold text-gray-950 font-extrabold px-2 py-0.5 rounded-full">
                  CLIENTE OK VIP
                </span>
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                {profile.email} • {profile.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/sigue-tu-pedido"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors border border-white/20"
            >
              Rastrear Pedidos
            </Link>
            <Link
              href="/factura-electronica"
              className="px-4 py-2 bg-white text-gray-900 hover:bg-gray-100 rounded-xl text-xs font-bold transition-colors shadow"
            >
              Descargar Facturas DIAN
            </Link>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Menu */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-brand-red text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Datos Personales</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-brand-red text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Package className="w-4 h-4" />
                <span className="flex-1">Mis Pedidos</span>
                <span className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded font-extrabold">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-colors ${
                  activeTab === 'addresses'
                    ? 'bg-brand-red text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Direcciones de Envío</span>
              </button>

              <button
                onClick={() => setActiveTab('payments')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-colors ${
                  activeTab === 'payments'
                    ? 'bg-brand-red text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Tarjetas y Cuentas</span>
              </button>

              <button
                onClick={() => setActiveTab('favorites')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-colors ${
                  activeTab === 'favorites'
                    ? 'bg-brand-red text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span className="flex-1">Favoritos</span>
                <span className="text-[10px] bg-red-100 text-brand-red px-1.5 py-0.2 rounded font-extrabold">
                  {favorites.length}
                </span>
              </button>
            </div>

            {/* Quick links box */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-2 text-xs">
              <p className="font-bold text-gray-900 uppercase tracking-wider text-[10px]">
                Centro de Atención
              </p>
              <Link
                href="/pqrs"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
              >
                <span>Radicar PQRS</span>
                <HelpCircle className="w-3.5 h-3.5 text-brand-red" />
              </Link>
              <Link
                href="/factura-electronica"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
              >
                <span>Descargar Factura DIAN</span>
                <FileText className="w-3.5 h-3.5 text-brand-green" />
              </Link>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="lg:col-span-9">
            {/* 1. Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Datos Personales y Fiscales</h3>
                    <p className="text-xs text-gray-500">
                      Información utilizada para despachos y emisión de factura electrónica DIAN
                    </p>
                  </div>
                  <span className="p-2 rounded-xl bg-green-50 text-brand-green text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verificado</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-500 font-semibold mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-500 font-semibold mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-500 font-semibold mb-1">Teléfono Móvil (WhatsApp)</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-500 font-semibold mb-1">Documento de Identidad</label>
                    <input
                      type="text"
                      value={profile.documentNumber}
                      onChange={(e) => setProfile({ ...profile, documentNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-500 font-semibold mb-1">Ciudad Principal</label>
                    <input
                      type="text"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-500 font-semibold mb-1">Departamento</label>
                    <input
                      type="text"
                      value={profile.department}
                      onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => alert('Datos personales guardados exitosamente.')}
                    className="px-6 py-2.5 bg-brand-red text-white rounded-xl text-xs font-bold hover:bg-brand-red-dark transition-colors shadow-md shadow-red-200"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            )}

            {/* 2. Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Historial de Pedidos</h3>
                    <p className="text-xs text-gray-500">Consulta el estado, guías y facturas de tus compras</p>
                  </div>
                  <Link
                    href="/sigue-tu-pedido"
                    className="px-3 py-1.5 bg-red-50 text-brand-red rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                  >
                    Rastrear en Vivo
                  </Link>
                </div>

                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-sm">Pedido {order.id}</span>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              order.status === 'DELIVERED'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {order.statusLabel}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">Fecha: {order.date}</p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-base font-black text-brand-red">{formatCOP(order.total)}</p>
                        <p className="text-xs text-gray-500">{order.itemsCount} artículo(s)</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-gray-50 p-3 rounded-xl">
                      <div>
                        <span className="text-gray-400">Transportadora:</span>
                        <p className="font-semibold text-gray-800">{order.carrier} (Guía: {order.trackingGuide})</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Factura Electrónica:</span>
                        <p className="font-semibold text-gray-800">{order.invoiceNumber}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Link
                        href={`/sigue-tu-pedido?orderId=${order.id}`}
                        className="px-4 py-2 bg-brand-red text-white text-xs font-bold rounded-xl hover:bg-brand-red-dark transition-colors"
                      >
                        Sigue tu Pedido
                      </Link>
                      <Link
                        href={`/factura-electronica?orderId=${order.id}`}
                        className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        Ver Factura DIAN
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Direcciones de Entrega</h3>
                    <p className="text-xs text-gray-500">Gestiona tus destinos frecuentes en Colombia</p>
                  </div>
                  <button
                    onClick={() => alert('Formulario de nueva dirección abierto.')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-red text-white text-xs font-bold rounded-xl hover:bg-brand-red-dark transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nueva Dirección</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-5 rounded-2xl border bg-white shadow-sm space-y-3 ${
                        addr.isDefault ? 'border-brand-red ring-1 ring-red-100' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-brand-red" />
                          <h4 className="text-xs font-bold text-gray-900">{addr.title}</h4>
                        </div>
                        {addr.isDefault && (
                          <span className="text-[10px] font-black bg-red-100 text-brand-red px-2 py-0.5 rounded-full">
                            PREDETERMINADA
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-gray-600 space-y-1">
                        <p className="font-semibold text-gray-800">{addr.recipient}</p>
                        <p>{addr.addressLine} - {addr.neighborhood}</p>
                        <p>{addr.city}, {addr.department}</p>
                        <p className="text-gray-400">Tel: {addr.phone}</p>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-semibold">
                        <button className="text-brand-red hover:underline">Editar</button>
                        {!addr.isDefault && (
                          <button className="text-gray-400 hover:text-red-500">Eliminar</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Payment Methods Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Tarjetas &amp; Métodos Guardados</h3>
                    <p className="text-xs text-gray-500">Pagos rápidos y seguros con cifrado de grado bancario</p>
                  </div>
                  <button
                    onClick={() => alert('Vincular nueva tarjeta o billetera digital.')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-red text-white text-xs font-bold rounded-xl hover:bg-brand-red-dark transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Método</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paymentMethods.map((pm) => (
                    <div
                      key={pm.id}
                      className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-gray-700" />
                          <h4 className="text-xs font-bold text-gray-900">{pm.label}</h4>
                        </div>
                        {pm.isDefault && (
                          <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            ACTIVO
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 font-mono">{pm.accountInfo}</p>
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-semibold">
                        <span className="text-brand-green flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Habilitado para compras</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="text-base font-bold text-gray-900">Mis Productos Favoritos</h3>
                  <p className="text-xs text-gray-500">Lista de deseos para la temporada navideña</p>
                </div>

                {favoriteProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {favoriteProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-3">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto" />
                    <p className="font-bold text-gray-700">No tienes productos en favoritos</p>
                    <Link
                      href="/productos"
                      className="inline-block px-4 py-2 bg-brand-red text-white text-xs font-bold rounded-xl"
                    >
                      Explorar Productos
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
