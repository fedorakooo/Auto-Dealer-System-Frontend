export const PUBLIC_IMAGES = {
  heroPromo1: '/images/home-hero-promo-1.jpg',
  heroPromo2: '/images/home-hero-promo-2.jpg',
  heroPromo3: '/images/home-hero-promo-3.jpg',
  tileStock: '/images/home-tile-stock.jpg',
  tileTestdrive: '/images/home-tile-testdrive.jpg',
  tileDealers: '/images/home-tile-dealers.jpg',
  serviceMaintenance: '/images/home-service-maintenance.jpg',
  serviceBooking: '/images/home-service-booking.jpg',
  serviceParts: '/images/home-service-parts.jpg',
}
const rotation = [PUBLIC_IMAGES.heroPromo1, PUBLIC_IMAGES.heroPromo2, PUBLIC_IMAGES.heroPromo3]
export function publicImageByIndex(i) {
  return rotation[((i % rotation.length) + rotation.length) % rotation.length]
}
export function publicImageByNumericId(id) {
  const n = typeof id === 'number' && Number.isFinite(id) ? id : 0
  return rotation[Math.abs(n) % rotation.length]
}
