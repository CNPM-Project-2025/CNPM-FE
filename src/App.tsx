
import { Route, Routes } from 'react-router-dom'

import Home from './components/pages/Home'
import HomeMobile from './components/pages/Homemobile'

import NotFound from './components/pages/NotFound'
import Payment from './components/pages/Payment'
import NotificationToast from "./components/ui/NotificationToast";
import AdminRoutes from './routes/AdminRoutes';
import ThanhToan from './components/pages/ThanhToan'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Success } from './components/pages/payment/success'


function App() {
  return (
    <>
      <div className="w-100">
        <NotificationToast />
        <Routes>
          <Route path="/home" element={<Home />} /> {/* Route cho trang chính */}
          <Route path="/thanh-toan" element={<ThanhToan />} />
          <Route path="/thanh-toan/the" element={<Payment />} /> {/* Route cho trang chính */}
          <Route path="/success" element={<Success />} /> {/* Route cho trang chính */}
          <Route path="*" element={<NotFound />} /> {/* Route mặc định cho 404 */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/:tableId" element={<HomeMobile />} />
        </Routes>
      </div>
       <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  )
}

export default App
