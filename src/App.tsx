
import { Route, Routes } from 'react-router-dom'

import Home from './components/pages/Home'
import NotFound from './components/pages/NotFound'
import Payment from './components/pages/Payment'
import NotificationToast from "./components/ui/NotificationToast"; 


function App() {
  return (
    <>
      <div className="w-100">
      <NotificationToast />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/thanh-toan" element={<Payment />} /> {/* Route cho trang chính */}
          <Route path="*" element={<NotFound />} /> {/* Route mặc định cho 404 */}
        </Routes>
      </div>
    </>
  )
}

export default App
