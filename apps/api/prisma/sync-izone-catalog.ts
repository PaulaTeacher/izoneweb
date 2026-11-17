/// <reference types="node" />
import {
  DeviceKind,
  PrismaClient,
  ProductCondition,
  ProductKind,
} from '@prisma/client';

const prisma = new PrismaClient();

interface VariantSeed {
  sku: string;
  colorName?: string;
  colorHex?: string;
  storage?: string;
  condition?: ProductCondition;
  price: number;
  featuredImage?: string;
  stock?: number;
}

interface ProductSeed {
  slug: string;
  name: string;
  subtitle?: string;
  heroBadge?: string;
  description: string;
  categorySlug: string;
  productKind: ProductKind;
  isFeatured: boolean;
  deviceModelSlug?: string;
  images: string[];
  compatibleDeviceSlugs?: string[];
  variants: VariantSeed[];
}

const IMG = {
  iphoneDuoWhite: '/images/products/iphone-duo-star-white.webp',
  iphoneDuoNight: '/images/products/iphone-duo-night-sky.webp',
  iphone18Max: '/images/products/iphone-18-pro-max-burgundy.webp',
  iphone18Pro: '/images/products/iphone-18-pro-burgundy.webp',
  iphone17MaxSilver: '/images/products/iphone-17-pro-max-silver.webp',
  iphone17MaxBlue: '/images/products/iphone-17-pro-max-deep-blue.webp',
  iphone17ProSilver: '/images/products/iphone-17-pro-silver.webp',
  iphone17ProBlue: '/images/products/iphone-17-pro-deep-blue.webp',
  macbookM5Sky: '/images/products/macbook-air-m5-sky-blue.webp',
  macbookM5Silver: '/images/products/macbook-air-m5-silver.webp',
  macbookM5Starlight: '/images/products/macbook-air-m5-starlight.webp',
  macbookM5Midnight: '/images/products/macbook-air-m5-midnight.webp',
  macbookNeo: '/images/products/macbook-neo-blush.webp',
  ipadPink: '/images/products/ipad-11-pink.webp',
  ipadSilver: '/images/products/ipad-11-silver.webp',
  ipadBlue: '/images/products/ipad-11-blue.webp',
  watch11: '/images/products/watch-series-11-rose-gold.webp',
  watchSe3: '/images/products/watch-se-3-starlight.webp',
  airpodsPro3: '/images/products/airpods-pro-3.webp',
  airpods5: '/images/products/airpods-5.webp',
  airpods4Anc: '/images/products/airpods-4-anc.webp',
  airpods4: '/images/products/airpods-4.webp',
  adapter20w: '/images/products/cargador-20w-usb-c.webp',
  adapter40w: '/images/products/cargador-40w-dynamic.webp',
  cableUsbc: '/images/products/cable-usb-c-1m.webp',
  cableLightning: '/images/products/cable-usb-c-lightning-1m.webp',
  pencilPro: '/images/products/apple-pencil-pro.webp',
  pencilUsbc: '/images/products/apple-pencil-usb-c.webp',
  kbPro11: '/images/products/magic-keyboard-ipad-pro-11.webp',
  kbAir11: '/images/products/magic-keyboard-ipad-air-11.webp',
};

