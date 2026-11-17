'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { formatCOP } from '@izone/shared-types';
import { buildWaMeUrl } from '@/lib/whatsapp';
import { ArrowRight, CheckCircle2, MessageCircle, RefreshCw, Store } from 'lucide-react';

interface TradeInSourceDevice {
  slug: string;
  name: string;
  baseValue: number;
}

interface TargetDevice {
  slug: string;
  name: string;
  price: number;
}

const SOURCE_DEVICES: TradeInSourceDevice[] = [
  { slug: 'iphone-16-pro-max', name: 'iPhone 16 Pro Max', baseValue: 3900000 },
  { slug: 'iphone-16-pro', name: 'iPhone 16 Pro', baseValue: 3350000 },
  { slug: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max', baseValue: 3200000 },
  { slug: 'iphone-15-pro', name: 'iPhone 15 Pro', baseValue: 2700000 },
  { slug: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max', baseValue: 2200000 },
  { slug: 'iphone-14-pro', name: 'iPhone 14 Pro', baseValue: 1850000 },
  { slug: 'iphone-13-pro-max', name: 'iPhone 13 Pro Max', baseValue: 1550000 },
  { slug: 'iphone-13', name: 'iPhone 13', baseValue: 1050000 },
];

const STORAGE_OPTIONS = [
  { label: '128GB', bonus: 0 },
  { label: '256GB', bonus: 200000 },
  { label: '512GB', bonus: 400000 },
] as const;

const SCREEN_OPTIONS = [
  { id: 'perfect', label: 'Impecable (sin rayones ni golpes)', deduction: 0 },
  { id: 'light', label: 'Rayones leves de uso', deduction: 0.1 },
  { id: 'damaged', label: 'Grietas o golpes visibles', deduction: 0.35 },
] as const;

const FUNCTION_OPTIONS = [
  { id: 'ok', label: 'Todo funciona al 100% (Face ID, cámaras, carga)', deduction: 0 },
  { id: 'minor', label: 'Presenta alguna falla menor', deduction: 0.2 },
] as const;

const BATTERY_OPTIONS = [
  { id: 'good', label: 'Salud de batería 85% o superior', deduction: 0 },
  { id: 'low', label: 'Salud de batería menor a 85%', deduction: 0.1 },
] as const;

const TARGET_DEVICES: TargetDevice[] = [
  { slug: 'iphone-duo', name: 'iPhone Duo (256GB)', price: 9650000 },
  { slug: 'iphone-18-pro-max', name: 'iPhone 18 Pro Max (256GB)', price: 6100000 },
  { slug: 'iphone-18-pro', name: 'iPhone 18 Pro (256GB)', price: 4800000 },
  { slug: 'iphone-17-pro-max', name: 'iPhone 17 Pro Max (256GB)', price: 4100000 },
];

export function TradeInCalculator({ initialTargetSlug }: { initialTargetSlug?: string }) {
  const defaultTarget =
    TARGET_DEVICES.find((d) => d.slug === initialTargetSlug)?.slug ?? TARGET_DEVICES[0].slug;

  const [sourceSlug, setSourceSlug] = useState(SOURCE_DEVICES[0].slug);
  const [storageLabel, setStorageLabel] = useState<string>('256GB');
  const [screenState, setScreenState] = useState<string>('perfect');
  const [functionState, setFunctionState] = useState<string>('ok');
  const [batteryState, setBatteryState] = useState<string>('good');
  const [targetSlug, setTargetSlug] = useState(defaultTarget);

  const calculation = useMemo(() => {
    const source = SOURCE_DEVICES.find((d) => d.slug === sourceSlug) ?? SOURCE_DEVICES[0];
    const storageBonus = STORAGE_OPTIONS.find((s) => s.label === storageLabel)?.bonus ?? 0;
    const screenDed = SCREEN_OPTIONS.find((s) => s.id === screenState)?.deduction ?? 0;
    const funcDed = FUNCTION_OPTIONS.find((f) => f.id === functionState)?.deduction ?? 0;
    const batDed = BATTERY_OPTIONS.find((b) => b.id === batteryState)?.deduction ?? 0;

    const totalDeduction = Math.min(0.65, screenDed + funcDed + batDed);
    const rawValue = (source.baseValue + storageBonus) * (1 - totalDeduction);
    const estimatedValue = Math.max(300000, Math.round(rawValue / 50000) * 50000);

    const target = TARGET_DEVICES.find((t) => t.slug === targetSlug) ?? TARGET_DEVICES[0];
    const balanceToPay = Math.max(0, target.price - estimatedValue);

    return {
      source,
      target,
      estimatedValue,
      balanceToPay,
    };
  }, [sourceSlug, storageLabel, screenState, functionState, batteryState, targetSlug]);

  const handleScheduleWhatsapp = () => {
    const screenText = SCREEN_OPTIONS.find((s) => s.id === screenState)?.label ?? '';
    const funcText = FUNCTION_OPTIONS.find((f) => f.id === functionState)?.label ?? '';
    const batText = BATTERY_OPTIONS.find((b) => b.id === batteryState)?.label ?? '';

    const message = [
      'Hola iZone Tech, quiero agendar valoración presencial para Plan Retoma:',
      `- Equipo que entrego: ${calculation.source.name} (${storageLabel})`,
      `- Pantalla: ${screenText}`,
      `- Funcionamiento: ${funcText}`,
      `- Batería: ${batText}`,
      `- Retoma estimada: ${formatCOP(calculation.estimatedValue)}`,
      `- Equipo nuevo de interés: ${calculation.target.name} (${formatCOP(calculation.target.price)})`,
      `- Saldo estimado en tienda: ${formatCOP(calculation.balanceToPay)}`,
    ].join('\n');

    window.open(buildWaMeUrl(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7 space-y-6 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 md:p-8">
        <div>
          <label
            htmlFor="tradein-source"
            className="block text-sm font-bold text-neutral-900 dark:text-white mb-2"
          >
            1. ¿Qué iPhone deseas entregar en parte de pago?
          </label>
          <select
            id="tradein-source"
            value={sourceSlug}
            onChange={(e) => setSourceSlug(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-4 py-3 text-sm font-semibold text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-[#0071E3]"
          >
            {SOURCE_DEVICES.map((device) => (
              <option key={device.slug} value={device.slug}>
                {device.name} (hasta {formatCOP(device.baseValue + 400000)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="text-sm font-bold text-neutral-900 dark:text-white mb-2">
            2. Capacidad de almacenamiento
          </p>
          <div className="grid grid-cols-3 gap-3">
            {STORAGE_OPTIONS.map((opt) => {
              const active = storageLabel === opt.label;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setStorageLabel(opt.label)}
                  className={`py-2.5 px-3 rounded-xl border text-sm font-semibold transition ${
                    active
                      ? 'border-[#0071E3] bg-blue-50 text-[#0071E3] dark:bg-blue-950/40 dark:text-blue-300 ring-1 ring-[#0071E3]'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <fieldset className="space-y-2.5">
          <legend className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
            3. Estado de la pantalla
          </legend>
          {SCREEN_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer text-sm transition ${
                screenState === opt.id
                  ? 'border-[#0071E3] bg-blue-50/60 dark:bg-blue-950/30'
                  : 'border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <input
                type="radio"
                name="screen-state"
                checked={screenState === opt.id}
                onChange={() => setScreenState(opt.id)}
                className="accent-[#0071E3]"
              />
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                {opt.label}
              </span>
            </label>
          ))}
        </fieldset>

        <fieldset className="space-y-2.5">
          <legend className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
            4. Funcionamiento general
          </legend>
          {FUNCTION_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer text-sm transition ${
                functionState === opt.id
                  ? 'border-[#0071E3] bg-blue-50/60 dark:bg-blue-950/30'
                  : 'border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <input
                type="radio"
                name="function-state"
                checked={functionState === opt.id}
                onChange={() => setFunctionState(opt.id)}
                className="accent-[#0071E3]"
              />
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                {opt.label}
              </span>
            </label>
          ))}
        </fieldset>

        <fieldset className="space-y-2.5">
          <legend className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
            5. Salud de la batería
          </legend>
          {BATTERY_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer text-sm transition ${
                batteryState === opt.id
                  ? 'border-[#0071E3] bg-blue-50/60 dark:bg-blue-950/30'
                  : 'border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <input
                type="radio"
                name="battery-state"
                checked={batteryState === opt.id}
                onChange={() => setBatteryState(opt.id)}
                className="accent-[#0071E3]"
              />
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                {opt.label}
              </span>
            </label>
          ))}
        </fieldset>

        <div>
          <label
            htmlFor="tradein-target"
            className="block text-sm font-bold text-neutral-900 dark:text-white mb-2"
          >
            6. Equipo nuevo que deseas llevarte
          </label>
          <select
            id="tradein-target"
            value={targetSlug}
            onChange={(e) => setTargetSlug(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-4 py-3 text-sm font-semibold text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-[#0071E3]"
          >
            {TARGET_DEVICES.map((device) => (
              <option key={device.slug} value={device.slug}>
                {device.name} — {formatCOP(device.price)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <aside className="lg:col-span-5 lg:sticky lg:top-24 bg-[#141416] text-white rounded-3xl p-6 md:p-8 border border-neutral-800 space-y-6">
        <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Resumen de Retoma
        </div>

        <div className="space-y-4 border-b border-white/10 pb-6">
          <div>
            <p className="text-xs text-neutral-400">Valor estimado por tu {calculation.source.name}</p>
            <p className="text-3xl md:text-4xl font-extrabold text-emerald-400 mt-1">
              {formatCOP(calculation.estimatedValue)}
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-4 space-y-2 text-sm">
            <div className="flex justify-between text-neutral-300">
              <span>Nuevo equipo: {calculation.target.name}</span>
              <span className="font-semibold">{formatCOP(calculation.target.price)}</span>
            </div>
            <div className="flex justify-between text-emerald-400">
              <span>Abono estimado por retoma</span>
              <span className="font-semibold">-{formatCOP(calculation.estimatedValue)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
              <span>Saldo estimado a pagar</span>
              <span>{formatCOP(calculation.balanceToPay)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2.5 text-xs text-neutral-300">
          <p className="flex items-start gap-2">
            <Store className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              La valoración definitiva se realiza presencialmente en <strong>iZone Tech (CC Unilago, Local L 1-143, Bogotá)</strong>.
            </span>
          </p>
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              Puedes pagar el saldo restante con tarjeta débito/crédito en punto físico, transferencia o efectivo.
            </span>
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleScheduleWhatsapp}
            className="w-full py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-green-500/20"
          >
            <MessageCircle className="w-4 h-4 fill-current" aria-hidden="true" />
            Agendar valoración por WhatsApp
          </button>

          <Link
            href={`/product/${calculation.target.slug}`}
            className="w-full py-3 px-6 rounded-full border border-white/20 hover:bg-white/10 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition"
          >
            Ver ficha de {calculation.target.name} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </aside>
    </div>
  );
}
