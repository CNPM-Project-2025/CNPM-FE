import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/pages/admin/AdminLayout'; 
// import Home from '../pages/admin/Home'; 
import Home from '../components/pages/admin/Home'; 
import Account from '../components/pages/admin/Account';
import Invoice from '../components/pages/admin/Invoice';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route path="home" element={<Home />} />
        <Route path="account" element={<Account />} />
        <Route path="invoice" element={<Invoice />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
