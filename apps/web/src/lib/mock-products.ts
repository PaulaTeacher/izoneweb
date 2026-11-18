import type { Product } from '@izone/shared-types';

export const MOCK_PRODUCTS: Product[] = ([
  // ===================== IPHONE 17 PRO =====================
  {
    id: 'prod-iphone-17-pro',
    name: 'iPhone 17 Pro',
    slug: 'iphone-17-pro',
    description: 'iPhone 17 Pro con chip A19 Pro, diseño en titanio y Control de la Cámara. Pantalla Super Retina XDR y sistema de cámaras Pro de 48 MP.',
    seoTitle: 'Comprar iPhone 17 Pro en Bogotá | iZone Tech',
    seoDescription: 'iPhone 17 Pro con chip A19 Pro y titanio. Garantía oficial de 1 año y envíos a toda Colombia.',
    brandId: 'brand-apple',
    brand: { id: 'brand-apple', name: 'Apple', slug: 'apple' },
    categoryId: 'cat-iphone',
    category: { id: 'cat-iphone', name: 'iPhone', slug: 'iphone', sortOrder: 2 },
    images: [
      '/images/products/iphone-17-pro-silver.webp',
    ],
    tags: [
      { id: 'tag-nuevo', name: 'Nuevo', slug: 'nuevo' },
      { id: 'tag-pro', name: 'Pro', slug: 'pro' },
    ],
    isFeatured: true,
    isActive: true,
    createdAt: '2025-09-09T00:00:00.000Z',
    updatedAt: '2025-09-09T00:00:00.000Z',
    reviews: [],
    variants: [
      {
        id: 'var-17p-natural-256',
        productId: 'prod-iphone-17-pro',
        colorName: 'Titanio Natural',
        storage: '256GB',
        price: 5749000,
        comparePrice: 6499000,
        sku: 'IPH17PRO-NAT-256',
        stock: 10,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2025-09-09T00:00:00.000Z',
        updatedAt: '2025-09-09T00:00:00.000Z',
      },
      {
        id: 'var-17p-black-256',
        productId: 'prod-iphone-17-pro',
        colorName: 'Titanio Negro',
        storage: '256GB',
        price: 5749000,
        comparePrice: 6499000,
        sku: 'IPH17PRO-BLK-256',
        stock: 8,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2025-09-09T00:00:00.000Z',
        updatedAt: '2025-09-09T00:00:00.000Z',
      },
      {
        id: 'var-17p-white-512',
        productId: 'prod-iphone-17-pro',
        colorName: 'Titanio Blanco',
        storage: '512GB',
        price: 6749000,
        comparePrice: 7499000,
        sku: 'IPH17PRO-WHT-512',
        stock: 4,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2025-09-09T00:00:00.000Z',
        updatedAt: '2025-09-09T00:00:00.000Z',
      },
    ],
  },

  // ===================== IPHONE 16 PRO MAX =====================
  {
    id: 'prod-iphone-16-pro-max',
    name: 'iPhone 16 Pro Max',
    slug: 'iphone-16-pro-max',
    description: 'El iPhone definitivo con la pantalla Super Retina XDR de 6.9 pulgadas más grande de la historia, estructura de titanio de grado 5, Control de la Cámara y el revolucionario chip A18 Pro.',
    seoTitle: 'Comprar iPhone 16 Pro Max en Colombia | iZone Tech Bogotá',
    seoDescription: 'iPhone 16 Pro Max disponible en Titanio del Desierto, Natural, Blanco y Negro. 1 año de garantía Apple.',
    brandId: 'brand-apple',
    brand: { id: 'brand-apple', name: 'Apple', slug: 'apple' },
    categoryId: 'cat-iphone',
    category: { id: 'cat-iphone', name: 'iPhone', slug: 'iphone', sortOrder: 2 },
    images: [
      '/images/products/iphone-17-pro-silver.webp',
      '/images/products/iphone-17-pro-silver.webp'
    ],
    tags: [
      { id: 'tag-nuevo', name: 'Nuevo', slug: 'nuevo' },
      { id: 'tag-pro', name: 'Pro', slug: 'pro' },
      { id: 'tag-destacado', name: 'Más Vendido', slug: 'mas-vendido' }
    ],
    isFeatured: true,
    isActive: true,
    createdAt: '2024-09-20T00:00:00.000Z',
    updatedAt: '2024-09-20T00:00:00.000Z',
    reviews: [],
    variants: [
      {
        id: 'var-16pm-desert-256',
        productId: 'prod-iphone-16-pro-max',
        colorName: 'Titanio del Desierto',
        storage: '256GB',
        price: 6499000,
        comparePrice: 6999000,
        sku: 'MYX83LZ/A',
        stock: 12,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2024-09-20T00:00:00.000Z',
        updatedAt: '2024-09-20T00:00:00.000Z'
      },
      {
        id: 'var-16pm-natural-256',
        productId: 'prod-iphone-16-pro-max',
        colorName: 'Titanio Natural',
        storage: '256GB',
        price: 6499000,
        comparePrice: 6999000,
        sku: 'MYX73LZ/A',
        stock: 8,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2024-09-20T00:00:00.000Z',
        updatedAt: '2024-09-20T00:00:00.000Z'
      },
      {
        id: 'var-16pm-white-256',
        productId: 'prod-iphone-16-pro-max',
        colorName: 'Titanio Blanco',
        storage: '256GB',
        price: 6499000,
        comparePrice: 6999000,
        sku: 'MYX93LZ/A',
        stock: 10,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2024-09-20T00:00:00.000Z',
        updatedAt: '2024-09-20T00:00:00.000Z'
      },
      {
        id: 'var-16pm-black-256',
        productId: 'prod-iphone-16-pro-max',
        colorName: 'Titanio Negro',
        storage: '256GB',
        price: 6499000,
        comparePrice: 6999000,
        sku: 'MYX63LZ/A',
        stock: 15,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2024-09-20T00:00:00.000Z',
        updatedAt: '2024-09-20T00:00:00.000Z'
      },
      {
        id: 'var-16pm-natural-512',
        productId: 'prod-iphone-16-pro-max',
        colorName: 'Titanio Natural',
        storage: '512GB',
        price: 7499000,
        comparePrice: 7999000,
        sku: 'MYXD3LZ/A',
        stock: 5,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2024-09-20T00:00:00.000Z',
        updatedAt: '2024-09-20T00:00:00.000Z'
      },
      {
        id: 'var-16pm-desert-1tb',
        productId: 'prod-iphone-16-pro-max',
        colorName: 'Titanio del Desierto',
        storage: '1TB',
        price: 8499000,
        comparePrice: 8999000,
        sku: 'MYXJ3LZ/A',
        stock: 3,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2024-09-20T00:00:00.000Z',
        updatedAt: '2024-09-20T00:00:00.000Z'
      }
    ]
  },

  // ===================== IPHONE 16 PRO =====================
  {
    id: 'prod-iphone-16-pro',
    name: 'iPhone 16 Pro',
    slug: 'iphone-16-pro',
    description: 'La máxima potencia Pro en un diseño compacto con pantalla Super Retina XDR de 6.3 pulgadas, Control de la Cámara, grabación en 4K Dolby Vision a 120 fps y chip A18 Pro.',
    seoTitle: 'Comprar iPhone 16 Pro en Bogotá | iZone Tech',
    seoDescription: 'iPhone 16 Pro con chip A18 Pro y titanio de grado 5. Envíos gratis a todo Colombia.',
    brandId: 'brand-apple',
    brand: { id: 'brand-apple', name: 'Apple', slug: 'apple' },
    categoryId: 'cat-iphone',
    category: { id: 'cat-iphone', name: 'iPhone', slug: 'iphone', sortOrder: 2 },
    images: [
      '/images/products/iphone-17-pro-silver.webp'
    ],
    tags: [
      { id: 'tag-nuevo', name: 'Nuevo', slug: 'nuevo' },
      { id: 'tag-pro', name: 'Pro', slug: 'pro' }
    ],
    isFeatured: true,
    isActive: true,
    createdAt: '2024-09-20T00:00:00.000Z',
    updatedAt: '2024-09-20T00:00:00.000Z',
    reviews: [],
    variants: [
      {
        id: 'var-16p-desert-128',
        productId: 'prod-iphone-16-pro',
        colorName: 'Titanio del Desierto',
        storage: '128GB',
        price: 5499000,
        comparePrice: 5899000,
        sku: 'MYNG3LZ/A',
        stock: 14,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2024-09-20T00:00:00.000Z',
        updatedAt: '2024-09-20T00:00:00.000Z'
      },
      {
        id: 'var-16p-natural-256',
        productId: 'prod-iphone-16-pro',
        colorName: 'Titanio Natural',
        storage: '256GB',
        price: 5999000,
        comparePrice: 6399000,
        sku: 'MYNL3LZ/A',
        stock: 10,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2024-09-20T00:00:00.000Z',
        updatedAt: '2024-09-20T00:00:00.000Z'
      },
      {
        id: 'var-16p-black-256',
        productId: 'prod-iphone-16-pro',
        colorName: 'Titanio Negro',
        storage: '256GB',
        price: 5999000,
        comparePrice: 6399000,
        sku: 'MYNJ3LZ/A',
        stock: 7,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2024-09-20T00:00:00.000Z',
        updatedAt: '2024-09-20T00:00:00.000Z'
      }
    ]
  },

  // ===================== IPHONE 16 PLUS =====================
  {
    id: 'prod-iphone-16-plus',
    name: 'iPhone 16 Plus',
    slug: 'iphone-16-plus',
    description: 'Gran pantalla de 6.7 pulgadas con una batería asombrosa para todo el día, Control de la Cámara, cámara Fusion de 48 MP y el poderoso chip A18.',
    seoTitle: 'iPhone 16 Plus Colombia | iZone Tech',
    seoDescription: 'Descubre el nuevo iPhone 16 Plus con colores vibrantes y diseño en aluminio aeroespacial.',
    brandId: 'brand-apple',
    brand: { id: 'brand-apple', name: 'Apple', slug: 'apple' },
    categoryId: 'cat-iphone',
    category: { id: 'cat-iphone', name: 'iPhone', slug: 'iphone', sortOrder: 2 },
    images: [
      '/images/products/iphone-17-pro-silver.webp'
    ],
    tags: [
      { id: 'tag-nuevo', name: 'Nuevo', slug: 'nuevo' }
    ],
    isFeatured: true,
    isActive: true,
    createdAt: '2024-09-20T00:00:00.000Z',
    updatedAt: '2024-09-20T00:00:00.000Z',
    reviews: [],
    variants: [
      {
        id: 'var-16plus-ultra-128',
        productId: 'prod-iphone-16-plus',
        colorName: 'Ultramar',
        storage: '128GB',
        price: 4999000,
        comparePrice: 5399000,
        sku: 'MXVM3LZ/A',
        stock: 9,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2024-09-20T00:00:00.000Z',
        updatedAt: '2024-09-20T00:00:00.000Z'
      },
      {
        id: 'var-16plus-teal-128',
        productId: 'prod-iphone-16-plus',
        colorName: 'Verde Azulado',
        storage: '128GB',
        price: 4999000,
        comparePrice: 5399000,
        sku: 'MXVN3LZ/A',
        stock: 6,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2024-09-20T00:00:00.000Z',
        updatedAt: '2024-09-20T00:00:00.000Z'
      },
      {
        id: 'var-16plus-pink-128',
        productId: 'prod-iphone-16-plus',
        colorName: 'Rosa',
        storage: '128GB',
        price: 4999000,
        comparePrice: 5399000,
        sku: 'MXVP3LZ/A',
        stock: 11,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2024-09-20T00:00:00.000Z',
        updatedAt: '2024-09-20T00:00:00.000Z'
      }
    ]
  },

  // ===================== IPHONE 16 =====================
  {
    id: 'prod-iphone-16',
    name: 'iPhone 16',
    slug: 'iphone-16',
    description: 'Conoce el iPhone 16 con el botón de Control de la Cámara, botón de Acción personalizable, chip A18 ultra veloz y cámara 2 en 1 de 48 MP.',
    seoTitle: 'Comprar iPhone 16 en Bogotá | Distribuidor Oficial iZone',
    seoDescription: 'Nuevo iPhone 16 en colores ultramar, verde azulado, rosa, blanco y negro. Garantía oficial de 1 año.',
    brandId: 'brand-apple',
    brand: { id: 'brand-apple', name: 'Apple', slug: 'apple' },
    categoryId: 'cat-iphone',
    category: { id: 'cat-iphone', name: 'iPhone', slug: 'iphone', sortOrder: 2 },
    images: [
      '/images/products/iphone-17-pro-silver.webp'
    ],
    tags: [
      { id: 'tag-nuevo', name: 'Nuevo', slug: 'nuevo' },
      { id: 'tag-destacado', name: 'Más Vendido', slug: 'mas-vendido' }
    ],
    isFeatured: true,
    isActive: true,
    createdAt: '2024-09-20T00:00:00.000Z',
    updatedAt: '2024-09-20T00:00:00.000Z',
    reviews: [],
    variants: [
      {
        id: 'var-16-ultra-128',
        productId: 'prod-iphone-16',
        colorName: 'Ultramar',
        storage: '128GB',
        price: 4399000,
        comparePrice: 4799000,
        sku: 'MYE73LZ/A',
        stock: 20,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2024-09-20T00:00:00.000Z',
        updatedAt: '2024-09-20T00:00:00.000Z'
      },
      {
        id: 'var-16-white-128',
        productId: 'prod-iphone-16',
        colorName: 'Blanco',
        storage: '128GB',
        price: 4399000,
        comparePrice: 4799000,
        sku: 'MYE93LZ/A',
        stock: 14,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2024-09-20T00:00:00.000Z',
        updatedAt: '2024-09-20T00:00:00.000Z'
      },
      {
        id: 'var-16-black-128',
        productId: 'prod-iphone-16',
        colorName: 'Negro',
        storage: '128GB',
        price: 4399000,
        comparePrice: 4799000,
        sku: 'MYE63LZ/A',
        stock: 18,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2024-09-20T00:00:00.000Z',
        updatedAt: '2024-09-20T00:00:00.000Z'
      }
    ]
  },

  // ===================== IPHONE 15 PRO MAX =====================
  {
    id: 'prod-iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    description: 'El primer iPhone forjado en titanio aeroespacial, con zoom óptico de 5x, Dynamic Island y el chip A17 Pro para juegos de nivel de consola.',
    seoTitle: 'iPhone 15 Pro Max con Descuento | iZone Tech',
    seoDescription: 'Compra tu iPhone 15 Pro Max original en Bogotá con garantía oficial Apple.',
    brandId: 'brand-apple',
    brand: { id: 'brand-apple', name: 'Apple', slug: 'apple' },
    categoryId: 'cat-iphone',
    category: { id: 'cat-iphone', name: 'iPhone', slug: 'iphone', sortOrder: 2 },
    images: [
      '/images/products/iphone-17-pro-silver.webp'
    ],
    tags: [
      { id: 'tag-oferta', name: 'Oferta Especial', slug: 'oferta-especial' }
    ],
    isFeatured: true,
    isActive: true,
    createdAt: '2023-09-22T00:00:00.000Z',
    updatedAt: '2024-09-01T00:00:00.000Z',
    reviews: [],
    variants: [
      {
        id: 'var-15pm-natural-256',
        productId: 'prod-iphone-15-pro-max',
        colorName: 'Titanio Natural',
        storage: '256GB',
        price: 5499000,
        comparePrice: 6199000,
        sku: 'MU773LZ/A',
        stock: 7,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2023-09-22T00:00:00.000Z',
        updatedAt: '2024-09-01T00:00:00.000Z'
      },
      {
        id: 'var-15pm-blue-256',
        productId: 'prod-iphone-15-pro-max',
        colorName: 'Titanio Azul',
        storage: '256GB',
        price: 5399000,
        comparePrice: 6099000,
        sku: 'MU7A3LZ/A',
        stock: 4,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2023-09-22T00:00:00.000Z',
        updatedAt: '2024-09-01T00:00:00.000Z'
      }
    ]
  },

  // ===================== IPHONE 15 =====================
  {
    id: 'prod-iphone-15',
    name: 'iPhone 15',
    slug: 'iphone-15',
    description: 'Dynamic Island, cámara principal de 48 MP con teleobjetivo 2x y conector USB-C en un diseño resistente de vidrio con infusión de color.',
    seoTitle: 'Comprar iPhone 15 en Colombia | iZone Tech',
    seoDescription: 'iPhone 15 disponible en entrega inmediata en Bogotá y envíos nacionales.',
    brandId: 'brand-apple',
    brand: { id: 'brand-apple', name: 'Apple', slug: 'apple' },
    categoryId: 'cat-iphone',
    category: { id: 'cat-iphone', name: 'iPhone', slug: 'iphone', sortOrder: 2 },
    images: [
      '/images/products/iphone-17-pro-silver.webp'
    ],
    tags: [
      { id: 'tag-pop', name: 'Favorito', slug: 'favorito' }
    ],
    isFeatured: true,
    isActive: true,
    createdAt: '2023-09-22T00:00:00.000Z',
    updatedAt: '2024-09-01T00:00:00.000Z',
    reviews: [],
    variants: [
      {
        id: 'var-15-blue-128',
        productId: 'prod-iphone-15',
        colorName: 'Azul',
        storage: '128GB',
        price: 3699000,
        comparePrice: 4099000,
        sku: 'MTP43LZ/A',
        stock: 15,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2023-09-22T00:00:00.000Z',
        updatedAt: '2024-09-01T00:00:00.000Z'
      },
      {
        id: 'var-15-black-128',
        productId: 'prod-iphone-15',
        colorName: 'Negro',
        storage: '128GB',
        price: 3699000,
        comparePrice: 4099000,
        sku: 'MTP03LZ/A',
        stock: 12,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2023-09-22T00:00:00.000Z',
        updatedAt: '2024-09-01T00:00:00.000Z'
      }
    ]
  },

  // ===================== IPHONE 14 =====================
  {
    id: 'prod-iphone-14',
    name: 'iPhone 14',
    slug: 'iphone-14',
    description: 'Increíble sistema de dos cámaras para fotos deslumbrantes en cualquier condición de luz, Detección de Choques y batería para todo el día.',
    seoTitle: 'iPhone 14 Precio Colombia | iZone Tech',
    seoDescription: 'Adquiere tu iPhone 14 al mejor precio del mercado con respaldo y garantía.',
    brandId: 'brand-apple',
    brand: { id: 'brand-apple', name: 'Apple', slug: 'apple' },
    categoryId: 'cat-iphone',
    category: { id: 'cat-iphone', name: 'iPhone', slug: 'iphone', sortOrder: 2 },
    images: [
      '/images/products/iphone-17-pro-silver.webp'
    ],
    tags: [],
    isFeatured: false,
    isActive: true,
    createdAt: '2022-09-16T00:00:00.000Z',
    updatedAt: '2024-09-01T00:00:00.000Z',
    reviews: [],
    variants: [
      {
        id: 'var-14-midnight-128',
        productId: 'prod-iphone-14',
        colorName: 'Medianoche',
        storage: '128GB',
        price: 2999000,
        comparePrice: 3399000,
        sku: 'MPUF3LZ/A',
        stock: 14,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2022-09-16T00:00:00.000Z',
        updatedAt: '2024-09-01T00:00:00.000Z'
      },
      {
        id: 'var-14-starlight-128',
        productId: 'prod-iphone-14',
        colorName: 'Blanco Estelar',
        storage: '128GB',
        price: 2999000,
        comparePrice: 3399000,
        sku: 'MPUG3LZ/A',
        stock: 8,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2022-09-16T00:00:00.000Z',
        updatedAt: '2024-09-01T00:00:00.000Z'
      }
    ]
  },

  // ===================== IPHONE 13 =====================
  {
    id: 'prod-iphone-13',
    name: 'iPhone 13',
    slug: 'iphone-13',
    description: 'El sistema de dos cámaras más avanzado en un iPhone con modo Cine, chip A15 Bionic y Ceramic Shield para máxima durabilidad.',
    seoTitle: 'iPhone 13 Colombia | Oferta iZone Tech',
    seoDescription: 'iPhone 13 128GB al mejor precio de Bogotá. Envío a nivel nacional.',
    brandId: 'brand-apple',
    brand: { id: 'brand-apple', name: 'Apple', slug: 'apple' },
    categoryId: 'cat-iphone',
    category: { id: 'cat-iphone', name: 'iPhone', slug: 'iphone', sortOrder: 2 },
    images: [
      '/images/products/iphone-17-pro-silver.webp'
    ],
    tags: [],
    isFeatured: false,
    isActive: true,
    createdAt: '2021-09-24T00:00:00.000Z',
    updatedAt: '2024-09-01T00:00:00.000Z',
    reviews: [],
    variants: [
      {
        id: 'var-13-midnight-128',
        productId: 'prod-iphone-13',
        colorName: 'Medianoche',
        storage: '128GB',
        price: 2499000,
        comparePrice: 2899000,
        sku: 'MLPF3LZ/A',
        stock: 22,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2021-09-24T00:00:00.000Z',
        updatedAt: '2024-09-01T00:00:00.000Z'
      }
    ]
  },

  // ===================== IPHONE SE =====================
  {
    id: 'prod-iphone-se',
    name: 'iPhone SE (3.ª generación)',
    slug: 'iphone-se',
    description: 'La potencia del chip A15 Bionic en el clásico y compacto diseño de 4.7 pulgadas con botón de inicio Touch ID y conectividad 5G.',
    seoTitle: 'iPhone SE Colombia | iZone Tech',
    seoDescription: 'iPhone SE de 3ra generación compacto y potente. Garantía oficial.',
    brandId: 'brand-apple',
    brand: { id: 'brand-apple', name: 'Apple', slug: 'apple' },
    categoryId: 'cat-iphone',
    category: { id: 'cat-iphone', name: 'iPhone', slug: 'iphone', sortOrder: 2 },
    images: [
      '/images/products/iphone-17-pro-silver.webp'
    ],
    tags: [],
    isFeatured: false,
    isActive: true,
    createdAt: '2022-03-18T00:00:00.000Z',
    updatedAt: '2024-09-01T00:00:00.000Z',
    reviews: [],
    variants: [
      {
        id: 'var-se-midnight-64',
        productId: 'prod-iphone-se',
        colorName: 'Medianoche',
        storage: '64GB',
        price: 2099000,
        comparePrice: 2399000,
        sku: 'MMX53LZ/A',
        stock: 10,
        featuredImage: '/images/products/iphone-17-pro-silver.webp',
        createdAt: '2022-03-18T00:00:00.000Z',
        updatedAt: '2024-09-01T00:00:00.000Z'
      }
    ]
  },

  // ===================== MACBOOK AIR M3 =====================
  {
    id: 'prod-macbook-air-m3',
    name: 'MacBook Air 13" Chip M3',
    slug: 'macbook-air-m3',
    description: 'Increíblemente delgada y rápida con el chip M3, hasta 18 horas de batería y pantalla Liquid Retina.',
    seoTitle: 'MacBook Air M3 en Bogotá | iZone Tech',
    seoDescription: 'MacBook Air con chip M3 disponible en Medianoche, Blanco Estelar, Gris Espacial y Plata.',
    brandId: 'brand-apple',
    brand: { id: 'brand-apple', name: 'Apple', slug: 'apple' },
    categoryId: 'cat-mac',
    category: { id: 'cat-mac', name: 'Mac', slug: 'mac', sortOrder: 1 },
    images: [
      '/images/chapternav/accessories.png'
    ],
    tags: [
      { id: 'tag-nuevo', name: 'Nuevo', slug: 'nuevo' },
      { id: 'tag-destacado', name: 'Más Vendido', slug: 'mas-vendido' }
    ],
    isFeatured: true,
    isActive: true,
    createdAt: '2024-03-08T00:00:00.000Z',
    updatedAt: '2024-09-01T00:00:00.000Z',
    reviews: [],
    variants: [
      {
        id: 'var-mba-m3-mid-256',
        productId: 'prod-macbook-air-m3',
        colorName: 'Medianoche',
        storage: '256GB SSD',
        price: 5519000,
        comparePrice: 5999000,
        sku: 'MRXU3E/A',
        stock: 15,
        featuredImage: '/images/chapternav/accessories.png',
        createdAt: '2024-03-08T00:00:00.000Z',
        updatedAt: '2024-09-01T00:00:00.000Z'
      }
    ]
  },

  // ===================== AIRPODS PRO 2 =====================
  {
    id: 'prod-airpods-pro-2',
    name: 'AirPods Pro (2.ª generación) con estuche MagSafe (USB-C)',
    slug: 'airpods-pro-2',
    description: 'Cancelación Activa de Ruido hasta 2 veces más potente, Audio Espacial personalizado y estuche con USB-C.',
    seoTitle: 'AirPods Pro 2 USB-C Colombia | iZone Tech',
    seoDescription: 'AirPods Pro 2da generación con USB-C y chip H2 al mejor precio.',
    brandId: 'brand-apple',
    brand: { id: 'brand-apple', name: 'Apple', slug: 'apple' },
    categoryId: 'cat-audio',
    category: { id: 'cat-audio', name: 'Audio', slug: 'audio', sortOrder: 5 },
    images: [
      '/images/chapternav/accessories.png'
    ],
    tags: [
      { id: 'tag-destacado', name: 'Más Vendido', slug: 'mas-vendido' }
    ],
    isFeatured: true,
    isActive: true,
    createdAt: '2023-09-22T00:00:00.000Z',
    updatedAt: '2024-09-01T00:00:00.000Z',
    reviews: [],
    variants: [
      {
        id: 'var-airpods-pro-2',
        productId: 'prod-airpods-pro-2',
        color: 'Blanco',
        price: 1104000,
        compareAtPrice: 1299000,
        sku: 'MTJV3AM/A',
        stock: 35,
        featuredImage: '/images/chapternav/accessories.png',
        createdAt: '2023-09-22T00:00:00.000Z',
        updatedAt: '2024-09-01T00:00:00.000Z'
      }
    ]
  }
]) as unknown as Product[];
