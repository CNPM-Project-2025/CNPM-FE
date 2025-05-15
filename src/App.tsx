
import { Route, Routes } from 'react-router-dom'

import Home from './components/pages/Home'
import HomeMobile from './components/pages/Homemobile'

import NotFound from './components/pages/NotFound'
import Payment from './components/pages/Payment'
import NotificationToast from "./components/ui/NotificationToast";
import AdminRoutes from './routes/AdminRoutes';
import ThanhToan from './components/pages/ThanhToan'


function App() {
  return (
    <>
      <div className="w-100">
        <NotificationToast />
        <Routes>
          <Route path="/" element={<HomeMobile />} />
          <Route path="/home" element={<Home />} /> {/* Route cho trang chính */}
          <Route path="/thanh-toan" element={<ThanhToan />} />
          <Route path="/thanh-toan/the" element={<Payment />} /> {/* Route cho trang chính */}
          <Route path="*" element={<NotFound />} /> {/* Route mặc định cho 404 */}
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </div>
    </>
  )
}

export default App