const CATALOG: ProductSeed[] = [
  // ======================== iPHONE ========================
  {
    slug: 'iphone-duo',
    name: 'iPhone Duo',
    subtitle:
      'El primer iPhone plegable: pantalla interna de 7.6", externa de 5.4" ProMotion 120Hz, chip A20 Pro y marco de titanio.',
    heroBadge: 'Nuevo',
    description:
      'iPhone Duo plegable tipo libro con pantalla Super Retina XDR OLED de 7.6" antirreflejos, chip A20 Pro (2 nm), 12 GB de RAM, sistema Dual Fusion de 48 MP + 48 MP, Touch ID lateral, IP68 y conectividad eSIM.',
    categorySlug: 'iphone',
    productKind: ProductKind.equipment,
    isFeatured: true,
    deviceModelSlug: 'iphone-duo',
    images: [IMG.iphoneDuoWhite, IMG.iphoneDuoNight],
    variants: [
      {
        sku: 'MK1E4LL/A',
        colorName: 'Star White',
        colorHex: '#F4F4F2',
        storage: '256GB · eSIM',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 9650000,
        featuredImage: IMG.iphoneDuoWhite,
        stock: 5,
      },
      {
        sku: 'MK1F4LL/A',
        colorName: 'Night Sky',
        colorHex: '#1A2233',
        storage: '256GB · eSIM',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 9750000,
        featuredImage: IMG.iphoneDuoNight,
        stock: 5,
      },
      {
        sku: 'MK1H4LL/A',
        colorName: 'Night Sky',
        colorHex: '#1A2233',
        storage: '512GB · eSIM',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 10720000,
        featuredImage: IMG.iphoneDuoNight,
        stock: 4,
      },
    ],
  },
  {
    slug: 'iphone-18-pro-max',
    name: 'iPhone 18 Pro Max',
    subtitle: 'Chip Pro de última generación, cámara teleobjetivo avanzada y batería para todo el día.',
    heroBadge: 'Nuevo',
    description:
      'iPhone 18 Pro Max de 256GB (eSIM) en acabado Burgundy. Equipo nuevo sellado con garantía oficial Apple de 1 año.',
    categorySlug: 'iphone',
    productKind: ProductKind.equipment,
    isFeatured: true,
    deviceModelSlug: 'iphone-18-pro-max',
    images: [IMG.iphone18Max],
    variants: [
      {
        sku: 'MJW64LL/A',
        colorName: 'Burgundy',
        colorHex: '#5C1F2B',
        storage: '256GB · eSIM',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 6100000,
        featuredImage: IMG.iphone18Max,
        stock: 8,
      },
    ],
  },
  {
    slug: 'iphone-18-pro',
    name: 'iPhone 18 Pro',
    subtitle: 'Potencia Pro en formato compacto, acabado Burgundy y conectividad eSIM.',
    heroBadge: 'Nuevo',
    description:
      'iPhone 18 Pro de 256GB (eSIM) en acabado Burgundy. Nuevo sellado con garantía oficial Apple de 1 año.',
    categorySlug: 'iphone',
    productKind: ProductKind.equipment,
    isFeatured: true,
    deviceModelSlug: 'iphone-18-pro',
    images: [IMG.iphone18Pro],
    variants: [
      {
        sku: 'MJQ54LL/A',
        colorName: 'Burgundy',
        colorHex: '#5C1F2B',
        storage: '256GB · eSIM',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 4800000,
        featuredImage: IMG.iphone18Pro,
        stock: 10,
      },
    ],
  },
  {
    slug: 'iphone-17-pro-max',
    name: 'iPhone 17 Pro Max',
    subtitle: 'Pantalla ProMotion, sistema de cámaras Pro y gran autonomía.',
    description:
      'iPhone 17 Pro Max de 256GB nuevo sellado. Disponible en Silver y Deep Blue con garantía oficial.',
    categorySlug: 'iphone',
    productKind: ProductKind.equipment,
    isFeatured: true,
    deviceModelSlug: 'iphone-17-pro-max',
    images: [IMG.iphone17MaxSilver, IMG.iphone17MaxBlue],
    variants: [
      {
        sku: 'MFXG4LL/A',
        colorName: 'Silver',
        colorHex: '#E3E4E6',
        storage: '256GB',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 4100000,
        featuredImage: IMG.iphone17MaxSilver,
        stock: 12,
      },
      {
        sku: 'MFXJ4LL/A',
        colorName: 'Deep Blue',
        colorHex: '#1E2D45',
        storage: '256GB',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 4250000,
        featuredImage: IMG.iphone17MaxBlue,
        stock: 9,
      },
    ],
  },
  {
    slug: 'iphone-17-pro',
    name: 'iPhone 17 Pro',
    subtitle: 'Diseño Pro en aluminio/titanio con cámara triple de alta precisión.',
    description:
      'iPhone 17 Pro de 256GB nuevo sellado. Disponible en Silver y Deep Blue con garantía oficial Apple.',
    categorySlug: 'iphone',
    productKind: ProductKind.equipment,
    isFeatured: false,
    deviceModelSlug: 'iphone-17-pro',
    images: [IMG.iphone17ProSilver, IMG.iphone17ProBlue],
    variants: [
      {
        sku: 'MG7K4LL/A',
        colorName: 'Silver',
        colorHex: '#E3E4E6',
        storage: '256GB',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 4400000,
        featuredImage: IMG.iphone17ProSilver,
        stock: 10,
      },
      {
        sku: 'MG7M4LL/A',
        colorName: 'Deep Blue',
        colorHex: '#1E2D45',
        storage: '256GB',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 4100000,
        featuredImage: IMG.iphone17ProBlue,
        stock: 8,
      },
    ],
  },

  // ======================== MACBOOK ========================
  {
    slug: 'macbook-air-13-m5',
    name: 'MacBook Air 13" (M5)',
    subtitle: 'Chip Apple M5, 16GB de memoria unificada y 512GB SSD ultrarrápido.',
    heroBadge: 'M5',
    description:
      'MacBook Air de 13 pulgadas con chip M5, 16GB RAM y 512GB SSD. Nuevo sellado en 4 acabados.',
    categorySlug: 'macbook-air',
    productKind: ProductKind.equipment,
    isFeatured: true,
    deviceModelSlug: 'macbook-air-13-m5',
    images: [IMG.macbookM5Sky, IMG.macbookM5Silver, IMG.macbookM5Starlight, IMG.macbookM5Midnight],
    variants: [
      {
        sku: 'MDHH4LL/A',
        colorName: 'Sky Blue',
        colorHex: '#A7C6DA',
        storage: '16GB / 512GB',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 4400000,
        featuredImage: IMG.macbookM5Sky,
        stock: 7,
      },
      {
        sku: 'MDH74LL/A',
        colorName: 'Silver',
        colorHex: '#E3E4E6',
        storage: '16GB / 512GB',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 4400000,
        featuredImage: IMG.macbookM5Silver,
        stock: 6,
      },
      {
        sku: 'MDHA4LL/A',
        colorName: 'Starlight',
        colorHex: '#F0E6D2',
        storage: '16GB / 512GB',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 4400000,
        featuredImage: IMG.macbookM5Starlight,
        stock: 6,
      },
      {
        sku: 'MDHE4LL/A',
        colorName: 'Midnight',
        colorHex: '#252B36',
        storage: '16GB / 512GB',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 4400000,
        featuredImage: IMG.macbookM5Midnight,
        stock: 6,
      },
    ],
  },
  {
    slug: 'macbook-neo-13-a18-pro',
    name: 'MacBook Neo 13" (A18 Pro)',
    subtitle: 'Ligereza extrema con chip A18 Pro y 8GB de memoria unificada.',
    heroBadge: 'Nuevo',
    description:
      'MacBook Neo 13" con chip A18 Pro en color Blush. Disponible en 256GB y 512GB SSD.',
    categorySlug: 'macbook-air',
    productKind: ProductKind.equipment,
    isFeatured: true,
    deviceModelSlug: 'macbook-air-13-m5',
    images: [IMG.macbookNeo],
    variants: [
      {
        sku: 'MBN13-A18P-256-BLUSH',
        colorName: 'Blush',
        colorHex: '#E8C5C0',
        storage: '8GB / 256GB',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 2550000,
        featuredImage: IMG.macbookNeo,
        stock: 10,
      },
      {
        sku: 'MBN13-A18P-512-BLUSH',
        colorName: 'Blush',
        colorHex: '#E8C5C0',
        storage: '8GB / 512GB',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 3050000,
        featuredImage: IMG.macbookNeo,
        stock: 10,
      },
    ],
  },

  // ======================== IPAD ========================
  {
    slug: 'ipad-11-a16',
    name: 'iPad 11 (A16) Wi-Fi',
    subtitle: 'Chip A16 Bionic, pantalla Liquid Retina y 128GB de almacenamiento.',
    description:
      'iPad 11.ª generación con chip A16, 128GB Wi-Fi. Nuevo sellado disponible en Pink, Silver y Blue.',
    categorySlug: 'ipad-11',
    productKind: ProductKind.equipment,
    isFeatured: true,
    deviceModelSlug: 'ipad-11',
    images: [IMG.ipadPink, IMG.ipadSilver, IMG.ipadBlue],
    variants: [
      {
        sku: 'MD4E4LL/A',
        colorName: 'Pink',
        colorHex: '#E89EB0',
        storage: '128GB · Wi-Fi',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 1400000,
        featuredImage: IMG.ipadPink,
        stock: 15,
      },
      {
        sku: 'MD3Y4LL/A',
        colorName: 'Silver',
        colorHex: '#E3E4E6',
        storage: '128GB · Wi-Fi',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 1400000,
        featuredImage: IMG.ipadSilver,
        stock: 14,
      },
      {
        sku: 'MD4A4LL/A',
        colorName: 'Blue',
        colorHex: '#5B88B2',
        storage: '128GB · Wi-Fi',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 1500000,
        featuredImage: IMG.ipadBlue,
        stock: 12,
      },
    ],
  },

  // ======================== APPLE WATCH ========================
  {
    slug: 'apple-watch-series-11',
    name: 'Apple Watch Series 11 GPS',
    subtitle: 'Sensores avanzados de salud y caja Rose Gold en 42mm o 46mm.',
    description:
      'Apple Watch Series 11 GPS en acabado Rose Gold. Nuevo sellado con garantía oficial Apple.',
    categorySlug: 'apple-watch',
    productKind: ProductKind.equipment,
    isFeatured: true,
    images: [IMG.watch11],
    variants: [
      {
        sku: 'MEU04LW/A',
        colorName: 'Rose Gold',
        colorHex: '#E6C2B5',
        storage: '42mm · GPS',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 1500000,
        featuredImage: IMG.watch11,
        stock: 10,
      },
      {
        sku: 'MEV74LW/A',
        colorName: 'Rose Gold',
        colorHex: '#E6C2B5',
        storage: '46mm · GPS',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 1500000,
        featuredImage: IMG.watch11,
        stock: 8,
      },
    ],
  },
  {
    slug: 'apple-watch-se-3',
    name: 'Apple Watch SE 3 40mm',
    subtitle: 'Todo lo esencial para tu actividad diaria y notificaciones.',
    description:
      'Apple Watch SE 3 de 40mm en color Starlight. Nuevo sellado con garantía oficial.',
    categorySlug: 'apple-watch',
    productKind: ProductKind.equipment,
    isFeatured: false,
    images: [IMG.watchSe3],
    variants: [
      {
        sku: 'AWSE3-40-STARLIGHT',
        colorName: 'Starlight',
        colorHex: '#F0E6D2',
        storage: '40mm · GPS',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 1100000,
        featuredImage: IMG.watchSe3,
        stock: 9,
      },
    ],
  },

  // ======================== AUDIO (AIRPODS) ========================
  {
    slug: 'airpods-pro-3',
    name: 'AirPods Pro 3',
    subtitle: 'Cancelación activa de ruido de nivel profesional y audio espacial.',
    description: 'AirPods Pro 3 originales nuevos sellados con estuche de carga.',
    categorySlug: 'audio',
    productKind: ProductKind.equipment,
    isFeatured: true,
    images: [IMG.airpodsPro3],
    variants: [
      {
        sku: 'MFHP4LL/A',
        colorName: 'Blanco',
        colorHex: '#FFFFFF',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 1000000,
        featuredImage: IMG.airpodsPro3,
        stock: 15,
      },
    ],
  },
  {
    slug: 'airpods-5-sin-magsafe',
    name: 'AirPods 5 (Sin MagSafe)',
    subtitle: 'Sonido nítido y ajuste cómodo para todo el día.',
    description: 'AirPods 5 sin estuche MagSafe, nuevos sellados con garantía oficial.',
    categorySlug: 'audio',
    productKind: ProductKind.equipment,
    isFeatured: false,
    images: [IMG.airpods5],
    variants: [
      {
        sku: 'AP5-NOMAG',
        colorName: 'Blanco',
        colorHex: '#FFFFFF',
        storage: 'Sin MagSafe',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 520000,
        featuredImage: IMG.airpods5,
        stock: 10,
      },
    ],
  },
  {
    slug: 'airpods-4-anc',
    name: 'AirPods 4 ANC',
    subtitle: 'Diseño abierto con Cancelación Activa de Ruido.',
    description: 'AirPods 4 con cancelación activa de ruido (ANC), nuevos sellados.',
    categorySlug: 'audio',
    productKind: ProductKind.equipment,
    isFeatured: false,
    images: [IMG.airpods4Anc],
    variants: [
      {
        sku: 'MXP93LL/A',
        colorName: 'Blanco',
        colorHex: '#FFFFFF',
        storage: 'ANC',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 650000,
        featuredImage: IMG.airpods4Anc,
        stock: 12,
      },
    ],
  },
  {
    slug: 'airpods-4',
    name: 'AirPods 4',
    subtitle: 'Audio espacial personalizado y conectividad instantánea Apple.',
    description: 'AirPods 4 originales nuevos sellados con estuche USB-C.',
    categorySlug: 'audio',
    productKind: ProductKind.equipment,
    isFeatured: false,
    images: [IMG.airpods4],
    variants: [
      {
        sku: 'MXP63LL/A',
        colorName: 'Blanco',
        colorHex: '#FFFFFF',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 420000,
        featuredImage: IMG.airpods4,
        stock: 14,
      },
    ],
  },

  // ======================== ACCESORIOS, CARGADORES Y CABLES ========================
  {
    slug: '20w-usb-c-power-adapter',
    name: '20W USB-C Power Adapter',
    subtitle: 'Carga rápida oficial Apple para iPhone y iPad.',
    description: 'Adaptador de corriente USB-C de 20W original Apple, nuevo sellado.',
    categorySlug: 'energia',
    productKind: ProductKind.accessory,
    isFeatured: false,
    images: [IMG.adapter20w],
    compatibleDeviceSlugs: [
      'iphone-duo',
      'iphone-18-pro-max',
      'iphone-18-pro',
      'iphone-17-pro-max',
      'iphone-17-pro',
      'ipad-11',
    ],
    variants: [
      {
        sku: 'MWVV3AM/A',
        colorName: 'Blanco',
        colorHex: '#FFFFFF',
        storage: '20W',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 100000,
        featuredImage: IMG.adapter20w,
        stock: 40,
      },
    ],
  },
  {
    slug: '40w-dynamic-power-adapter-60w-max',
    name: '40W Dynamic Power Adapter (60W Max)',
    subtitle: 'Adaptador dinámico de alta potencia para iPhone, iPad y MacBook Air.',
    description: 'Cargador dinámico Apple 40W con picos de hasta 60W Max, nuevo sellado.',
    categorySlug: 'energia',
    productKind: ProductKind.accessory,
    isFeatured: false,
    images: [IMG.adapter40w],
    compatibleDeviceSlugs: [
      'iphone-duo',
      'iphone-18-pro-max',
      'iphone-18-pro',
      'iphone-17-pro-max',
      'iphone-17-pro',
      'macbook-air-13-m5',
    ],
    variants: [
      {
        sku: 'MGKN4AM/A',
        colorName: 'Blanco',
        colorHex: '#FFFFFF',
        storage: '40W / 60W Max',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 200000,
        featuredImage: IMG.adapter40w,
        stock: 20,
      },
    ],
  },
  {
    slug: 'usb-c-cable-1m-open-box',
    name: 'USB-C Cable 1m',
    subtitle: 'Cable trenzado USB-C a USB-C de 1 metro para carga y sincronización.',
    description: 'Cable original Apple USB-C de 1 metro en estado Open Box verificado.',
    categorySlug: 'cables-hubs',
    productKind: ProductKind.accessory,
    isFeatured: false,
    images: [IMG.cableUsbc],
    compatibleDeviceSlugs: [
      'iphone-duo',
      'iphone-18-pro-max',
      'iphone-18-pro',
      'iphone-17-pro-max',
      'iphone-17-pro',
      'ipad-11',
      'macbook-air-13-m5',
    ],
    variants: [
      {
        sku: 'CUTU1M',
        colorName: 'Blanco',
        colorHex: '#FFFFFF',
        storage: '1m · Open Box',
        condition: ProductCondition.OPEN_BOX,
        price: 80000,
        featuredImage: IMG.cableUsbc,
        stock: 25,
      },
    ],
  },
  {
    slug: 'usb-c-to-lightning-cable-1m-open-box',
    name: 'USB-C to Lightning Cable 1m',
    subtitle: 'Cable USB-C a Lightning de 1 metro para carga rápida.',
    description: 'Cable original Apple USB-C a Lightning de 1 metro en estado Open Box.',
    categorySlug: 'cables-hubs',
    productKind: ProductKind.accessory,
    isFeatured: false,
    images: [IMG.cableLightning],
    compatibleDeviceSlugs: ['iphone-17-pro', 'iphone-17-pro-max'],
    variants: [
      {
        sku: 'CUTL1MOB',
        colorName: 'Blanco',
        colorHex: '#FFFFFF',
        storage: '1m · Open Box',
        condition: ProductCondition.OPEN_BOX,
        price: 75000,
        featuredImage: IMG.cableLightning,
        stock: 18,
      },
    ],
  },
  {
    slug: 'apple-pencil-pro',
    name: 'Apple Pencil Pro',
    subtitle: 'Precisión milimétrica, respuesta háptica y gestos avanzados.',
    description: 'Apple Pencil Pro original nuevo sellado compatible con iPad Pro e iPad Air.',
    categorySlug: 'accesorios',
    productKind: ProductKind.accessory,
    isFeatured: false,
    images: [IMG.pencilPro],
    compatibleDeviceSlugs: ['ipad-pro-11', 'ipad-air-11'],
    variants: [
      {
        sku: 'MX2D3AM/A',
        colorName: 'Blanco',
        colorHex: '#FFFFFF',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 520000,
        featuredImage: IMG.pencilPro,
        stock: 16,
      },
    ],
  },
  {
    slug: 'apple-pencil-usb-c',
    name: 'Apple Pencil (USB-C)',
    subtitle: 'Ideal para tomar notas, dibujar y marcar documentos en iPad.',
    description: 'Apple Pencil con carga y enlace por USB-C, original nuevo sellado.',
    categorySlug: 'accesorios',
    productKind: ProductKind.accessory,
    isFeatured: false,
    images: [IMG.pencilUsbc],
    compatibleDeviceSlugs: ['iphone-duo', 'ipad-11', 'ipad-pro-11', 'ipad-air-11'],
    variants: [
      {
        sku: 'MUWA3AM/A',
        colorName: 'Blanco',
        colorHex: '#FFFFFF',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 400000,
        featuredImage: IMG.pencilUsbc,
        stock: 14,
      },
    ],
  },
  {
    slug: 'magic-keyboard-ipad-pro-11',
    name: 'Magic Keyboard iPad Pro 11"',
    subtitle: 'Teclado retroiluminado con trackpad integrado para iPad Pro 11".',
    description: 'Magic Keyboard para iPad Pro de 11 pulgadas, original nuevo sellado.',
    categorySlug: 'accesorios',
    productKind: ProductKind.accessory,
    isFeatured: false,
    images: [IMG.kbPro11],
    compatibleDeviceSlugs: ['ipad-pro-11'],
    variants: [
      {
        sku: 'MK-IPADPRO11',
        colorName: 'Negro',
        colorHex: '#1D1D1F',
        storage: '11"',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 1000000,
        featuredImage: IMG.kbPro11,
        stock: 6,
      },
    ],
  },
  {
    slug: 'magic-keyboard-ipad-air-11',
    name: 'Magic Keyboard iPad Air 11" - Negro',
    subtitle: 'Teclado flotante con trackpad de precisión para iPad Air 11".',
    description: 'Magic Keyboard para iPad Air 11" en color Negro, nuevo sellado.',
    categorySlug: 'accesorios',
    productKind: ProductKind.accessory,
    isFeatured: false,
    images: [IMG.kbAir11],
    compatibleDeviceSlugs: ['ipad-air-11'],
    variants: [
      {
        sku: 'MK-IPADAIR11-BLK',
        colorName: 'Negro',
        colorHex: '#1D1D1F',
        storage: '11"',
        condition: ProductCondition.NUEVO_SELLADO,
        price: 1100000,
        featuredImage: IMG.kbAir11,
        stock: 6,
      },
    ],
  },
];

