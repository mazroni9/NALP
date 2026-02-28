import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppLayout } from './AppLayout'
import { Home } from '@/pages/Home'
import { LiveAuction } from '@/pages/LiveAuction'
import { Catalog } from '@/pages/Catalog'
import { LotDetails } from '@/pages/LotDetails'
import { Map } from '@/pages/Map'
import { Services } from '@/pages/Services'
import { Rules } from '@/pages/Rules'
import { Login } from '@/pages/Login'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="live" element={<LiveAuction />} />
            <Route path="catalog" element={<Catalog />} />
            <Route path="lot/:id" element={<LotDetails />} />
            <Route path="map" element={<Map />} />
            <Route path="services" element={<Services />} />
            <Route path="rules" element={<Rules />} />
          </Route>
          <Route path="login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
