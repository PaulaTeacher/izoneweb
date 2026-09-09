'use client';

import React, { useState } from 'react';
import { formatCOP } from '@izone/shared-types';
import { CreditCard, ChevronDown, ChevronUp } from 'lucide-react';

interface FinancingCalculatorProps {
  price: number;
}

const BANKS = [
  { id: 'bogota', name: 'Banco de Bogotá', maxCuotas: 24 },
  { id: 'bancolombia', name: 'Bancolombia', maxCuotas: 24 },
  { id: 'davivienda', name: 'Davivienda (Plan 0 es 3)', maxCuotas: 24 },
  { id: 'addi', name: 'Addi (Crédito fácil)', maxCuotas: 24 },
];

const CUOTAS_OPTIONS = [6, 12, 18, 24];

export function FinancingCalculator({ price }: FinancingCalculatorProps) {
  const [selectedCuotas, setSelectedCuotas] = useState<number>(24);
  const [selectedBank, setSelectedBank] = useState<string>('bogota');
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const monthlyPayment = Math.round(price / selectedCuotas);
  const currentBankObj = BANKS.find((b) => b.id === selectedBank) || BANKS[0];

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-[#FAFAFA] dark:bg-neutral-900/50 my-4 transition-all">
      {/* Header colapsable */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 transition-colors"
      >
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#0071E3]" />
          <span className="text-[13px] font-bold text-neutral-900 dark:text-neutral-100">
            Llévalo hoy con 0% de interés
          </span>
          <span className="text-[10px] font-semibold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded">
            Sin interés
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-neutral-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-neutral-500" />
        )}
      </button>

      {/* Contenido de la Calculadora */}
      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-neutral-200/60 dark:border-neutral-800">
          <div className="flex flex-wrap items-baseline gap-2 mb-3">
            <span className="text-xl md:text-2xl font-black text-[#0071E3] tracking-tight">
              {formatCOP(monthlyPayment)}
            </span>
            <span className="text-xs text-neutral-600 dark:text-neutral-400">al mes por</span>

            {/* Selector de número de cuotas */}
            <div className="inline-flex rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-0.5">
              {CUOTAS_OPTIONS.map((cuota) => (
                <button
                  key={cuota}
                  type="button"
                  onClick={() => setSelectedCuotas(cuota)}
                  className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-all ${
                    selectedCuotas === cuota
                      ? 'bg-[#0071E3] text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {cuota} cuotas
                </button>
              ))}
            </div>

            <span className="text-xs text-neutral-500">con</span>
            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              {currentBankObj.name}
            </span>
          </div>

          {/* Selector de Banco */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-dashed border-neutral-200 dark:border-neutral-800">
            <span className="text-[11px] text-neutral-500 mr-1">Bancos aliados:</span>
            {BANKS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedBank(b.id)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                  selectedBank === b.id
                    ? 'border-[#0071E3] bg-blue-50 text-[#0071E3] dark:bg-blue-950/40 dark:text-blue-300 font-semibold'
                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>

          {/* Banner de Addi (Exacto a iShop) */}
          <div className="mt-3 p-2.5 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl flex items-center gap-2.5 border border-blue-100 dark:border-blue-900/40">
            <div className="w-6 h-6 rounded-md bg-[#0065FF] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              A
            </div>
            <p className="text-[11px] text-neutral-700 dark:text-neutral-300 leading-tight">
              Paga esta compra con <strong>Addi</strong> desde 6 hasta 24 cuotas sin papeleos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
