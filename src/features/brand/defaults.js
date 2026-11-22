/** Neutral brand used until GET /brand answers, when it fails, and in tests. */
export const DEFAULT_BRAND = {
  name: 'Auto Dealer',
  short_name: 'AD',
  tagline: null,
  legal_name: 'Auto Dealer',
  logo_url: null,
  favicon_url: null,
  locale: {
    language: 'ru',
    locale: 'ru-RU',
    currency: 'BYN',
    country: 'BY',
    timezone: 'Europe/Minsk',
  },
  theme: {
    accent: '#dc2626',
    accent_strong: '#b51f1f',
    accent_subtle: '#fdf0f0',
    primary: '#1e293b',
    primary_hover: '#3a4556',
    focus: '#2563eb',
  },
  contacts: {
    phone: null,
    phone_display: null,
    email: null,
    address: null,
    location_line: null,
    working_hours: [],
    service_hours_note: null,
  },
  social: [],
  seo: { title: null, description: null, og_image_url: null },
  home: {
    hero_kicker: null,
    hero_title: null,
    hero_subtitle: null,
    images: {
      hero: null,
      promo: [],
      tile_stock: null,
      tile_test_drive: null,
      tile_dealers: null,
      service_maintenance: null,
      service_booking: null,
      service_parts: null,
    },
  },
  features: {
    test_drives: true,
    service_appointments: true,
    custom_orders: true,
    reviews: true,
    favorites: true,
  },
  demo: { show_login_hint: false },
}

/** Images bundled with the frontend; a brand overrides any of them via home.images. */
export const DEFAULT_HOME_IMAGES = {
  hero: '/images/home-hero-promo-2.jpg',
  promo: [
    '/images/home-hero-promo-1.jpg',
    '/images/home-hero-promo-2.jpg',
    '/images/home-hero-promo-3.jpg',
  ],
  tile_stock: '/images/home-tile-stock.jpg',
  tile_test_drive: '/images/home-hero-promo-3.jpg',
  tile_dealers: '/images/home-tile-dealers.jpg',
  service_maintenance: '/images/home-service-maintenance.jpg',
  service_booking: '/images/home-service-booking.jpg',
  service_parts: '/images/home-service-parts.jpg',
}