async function upsertCategory(
  name: string,
  slug: string,
  sortOrder: number,
  parentId?: string,
  badge?: string,
) {
  return prisma.category.upsert({
    where: { slug },
    update: { name, isActive: true, sortOrder, parentId: parentId ?? null, badge },
    create: { name, slug, isActive: true, sortOrder, parentId: parentId ?? null, badge },
  });
}

async function main() {
  const brandApple = await prisma.brand.upsert({
    where: { slug: 'apple' },
    update: { name: 'Apple' },
    create: { name: 'Apple', slug: 'apple' },
  });

  // Familias y subcategorías principales
  const catMac = await upsertCategory('Mac', 'mac', 1);
  const catMacBookAir = await upsertCategory('MacBook Air', 'macbook-air', 1, catMac.id);
  const catIphone = await upsertCategory('iPhone', 'iphone', 2, undefined, 'Nuevo');
  const catIpad = await upsertCategory('iPad', 'ipad', 3);
  const catIpad11 = await upsertCategory('iPad', 'ipad-11', 3, catIpad.id);
  const catWatch = await upsertCategory('Apple Watch', 'apple-watch', 4);
  const catAudio = await upsertCategory('Audio', 'audio', 5);
  const catAccesorios = await upsertCategory('Accesorios', 'accesorios', 6);
  const catEnergia = await upsertCategory('Energía y Cargadores', 'energia', 2, catAccesorios.id);
  const catCables = await upsertCategory('Cables y Hubs', 'cables-hubs', 3, catAccesorios.id);

  const categoryBySlug: Record<string, string> = {
    mac: catMac.id,
    'macbook-air': catMacBookAir.id,
    iphone: catIphone.id,
    ipad: catIpad.id,
    'ipad-11': catIpad11.id,
    'apple-watch': catWatch.id,
    audio: catAudio.id,
    accesorios: catAccesorios.id,
    energia: catEnergia.id,
    'cables-hubs': catCables.id,
  };

  // DeviceModels para compatibilidad de accesorios
  const deviceModelsData = [
    { name: 'iPhone Duo', slug: 'iphone-duo', kind: DeviceKind.phone, year: 2026, sortOrder: 0 },
    { name: 'iPhone 18 Pro Max', slug: 'iphone-18-pro-max', kind: DeviceKind.phone, year: 2026, sortOrder: 1 },
    { name: 'iPhone 18 Pro', slug: 'iphone-18-pro', kind: DeviceKind.phone, year: 2026, sortOrder: 2 },
    { name: 'iPhone 17 Pro Max', slug: 'iphone-17-pro-max', kind: DeviceKind.phone, year: 2025, sortOrder: 3 },
    { name: 'iPhone 17 Pro', slug: 'iphone-17-pro', kind: DeviceKind.phone, year: 2025, sortOrder: 4 },
    { name: 'MacBook Air 13" M5', slug: 'macbook-air-13-m5', kind: DeviceKind.laptop, year: 2026, sortOrder: 5 },
    { name: 'iPad Pro 11"', slug: 'ipad-pro-11', kind: DeviceKind.tablet, year: 2025, sortOrder: 6 },
    { name: 'iPad Air 11"', slug: 'ipad-air-11', kind: DeviceKind.tablet, year: 2025, sortOrder: 7 },
    { name: 'iPad 11 (A16)', slug: 'ipad-11', kind: DeviceKind.tablet, year: 2025, sortOrder: 8 },
  ];

  const deviceModelBySlug: Record<string, string> = {};
  for (const dm of deviceModelsData) {
    const record = await prisma.deviceModel.upsert({
      where: { slug: dm.slug },
      update: { name: dm.name, kind: dm.kind, year: dm.year, isActive: true, sortOrder: dm.sortOrder },
      create: {
        name: dm.name,
        slug: dm.slug,
        kind: dm.kind,
        year: dm.year,
        isActive: true,
        sortOrder: dm.sortOrder,
        brandId: brandApple.id,
      },
    });
    deviceModelBySlug[dm.slug] = record.id;
  }

  // Desactivar productos antiguos fuera del catálogo oficial de 30 SKUs
  const activeSlugs = CATALOG.map((p) => p.slug);
  const deactivated = await prisma.product.updateMany({
    where: { slug: { notIn: activeSlugs }, isActive: true },
    data: { isActive: false, isFeatured: false },
  });
  console.log(`🔕 Productos anteriores desactivados: ${deactivated.count}`);

  let skuCount = 0;
  for (const item of CATALOG) {
    const categoryId = categoryBySlug[item.categorySlug];
    if (!categoryId) {
      throw new Error(`Categoría desconocida: ${item.categorySlug}`);
    }

    const deviceModelId = item.deviceModelSlug
      ? (deviceModelBySlug[item.deviceModelSlug] ?? null)
      : null;

    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        subtitle: item.subtitle ?? null,
        heroBadge: item.heroBadge ?? null,
        description: item.description,
        images: item.images,
        isFeatured: item.isFeatured,
        isActive: true,
        productKind: item.productKind,
        categoryId,
        brandId: brandApple.id,
        deviceModelId,
      },
      create: {
        slug: item.slug,
        name: item.name,
        subtitle: item.subtitle ?? null,
        heroBadge: item.heroBadge ?? null,
        description: item.description,
        images: item.images,
        isFeatured: item.isFeatured,
        isActive: true,
        productKind: item.productKind,
        categoryId,
        brandId: brandApple.id,
        deviceModelId,
      },
    });

    for (const v of item.variants) {
      await prisma.variant.upsert({
        where: { sku: v.sku },
        update: {
          productId: product.id,
          colorName: v.colorName ?? null,
          colorHex: v.colorHex ?? null,
          storage: v.storage ?? null,
          condition: v.condition ?? ProductCondition.NUEVO_SELLADO,
          price: v.price,
          featuredImage: v.featuredImage ?? item.images[0] ?? null,
          stock: v.stock ?? 10,
        },
        create: {
          productId: product.id,
          sku: v.sku,
          colorName: v.colorName ?? null,
          colorHex: v.colorHex ?? null,
          storage: v.storage ?? null,
          condition: v.condition ?? ProductCondition.NUEVO_SELLADO,
          price: v.price,
          featuredImage: v.featuredImage ?? item.images[0] ?? null,
          stock: v.stock ?? 10,
        },
      });
      skuCount += 1;
    }

    if (item.compatibleDeviceSlugs?.length) {
      await prisma.productCompatibility.deleteMany({
        where: { productId: product.id },
      });
      for (const dmSlug of item.compatibleDeviceSlugs) {
        const dmId = deviceModelBySlug[dmSlug];
        if (dmId) {
          await prisma.productCompatibility.create({
            data: { productId: product.id, deviceModelId: dmId },
          });
        }
      }
    }
  }

  console.log(`✅ Catálogo sincronizado: ${CATALOG.length} productos activos, ${skuCount} SKUs/variantes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
