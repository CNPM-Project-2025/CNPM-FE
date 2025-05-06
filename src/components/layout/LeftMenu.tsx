import { NavLink } from 'react-router-dom';

const LeftMenu = () => {
  return (
    <div style={{ width: '200px', background: '#f0f0f0', padding: '10px' }}>
      <ul>
        <li><NavLink to="/admin/home">Trang chủ</NavLink></li>
        <li><NavLink to="/admin/account">Tài khoản</NavLink></li>
        <li><NavLink to="/admin/hoadon">Hóa đơn</NavLink></li>
      </ul>
    </div>
  );
};

export default LeftMenu;
