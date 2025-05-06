import { Outlet } from 'react-router-dom';
import LeftMenu from '../../layout/LeftMenu';

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <LeftMenu />
      <div style={{ flex: 1, padding: '20px' }}>
        <Outlet /> {/* Nội dung thay đổi ở đây */}
      </div>
    </div>
  );
};

export default AdminLayout;
