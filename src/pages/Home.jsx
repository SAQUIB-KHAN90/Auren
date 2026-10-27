import Hero from '@/components/hero/Hero'
import BrandIntro from '@/components/sections/BrandIntro'
import FeaturedVehicle from '@/components/sections/FeaturedVehicle'
import Innovation from '@/components/sections/Innovation'
import Performance from '@/components/sections/Performance'
import Gallery from '@/components/sections/Gallery'
import DesignDetails from '@/components/sections/DesignDetails'
import Lifestyle from '@/components/sections/Lifestyle'
import FinalCta from '@/components/sections/FinalCta'

export default function Home() {
  return (
    <>
      <Hero />
      <BrandIntro />
      <FeaturedVehicle />
      <Innovation />
      <Performance />
      <Gallery />
      <DesignDetails />
      <Lifestyle />
      <FinalCta />
    </>
  )
}
