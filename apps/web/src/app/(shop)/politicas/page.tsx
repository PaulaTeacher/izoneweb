import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  HelpCircle,
  FileText,
  RefreshCw,
  Lock,
  Scale,
} from 'lucide-react';
import { pageMetadata } from '@/lib/site';
import { buildWaMeUrl } from '@/lib/whatsapp';

export const metadata: Metadata = pageMetadata({
  title: 'Políticas de Garantía, Envíos, Privacidad y Términos Legales | iZone Tech',
  description:
    'Consulta las políticas de garantía oficial Apple (1 año), tiempos de envío en Bogotá y Colombia, medios de pago, derecho de retracto y tratamiento de datos personales (Ley 1581) de iZone Tech Colombia S.A.S.',
  path: '/politicas',
});

const QUICK_LINKS = [
  { href: '#garantia', label: 'Garantía (1 Año)' },
  { href: '#envios', label: 'Envíos y Rastreo' },
  { href: '#medios-pago', label: 'Medios de Pago' },
  { href: '#faq', label: 'Preguntas Frecuentes' },
  { href: '#terminos', label: 'Términos y Condiciones' },
  { href: '#devoluciones', label: 'Cambios y Retracto' },
  { href: '#privacidad', label: 'Privacidad y Datos (Ley 1581)' },
  { href: '#superintendencia', label: 'SIC Colombia' },
] as const;

