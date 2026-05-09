import {
  HomeHeroPromoStrip,
  HomeIntro,
  HomeQuickTiles,
  HomeServiceStrip,
} from '@/widgets/home/index.js'

export function HomePage() {
  return (
    <>
      <HomeHeroPromoStrip />
      <HomeIntro />
      <HomeQuickTiles />
      <HomeServiceStrip />
    </>
  )
}
