import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ScrollRefresh from '@/components/layout/ScrollRefresh'
import ScrollToTop from '@/components/layout/ScrollToTop'
import Home from '@/pages/Home'

// Home ships in the main bundle because it is the entry point. Everything else
// is fetched when someone actually navigates to it, which keeps three.js and
// the heavy pages out of the first load.
const About = lazy(() => import('@/pages/About'))
const Contact = lazy(() => import('@/pages/Contact'))
const Innovation = lazy(() => import('@/pages/Innovation'))
const VehiclesPage = lazy(() => import('@/components/vehicles/VehiclesPage'))
const VehicleDetail = lazy(() => import('@/components/vehicles/VehicleDetail'))

// Held for a beat rather than flashing a spinner on a fast connection.
function RouteFallback() {
  return <div className="min-h-screen bg-auren-black" />
}

function App() {
  return (
    <main className="bg-auren-black">
      <ScrollToTop />
      <ScrollRefresh />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/innovation" element={<Innovation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/vehicles/:slug" element={<VehicleDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </main>
  )
}

export default App
