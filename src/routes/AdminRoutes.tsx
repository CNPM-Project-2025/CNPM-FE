import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/pages/admin/AdminLayout';

import Home from '../components/pages/admin/Home';
import Info from '../components/pages/admin/Info';
import Employee from '../components/pages/admin/Employee';
import Invoice from '../components/pages/admin/Invoice';
import Product from '../components/pages/admin/Product';
import Import from '../components/pages/admin/Import';
import Statistics from '../components/pages/admin/Statistics';
import Account from '../components/pages/admin/Account';
import Category from '../components/pages/admin/Category';

import { UserProvider } from "../context/UserContext";
import Login from '../components/pages/admin/Login';


const AdminRoutes = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="info" element={<Info />} />
          <Route path="employee" element={<Employee />} />
          <Route path="product" element={<Product />} />
          <Route path="import" element={<Import />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="invoice" element={<Invoice />} />
          <Route path="account" element={<Account />} />
          <Route path='category' element={<Category />} />
        </Route>
        <Route path="login" element={<Login />} />
      </Routes>
    </UserProvider>

  );
};

export default AdminRoutes;
