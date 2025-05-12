import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Table } from "react-bootstrap";
import { useUser } from "../../../context/UserContext";
import { UserType } from "../../../types/UserType";

import LoadingScreen from "../../common/LoadingScreen";
import { Search } from "lucide-react";

type Params = {
  page?: number | 1;
  items_per_page?: number | 10;
  search?: string | null;
  search_by?: string | null;
};


function Employee() {

  const url = 'http://192.168.16.92:9999/';

  const navigate = useNavigate();
  const location = useLocation();

  const init = async (params: Params) => {
    setIsLoading(true);
    await fetchUser(params);
    setIsLoading(false);
  };

  // auth
  const isFirstRender = useRef(true);
  const { user, isLoading } = useUser();
  const [isProductLoading, setIsLoading] = useState(false);
  // value
  // const [page, setPage] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const pricemin = useRef<HTMLInputElement | null>(null);
  const pricemax = useRef<HTMLInputElement | null>(null);
  const [lastpage, setLastPage] = useState(1);
  const [User, setUser] = useState<UserType[]>([]);
  const [params, setParams] = useState<Params>({
    page: 1,
    items_per_page: 10,
    search: null,
    search_by: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // fetch

  const fetchUser = async (params: Params) => {
    setIsLoading(true);
    const filteredParams: Record<string, string> = {};

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        filteredParams[key] = String(value);
      }
    });
    const queryParams = new URLSearchParams(filteredParams);
    const response = await fetch(`${url}users?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    const data = await response.json();
    console.log("data", data);
    setUser(data.data);
    setLastPage(data.lastPage);
    setIsLoading(false);
  };




  // handle


  // useEffect
  useEffect(() => {
    // Lấy giá trị từ URLSearchParams
    const searchParams = new URLSearchParams(location.search);

    // Lấy tất cả các giá trị trong URL và gán vào params
    const newParams: Params = {
      page: searchParams.has('page') ? Number(searchParams.get('page')) : 1,
      items_per_page: searchParams.has('items_per_page') ? Number(searchParams.get('items_per_page')) : 10,
      search: searchParams.get('search') || null,
      search_by: searchParams.get('search_by') === 'first_name' ? 'first_name' : null,
    };

    // Cập nhật lại params với các giá trị lấy từ URL
    console.log("newParams", newParams);
    if (isFirstRender.current === true) {
      setParams(newParams);
    }
    // Thực hiện fetch lại dữ liệu với params mới
    init(newParams);
    isFirstRender.current = false;
  }, [location.search]);

  useEffect(() => {
    if (isFirstRender.current === true) {
      // isFirstRender.current = false;
      return;
    }
    console.log("params", params);
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.set(key, String(value));
      }
    });

    // Thay đổi URL mà không reload trang
    navigate({
      pathname: location.pathname,
      search: `?${searchParams.toString()}`
    }, { replace: true });
  }, [params]);


  if (isLoading || isProductLoading) {
    return <LoadingScreen></LoadingScreen>;
  }

  return (
    <div>
      <div>
        <Form
          className="d-flex gap-2 mb-3"
          onSubmit={(e) => {
            e.preventDefault();
            setParams({
              ...params,
              page: 1,
              search: inputRef.current?.value,
              search_by: 'first_name',
            });
          }}
        >
          <Form.Select
            defaultValue={params.search_by || 'first_name'}
            onChange={(e) => setParams({ ...params, search_by: e.target.value })}
            style={{ width: '150px' }}
          >

            <option value="first_name">Tên</option>
            <option value="description">Mô tả</option>
            <option value="code">Mã sản phẩm</option>
          </Form.Select>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm sản phẩm"
            defaultValue={params.search || ''}
            ref={inputRef}
          />
          <Button variant="outline-secondary" type="submit">
            <Search size={16} />
          </Button>
        </Form>
      </div>
      <div className="d-flex gap-3 align-items-center mb-3">
        <Button onClick={console.log}>
          Thêm nhân viên
        </Button>

        {/* <Button onClick={() => { navigate('/admin/category') }}>
          Thông tin danh mục
        </Button> */}
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Ngày tạo</th>
            <th>Trạng thái</th>
            <th style={{ width: '130px' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {User.map((user, index) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
              <td>{user.status === 1 ? "Đang làm" : "Ngừng làm"}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <div className="d-flex gap-2">
                  <Button variant="warning" size="sm" onClick={() => { }}>
                    Sửa
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => { }}>
                    Xóa
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* thêm phân trang */}
      <div className="d-flex justify-content-center align-items-center my-3 gap-2">
        <Button
          disabled={params.page === 1}
          onClick={() => setParams({ ...params, page: (params.page || 1) - 1 })}
        >
          Previous
        </Button>

        {Array.from({ length: 3 }, (_, i) => {
          const p = (params.page ?? 1) - 1 + i;
          if (p < 1 || p > lastpage) return null;

          return (
            <Button
              key={p}
              variant={p === params.page ? 'primary' : 'outline-secondary'}
              onClick={() => setParams({ ...params, page: p })}
            >
              {p}
            </Button>
          );
        })}

        <Button
          disabled={params.page === lastpage}
          onClick={() => setParams({ ...params, page: (params.page ?? 1) + 1 })}
        >
          Next
        </Button>
      </div>

    </div>
  )
}

export default Employee;

//