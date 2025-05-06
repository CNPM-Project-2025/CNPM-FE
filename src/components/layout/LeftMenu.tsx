import { useLocation, useNavigate } from 'react-router-dom';
import { Home, User, Info, ScrollText, ChartNoAxesCombined, Import, PackageSearch, LogOut } from 'lucide-react'; // Đảm bảo LogOut icon có trong lucide-react

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/styles/LeftMenu.css';
import { useUser } from '../../context/UserContext';

const LeftMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {logout} = useUser();

  const isActive = (path: string) => location.pathname === path;

  // btn menu 
  const MenuBtn = ({
    path,
    icon,
    label,
    onClick,
  }: {
    path: string;
    icon: React.ReactNode;
    label: string;
    onClick?: () => void; // Optional callback for custom actions like logout
  }) => {
    const isActive = (path: string) => location.pathname === path;
    return (
      <button
        className={`btn-function ${isActive(path) ? 'btn-function-active' : ''}`}
        onClick={() => onClick ? onClick() : navigate(path)}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  // Hàm xử lý logout
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    // navigate('');
  };

  return (
    <div >
      {/* Thông tin người dùng */}
      <div className="border-bottom mb-3 pb-2 d-flex align-items-center">
        <div className="d-flex flex-column">
          <div className="fw-bold">Huynh Thanh Tien</div>
          <div className="text-muted">Admin</div>
        </div>
      </div>

      {/* Nút chức năng */}
      <div className="d-flex flex-column gap-2 mb-3">
        <MenuBtn path="/admin/home" icon={<Home size={18} />} label="Trang chủ" />
        <MenuBtn path="/admin/info" icon={<Info size={18} />} label="Thông tin của tôi" />
        <MenuBtn path="/admin/employee" icon={<User size={18} />} label="Quản lý nhân viên" />
        <MenuBtn path="/admin/invoice" icon={<ScrollText size={18} />} label="Quản lý hóa đơn" />
        <MenuBtn path="/admin/product" icon={<PackageSearch size={18} />} label="Quản lý sản phẩm" />
        <MenuBtn path="/admin/import" icon={<Import size={18} />} label="Quản lý nhập hàng" />
        <MenuBtn path="/admin/statistics" icon={<ChartNoAxesCombined size={18} />} label="Thống kê" />
      </div>

      {/* Nút Logout */}
      <div className="mt-auto">
        <MenuBtn path="" icon={<LogOut size={18} />} label="Đăng xuất" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default LeftMenu;
