'use client';

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  defaultMessage?: string;
  agentName?: string;
}

export default function FloatingWhatsApp({
  phoneNumber = '573001234567',
  defaultMessage = 'Hola iZone Tech, estoy visitando su tienda web y deseo asesoría para comprar un equipo Apple.',
  agentName = 'Asesor iZone Tech Bogotá',
}: FloatingWhatsAppProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const handleSendMessage = () => {
    const text = encodeURIComponent(customMsg.trim() || defaultMessage);
    const url = `https://wa.me/${phoneNumber}?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Modal / Popup de Asesoría Rápida */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden animate-scale-in">
          {/* Header del chat estilo WhatsApp */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-white shadow-inner">
                  iZ
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#075E54]"></span>
              </div>
              <div>
                <h4 className="font-semibold text-sm leading-tight">{agentName}</h4>
                <p className="text-[11px] text-emerald-200">En línea • Respuesta en &lt; 5 min</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar chat de WhatsApp"
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-black/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cuerpo del Mensaje */}
          <div className="p-4 bg-[#ECE5DD]/40 text-neutral-800 text-xs space-y-3">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-neutral-100 max-w-[85%]">
              <p className="font-semibold text-neutral-900 mb-1">¡Hola! Te damos la bienvenida a iZone Tech 👋</p>
              <p className="text-neutral-600 leading-relaxed">
                ¿Buscas algún iPhone, MacBook o accesorio en particular? Escríbenos para confirmar disponibilidad inmediata en Bogotá o coordinar tu envío nacional.
              </p>
              <span className="block text-[10px] text-neutral-400 text-right mt-1.5">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Input para redactar consulta */}
          <div className="p-3 bg-white border-t border-neutral-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Escribe tu mensaje..."
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 text-xs bg-[#F5F5F7] border border-neutral-200 rounded-full px-4 py-2.5 outline-none focus:border-[#25D366] transition"
            />
            <button
              onClick={handleSendMessage}
              aria-label="Enviar mensaje por WhatsApp"
              className="w-9 h-9 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center shrink-0 shadow-md transition"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      )}

      {/* Botón Flotante Principal con Efecto Pulso */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Contactar por WhatsApp a iZone Tech"
        className="relative group bg-[#25D366] hover:bg-[#1EBE5D] text-white p-3.5 sm:p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-green-400/40"
      >
        {/* Anillo de pulso sutil */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none group-hover:opacity-0" />

        <MessageCircle className="w-7 h-7 fill-current" />

        {/* Tooltip en desktop */}
        <span className="hidden sm:block absolute right-full mr-3 bg-[#1D1D1F] text-white text-xs font-medium px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
          ¿Necesitas ayuda? Escríbenos
        </span>
      </button>
    </div>
  );
}