export default function PoliticasPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-black py-12 md:py-16 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <header className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0071E3] mb-2">
            Centro de Información Legal y Soporte
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#1D1D1F] dark:text-white mb-4">
            Políticas, Garantía y Términos de iZone Tech
          </h1>
          <p className="text-base text-neutral-600 dark:text-neutral-400">
            Información oficial para compras en tienda física (CC Unilago, Local L 1-143, Bogotá D.C.) y en línea para toda Colombia.
          </p>

          <nav
            aria-label="Navegación rápida de políticas"
            className="mt-6 flex flex-wrap gap-2"
          >
            {QUICK_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-[#0071E3] hover:text-[#0071E3] transition"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </header>

        <div className="space-y-8">
          {/* Garantía */}
          <section
            id="garantia"
            className="scroll-mt-28 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#0071E3] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1D1D1F] dark:text-white">
                Políticas de Garantía Oficial (1 Año)
              </h2>
            </div>
            <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              <p>
                Todos los equipos Apple nuevos sellados comercializados por <strong>iZone Tech Colombia S.A.S.</strong> cuentan con <strong>12 meses (1 año) de garantía directa</strong> por defectos de fabricación, verificable con el número de serie oficial de Apple y respaldada conforme a la Ley 1480 de 2011 (Estatuto del Consumidor).
              </p>
              <p>
                Los equipos en condición <strong>Seminuevo Certificado</strong> o <strong>Open Box</strong> incluyen garantía técnica escrita cuya vigencia se especifica en la ficha del producto y en la factura de venta. Los accesorios originales cuentan con garantía por defectos de fábrica desde la fecha de entrega.
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                La garantía no cubre daños ocasionados por humedad/líquidos, golpes, caídas, alteraciones de software no autorizadas, intervención de terceros o desgaste natural de consumibles (puntas, cables doblados o degradación normal de batería por ciclos).
              </p>
            </div>
          </section>

          {/* Envíos */}
          <section
            id="envios"
            className="scroll-mt-28 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1D1D1F] dark:text-white">
                Rastreo, Cobertura y Tiempos de Envío
              </h2>
            </div>
            <ul className="space-y-2.5 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed list-disc pl-5">
              <li>
                <strong>Bogotá D.C. (mismo día o siguiente día hábil):</strong> Entregas con mensajería asegurada propia. Puedes elegir pago contraentrega o recogida presencial sin costo en nuestro punto físico: <strong>CC Unilago, Local L 1-143</strong>.
              </li>
              <li>
                <strong>Envíos nacionales asegurados (1 a 3 días hábiles):</strong> Despachos a ciudades principales e intermedias en Colombia mediante transportadoras certificadas con seguro por el 100% del valor declarado.
              </li>
              <li>
                <strong>Rastreo:</strong> Una vez confirmado el despacho, enviamos el número de guía y enlace de seguimiento directamente a tu WhatsApp registrado.
              </li>
            </ul>
          </section>

          {/* Medios de pago */}
          <section
            id="medios-pago"
            className="scroll-mt-28 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1D1D1F] dark:text-white">
                Medios de Pago Seguros
              </h2>
            </div>
            <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              <p>
                Al finalizar tu bolsa por WhatsApp, un asesor de iZone Tech valida disponibilidad inmediata y te habilita el medio de pago de tu preferencia:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>PSE y transferencia bancaria:</strong> Bancolombia, Nequi, Daviplata y cuentas empresariales verificadas a nombre de iZone Tech Colombia S.A.S.</li>
                <li><strong>Tarjetas débito y crédito:</strong> Visa, Mastercard y datáfono presencial en nuestro local de CC Unilago.</li>
                <li><strong>Pago contraentrega en Bogotá:</strong> Disponible previa confirmación de cobertura y datos de entrega por WhatsApp.</li>
              </ul>
            </div>
          </section>

          {/* FAQ */}
          <section
            id="faq"
            className="scroll-mt-28 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1D1D1F] dark:text-white">
                Preguntas Frecuentes (FAQ)
              </h2>
            </div>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="font-bold text-[#1D1D1F] dark:text-white">
                  ¿Los equipos Apple son 100% originales y con serial verificable?
                </dt>
                <dd className="text-neutral-600 dark:text-neutral-300 mt-1">
                  Sí. Todos nuestros dispositivos son originales y puedes verificar su número de serie directamente en el portal oficial de cobertura de Apple antes o al momento de la entrega.
                </dd>
              </div>
              <div>
                <dt className="font-bold text-[#1D1D1F] dark:text-white">
                  ¿Cómo funciona la reserva de 30 minutos al pedir por WhatsApp?
                </dt>
                <dd className="text-neutral-600 dark:text-neutral-300 mt-1">
                  Cuando completas tu pedido desde la bolsa, el sistema aparta automáticamente las unidades seleccionadas durante 30 minutos para que puedas confirmar pago o recogida con un asesor sin perder disponibilidad.
                </dd>
              </div>
              <div>
                <dt className="font-bold text-[#1D1D1F] dark:text-white">
                  ¿Cómo funciona el Plan Retoma?
                </dt>
                <dd className="text-neutral-600 dark:text-neutral-300 mt-1">
                  Puedes calcular una valoración preliminar en nuestra{' '}
                  <Link href="/trade-in" className="text-[#0071E3] font-semibold hover:underline">
                    calculadora de Plan Retoma
                  </Link>{' '}
                  y agendar revisión técnica presencial en CC Unilago, Local L 1-143, para descontar el valor de tu equipo actual del nuevo.
                </dd>
              </div>
              <div>
                <dt className="font-bold text-[#1D1D1F] dark:text-white">
                  ¿Entregan factura electrónica?
                </dt>
                <dd className="text-neutral-600 dark:text-neutral-300 mt-1">
                  Sí, todas las compras incluyen factura electrónica válida ante la DIAN con los datos fiscales que nos suministres al confirmar tu pedido.
                </dd>
              </div>
            </dl>
          </section>

          {/* Términos y Condiciones */}
          <section
            id="terminos"
            className="scroll-mt-28 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1D1D1F] dark:text-white">
                Términos y Condiciones
              </h2>
            </div>
            <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              <p>
                Este sitio web es operado por <strong>iZone Tech Colombia S.A.S.</strong> (CC Unilago, Local L 1-143, Bogotá D.C., Colombia; correo{' '}
                <a href="mailto:izonetech.co@gmail.com" className="text-[#0071E3] hover:underline">
                  izonetech.co@gmail.com
                </a>
                ). Todos los precios se muestran en pesos colombianos (COP) y están sujetos a disponibilidad de inventario y verificación al momento de confirmar el pedido vía WhatsApp o en tienda física.
              </p>
              <p>
                Las reservas generadas a través del carrito tienen una vigencia máxima de <strong>30 minutos</strong>; si el pedido no se confirma dentro de ese plazo, el inventario vuelve a quedar disponible para otros clientes.
              </p>
            </div>
          </section>

          {/* Cambios y Devoluciones */}
          <section
            id="devoluciones"
            className="scroll-mt-28 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#0071E3] flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1D1D1F] dark:text-white">
                Cambios, Devoluciones y Derecho de Retracto
              </h2>
            </div>
            <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              <p>
                De acuerdo con el artículo 47 de la Ley 1480 de 2011, para compras realizadas mediante canales no presenciales puedes ejercer el <strong>derecho de retracto dentro de los cinco (5) días hábiles</strong> siguientes a la entrega del producto, siempre que el equipo y sus accesorios se devuelvan en las mismas condiciones en que fueron recibidos (empaque original, sellos de seguridad sin abrir, sin activación de cuenta iCloud/Apple ID y sin señales de uso).
              </p>
              <p>
                Para solicitar un cambio o devolución, contáctanos por{' '}
                <a
                  href={buildWaMeUrl('Hola iZone Tech, necesito información sobre un cambio o devolución.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0071E3] font-semibold hover:underline"
                >
                  WhatsApp oficial
                </a>{' '}
                o al correo{' '}
                <a href="mailto:izonetech.co@gmail.com" className="text-[#0071E3] hover:underline">
                  izonetech.co@gmail.com
                </a>{' '}
                indicando tu número de factura o referencia de pedido.
              </p>
            </div>
          </section>

          {/* Privacidad y Tratamiento de Datos */}
          <section
            id="privacidad"
            className="scroll-mt-28 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 md:p-8"
          >
            <div id="tratamiento-datos" className="scroll-mt-28 flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1D1D1F] dark:text-white">
                Política de Privacidad y Tratamiento de Datos Personales (Ley 1581 de 2012)
              </h2>
            </div>
            <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              <p>
                En cumplimiento de la Ley Estatutaria 1581 de 2012 y el Decreto 1377 de 2013, <strong>iZone Tech Colombia S.A.S.</strong> actúa como responsable del tratamiento de los datos personales suministrados voluntariamente al realizar un pedido, solicitar una cotización de Plan Retoma o enviar una reseña.
              </p>
              <p>
                <strong>Finalidad:</strong> Gestionar reservas, facturación electrónica, despachos asegurados, atención de garantías, soporte posventa y envío de comunicaciones comerciales únicamente cuando el usuario lo autorice expresamente.
              </p>
              <p>
                <strong>Derechos del titular (Habeas Data):</strong> Puedes conocer, actualizar, rectificar o solicitar la supresión de tus datos y revocar la autorización escribiendo a{' '}
                <a href="mailto:izonetech.co@gmail.com" className="text-[#0071E3] hover:underline">
                  izonetech.co@gmail.com
                </a>
                .
              </p>
            </div>
          </section>

          {/* SIC */}
          <section
            id="superintendencia"
            className="scroll-mt-28 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1D1D1F] dark:text-white">
                Superintendencia de Industria y Comercio (SIC)
              </h2>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              iZone Tech Colombia S.A.S. cumple con las disposiciones vigentes de protección al consumidor en la República de Colombia. Para información adicional sobre tus derechos como consumidor, puedes consultar el portal oficial de la{' '}
              <a
                href="https://www.sic.gov.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0071E3] font-semibold hover:underline"
              >
                Superintendencia de Industria y Comercio (www.sic.gov.co)
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
