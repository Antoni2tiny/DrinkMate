// Modelos de datos para DrinkMate

/**
 * Modelo de Empresa
 */
export interface Empresa {
  id: string;
  nombre: string;
  logo?: string; // URL o base64 de la imagen
  tipo: string; // Bar, Restaurante, Licorería, etc.
  descripcion?: string;
  direccion?: string;
  telefono?: string;
  email: string;
  fechaRegistro: string;
  activa: boolean;
}

/**
 * Modelo de Cupón de Descuento
 */
export interface Cupon {
  id: string;
  empresaId: string;
  titulo: string;
  descripcion: string;
  tipoDescuento: 'porcentaje' | 'monto_fijo' | 'promocion_especial';
  valorDescuento: number; // Porcentaje (ej: 20) o monto fijo (ej: 500)
  codigoCupon?: string; // Código opcional para canjear
  fechaInicio: string;
  fechaVencimiento: string;
  limiteCanjeos?: number | null; // Límite de usos del cupón (null = ilimitado)
  canjeosActuales: number;
  condiciones?: string; // Términos y condiciones
  activo: boolean;
  // Campos opcionales para personalización
  imagen?: string;
  colorFondo?: string;
  colorTexto?: string;
}

/**
 * Modelo de Usuario
 */
export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  avatar?: string;
  fechaRegistro: string;
  cuponesCanjeados: string[]; // IDs de cupones canjeados
  favoritos: string[]; // IDs de tragos favoritos
}

/**
 * Modelo de Trago/Receta
 */
export interface Trago {
  id: string;
  nombre: string;
  descripcion: string;
  ingredientes: string[];
  instrucciones: string;
  imagen?: string;
  categoria: string;
  dificultad: 'fácil' | 'intermedio' | 'difícil';
  tiempoPreparacion: number; // en minutos
  autorId?: string; // ID del usuario que lo subió
  fechaCreacion: string;
  likes: number;
}

/**
 * Datos de ejemplo para desarrollo
 */
export const empresasEjemplo: Empresa[] = [
  {
    id: '1',
    nombre: 'MixClub',
    logo: require('../assets/MixClub.png'),
    tipo: 'Bar & Coctelería',
    descripcion: 'El mejor bar de cócteles de la ciudad',
    email: 'info@mixclub.com',
    fechaRegistro: '2025-01-01',
    activa: true,
  },
  {
    id: '2',
    nombre: 'CityBars',
    logo: require('../assets/CityBars.png'),
    tipo: 'Cadena de Bares',
    descripcion: 'Múltiples ubicaciones en toda la ciudad',
    email: 'contacto@citybars.com',
    fechaRegistro: '2025-01-02',
    activa: true,
  },
  {
    id: '3',
    nombre: 'TikiHouse',
    logo: require('../assets/TikiHouse.png'),
    tipo: 'Bar Temático',
    descripcion: 'Ambiente tropical y cócteles exóticos',
    email: 'hola@tikihouse.com',
    fechaRegistro: '2025-01-03',
    activa: true,
  },
  {
    id: '4',
    nombre: 'WhiskyLounge',
    logo: require('../assets/WhiskyLounge.png'),
    tipo: 'Whisky Bar',
    descripcion: 'Especialistas en whisky y destilados premium',
    email: 'info@whiskylounge.com',
    fechaRegistro: '2025-01-04',
    activa: true,
  },
];

export const cuponesEjemplo: Cupon[] = [
  {
    id: '1',
    empresaId: '1',
    titulo: '20% OFF en Cócteles',
    descripcion: 'Descuento del 20% en todos los cócteles de la casa',
    tipoDescuento: 'porcentaje',
    valorDescuento: 20,
    codigoCupon: 'MIXCLUB20',
    fechaInicio: '2025-10-28',
    fechaVencimiento: '2025-12-31',
    limiteCanjeos: 100,
    canjeosActuales: 15,
    condiciones: 'Válido de lunes a jueves. No acumulable con otras promociones.',
    activo: true,
    colorFondo: '#6C2BD9',
    colorTexto: '#FFFFFF',
  },
  {
    id: '2',
    empresaId: '2',
    titulo: '2x1 en Happy Hour',
    descripcion: 'Dos tragos por el precio de uno en happy hour',
    tipoDescuento: 'promocion_especial',
    valorDescuento: 50,
    fechaInicio: '2025-10-28',
    fechaVencimiento: '2025-11-30',
    limiteCanjeos: 50,
    canjeosActuales: 8,
    condiciones: 'Válido de 18:00 a 20:00 horas. Solo bebidas seleccionadas.',
    activo: true,
    colorFondo: '#FF6B6B',
    colorTexto: '#FFFFFF',
  },
  {
    id: '3',
    empresaId: '3',
    titulo: '$500 OFF Cócteles Tiki',
    descripcion: 'Descuento fijo en cócteles de la carta Tiki',
    tipoDescuento: 'monto_fijo',
    valorDescuento: 500,
    codigoCupon: 'TIKI500',
    fechaInicio: '2025-10-28',
    fechaVencimiento: '2025-12-15',
    limiteCanjeos: 75,
    canjeosActuales: 22,
    condiciones: 'Válido solo en cócteles de la carta Tiki. Mínimo de consumo $2000.',
    activo: true,
    colorFondo: '#10B981',
    colorTexto: '#FFFFFF',
  },
];