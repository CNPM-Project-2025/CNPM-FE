import { Navigate, Outlet } from 'react-router-dom';
import LeftMenu from '../../layout/LeftMenu';
import { useUser } from '../../../context/UserContext';
import LoadingScreen from '../../common/LoadingScreen';

const AdminLayout = () => {

  const { user, isLoading } = useUser();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width:'300px', background: '#f8f9fa', padding: '10px' ,position: 'fixed', height: '100vh' }}>
        <LeftMenu/>
      </div>
      <div style={{ marginLeft:'300px', flex: 1, padding: '20px' }}>
        <Outlet /> {/* Nội dung thay đổi ở đây */}
      </div>
    </div>
  );
};

export default AdminLayout;
