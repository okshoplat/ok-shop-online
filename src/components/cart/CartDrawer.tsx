'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  CreditCard,
  QrCode,
  Tag,
  Truck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useCartStore, PaymentMethodType } from '@/store/useCartStore';
import { useLocationStore } from '@/store/useLocationStore';
import { formatCOP, FREE_SHIPPING_THRESHOLD } from '@/lib/utils';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isDrawerOpen,
    setDrawerOpen,
    removeItem,
    updateQuantity,
    clearCart,
    paymentMethod,
    setPaymentMethod,
    couponCode,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getSavings,
    getTotal,
  } = useCartStore();

  const { city, department } = useLocationStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any>(null);

  if (!isDrawerOpen) return null;

  const { subtotal, discount, shipping, isFreeShipping, total } = getTotal(city);
  const savings = getSavings();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
  };

  const handleCreateOrder = async () => {
    setIsCheckingOut(true);
    try {
      const response = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          customer: {
            name: 'Cliente OK Shop',
            email: 'cliente@okshop.com.co',
            phone: '3017777760',
            documentType: 'CC',
            documentNumber: '1020304050',
          },
          shipping: {
            city,
            department,
            addressLine: 'Carrera 15 # 93-60',
            notes: 'Dejar en portería si no responden',
          },
          paymentType: paymentMethod,
          couponCode: couponCode || undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setOrderComplete(data.data.order);
        clearCart();
      } else {
        alert(data.error || 'Error al generar pedido.');
      }
    } catch (err: any) {
      alert('Error de conexión al procesar el pedido.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const paymentOptions: Array<{ type: PaymentMethodType; label: string; badge?: string; note: string }> = [
    {
      type: 'NEQUI',
      label: 'Nequi / Daviplata / PSE',
      badge: '5% DESCUENTO EXTRA',
      note: 'Precio especial transferencia inmediata',
    },
    {
      type: 'BANK_TRANSFER',
      label: 'Bancolombia Transferencia',
      badge: 'PRECIO ESPECIAL',
      note: 'Ahorro directo en catálogo',
    },
    {
      type: 'CREDIT_CARD',
      label: 'Tarjeta de Crédito / Débito',
      note: 'Hasta 12 cuotas con Visa o Mastercard',
    },
    {
      type: 'CASH_ON_DELIVERY',
      label: 'Pago Contra Entrega',
      note: 'Pagas en efectivo al recibir tu paquete',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slideLeft"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-brand-red flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 id="cart-drawer-title" className="text-base font-bold text-gray-900">
                Tu Carrito de Compras
              </h3>
              <p className="text-xs text-gray-500">
                {items.length} {items.length === 1 ? 'producto' : 'productos'} añadidos
              </p>
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-4 py-2.5 bg-red-50 border-b border-red-100 text-xs">
          {subtotal >= FREE_SHIPPING_THRESHOLD ? (
            <div className="flex items-center gap-2 text-brand-green font-bold">
              <CheckCircle2 className="w-4 h-4 text-brand-green" />
              <span>¡Felicitaciones! Tienes ENVÍO GRATIS a {city}.</span>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-gray-700 font-medium mb-1">
                <span>
                  Agrega <strong>{formatCOP(FREE_SHIPPING_THRESHOLD - subtotal)}</strong> más para <strong>Envío Gratis</strong>
                </span>
                <span>{Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%</span>
              </div>
              <div className="w-full bg-red-200/70 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-brand-green h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {orderComplete ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 text-brand-green mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">¡Pedido Generado con Éxito!</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Número de Orden: <strong className="text-brand-red">{orderComplete.orderNumber}</strong>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Destino: {orderComplete.shippingCity}, {orderComplete.shippingDepartment}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl text-left text-xs space-y-2 border border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total a Pagar:</span>
                  <span className="font-bold text-gray-900">{formatCOP(orderComplete.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Método de Pago:</span>
                  <span className="font-medium text-gray-800">{orderComplete.paymentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transportadora:</span>
                  <span className="font-medium text-gray-800">{orderComplete.trackingCarrier}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href={`/sigue-tu-pedido?orderId=${orderComplete.orderNumber}`}
                  onClick={() => setDrawerOpen(false)}
                  className="block w-full py-3 bg-brand-red hover:bg-brand-red-dark text-white rounded-xl font-bold text-sm transition-colors"
                >
                  Rastrear mi Envío en Vivo
                </Link>
                <Link
                  href={`/factura-electronica?orderId=${orderComplete.orderNumber}`}
                  onClick={() => setDrawerOpen(false)}
                  className="block w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-semibold text-xs transition-colors"
                >
                  Ver Factura Electrónica DIAN
                </Link>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-bold text-gray-800">Tu carrito está vacío</p>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Descubre los mejores regalos del Catálogo Navideño 2026 de OK Shop y añádelos a tu orden.
              </p>
              <button
                onClick={() => setDrawerOpen(false)}
                className="mt-2 inline-flex items-center px-4 py-2 rounded-full bg-brand-red text-white text-xs font-bold hover:bg-brand-red-dark transition-colors"
              >
                Explorar Catálogo Navideño
              </button>
            </div>
          ) : (
            <div className="space-y-3 divide-y divide-gray-100">
              {items.map((item) => {
                const isSpecial = ['BANK_TRANSFER', 'NEQUI', 'DAVIPLATA', 'PSE'].includes(paymentMethod);
                const currentPrice = isSpecial && item.specialTransferPrice ? item.specialTransferPrice : item.offerPrice;

                return (
                  <div key={item.id} className="pt-3 first:pt-0 flex gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-gray-900 truncate">{item.name}</h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 p-0.5"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.variantName && (
                        <p className="text-[11px] text-gray-400">{item.variantName}</p>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <p className="text-xs font-extrabold text-brand-red">
                            {formatCOP(currentPrice)}
                          </p>
                          <p className="text-[10px] text-gray-400 line-through">
                            {formatCOP(item.regularPrice)}
                          </p>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-gray-200 text-gray-600 transition-colors"
                            aria-label="Restar una unidad"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-gray-200 text-gray-600 transition-colors"
                            aria-label="Sumar una unidad"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Payment Method Selector with dynamic discount */}
              <div className="pt-4 space-y-2">
                <p className="text-xs font-bold text-gray-700 flex items-center justify-between">
                  <span>Método de Pago Preferido:</span>
                  <span className="text-[10px] text-brand-green font-semibold">
                    ¡Ahorra pagando con Nequi o Transferencia!
                  </span>
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {paymentOptions.map((opt) => {
                    const isSelected = paymentMethod === opt.type;
                    return (
                      <button
                        key={opt.type}
                        type="button"
                        onClick={() => setPaymentMethod(opt.type)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-brand-red bg-red-50/50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-brand-red' : 'border-gray-400'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-brand-red" />}
                          </div>
                          <div>
                            <span className="font-bold text-gray-800">{opt.label}</span>
                            <p className="text-[10px] text-gray-500">{opt.note}</p>
                          </div>
                        </div>
                        {opt.badge && (
                          <span className="text-[9px] font-extrabold bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                            {opt.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="pt-3">
                {couponCode ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-green-50 border border-green-200 text-xs text-brand-green">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-brand-green" />
                      <div>
                        <span className="font-bold">Cupón activo: {couponCode}</span>
                        <p className="text-[10px] text-green-700">Descuento de {formatCOP(couponDiscount)}</p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-semibold text-red-600 hover:underline"
                    >
                      Quitar
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Código de cupón (ej: NAVIDAD2026)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red uppercase font-semibold"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Aplicar
                    </button>
                  </form>
                )}
                {couponFeedback && !couponCode && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{couponFeedback.message}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer with Financial Summary */}
        {!orderComplete && items.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/90 space-y-3">
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal productos:</span>
                <span className="font-semibold text-gray-900">{formatCOP(subtotal)}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-brand-green">
                  <span>Ahorro del catálogo:</span>
                  <span className="font-bold">-{formatCOP(savings)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-brand-green">
                  <span>Cupón aplicado ({couponCode}):</span>
                  <span className="font-bold">-{formatCOP(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-gray-500" />
                  <span>Envío a {city}:</span>
                </span>
                <span className={isFreeShipping ? 'font-bold text-brand-green' : 'font-semibold text-gray-900'}>
                  {isFreeShipping ? 'GRATIS' : formatCOP(shipping)}
                </span>
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">Total a Pagar:</span>
                <span className="text-lg font-black text-brand-red">{formatCOP(total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={handleCreateOrder}
                disabled={isCheckingOut}
                className="w-full py-3 px-4 bg-brand-red hover:bg-brand-red-dark disabled:bg-gray-400 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-200 transition-all hover:scale-[1.01]"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generando pedido y factura DIAN...</span>
                  </>
                ) : (
                  <>
                    <span>Confirmar y Finalizar Pedido</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <a
                href={`https://wa.me/573017777760?text=${encodeURIComponent(
                  `Hola OK Shop! Deseo ordenar por WhatsApp:\n${items
                    .map((i) => `• ${i.quantity}x ${i.name} (${formatCOP(i.offerPrice)})`)
                    .join('\n')}\nTotal: ${formatCOP(total)}\nCiudad: ${city}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-4 bg-brand-whatsapp hover:bg-green-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Hacer este pedido directo al WhatsApp (301 777 77 60)</span>
              </a>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
              <span>Compra 100% segura • Factura Electrónica DIAN incluida</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
