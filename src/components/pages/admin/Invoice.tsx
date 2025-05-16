import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Table } from "react-bootstrap";
import { useUser } from "../../../context/UserContext";
import { billStatusEnum, BillType, BillTypeEnum } from "../../../types/BillType";
import LoadingScreen from "../../common/LoadingScreen";
import { Search } from "lucide-react";
import config from '../../../config/config.ts';
import { toast } from "react-toastify";





type Params = {
  page?: number | 1;
  limit?: number | 10;
  search?: string | null;
  search_by?: string | null;
  min_price?: number | null;
  max_price?: number | null;
};
const url = config.API_URL;

function Invoice() {


  const navigate = useNavigate();
  const location = useLocation();

  const { user, isLoading } = useUser();
  const [isProductLoading, setIsLoading] = useState(false);

  const init = async (params: Params) => {
    setIsLoading(true);
    await fetchinvoice(params);
    setIsLoading(false);
  };

  // update invoice status
  const updateInvoiceStatus = async (id: number, status: string) => {
    setIsLoading(true);
    try {
      await fetch(`${url}bill/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`,
        },
        body: JSON.stringify({ status }),
      });
      toast.success('Cập nhật trạng thái hóa đơn thành công');
    } catch (error) {
      toast.error('Cập nhật trạng thái hóa đơn thất bại');
    }
    setIsLoading(false);
  };

  // auth
  const isFirstRender = useRef(true);
  // value
  // const [page, setPage] = useState(1);
  const [selectedBill, setSelectedBill] = useState<BillType | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const pricemin = useRef<HTMLInputElement | null>(null);
  const pricemax = useRef<HTMLInputElement | null>(null);
  const [lastpage, setLastPage] = useState(1);
  const [isShowUpdate, setIsShowUpdate] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<billStatusEnum>(billStatusEnum.PAID);
  const [params, setParams] = useState<Params>({
    page: 1,
    limit: 10,
    search: null,
    search_by: null,
    min_price: null,
    max_price: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [Bill, setBill] = useState<BillType[]>([]);


  // fetch

  const fetchinvoice = async (params: Params) => {
    // setIsLoading(true);
    const filteredParams: Record<string, string> = {};

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        filteredParams[key] = String(value);
      }
    });
    const queryParams = new URLSearchParams(filteredParams);
    const response = await fetch(`${url}bill?${queryParams}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error('Failed to fetch food');
    }
    setBill(data.data);
    setLastPage(data.lastpage);
  }



  // handle
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleDelete = async (id: number) => { };





  useEffect(() => {
    // Lấy giá trị từ URLSearchParams
    const searchParams = new URLSearchParams(location.search);

    // Lấy tất cả các giá trị trong URL và gán vào params
    const newParams: Params = {
      page: searchParams.has('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.has('items_per_page') ? Number(searchParams.get('items_per_page')) : 10,
      search: searchParams.get('search') || null,
      search_by: searchParams.get('search_by') === 'id' ? 'id' : null,
      min_price: searchParams.has('min_price') ? Number(searchParams.get('min_price')) : null,
      max_price: searchParams.has('max_price') ? Number(searchParams.get('max_price')) : null,
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

  useEffect(() => {
    console.log("Bill", Bill);
  }, [Bill]);


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
              search_by: 'id',
              min_price: pricemin.current?.value ? Number(pricemin.current.value) : null,
              max_price: pricemax.current?.value ? Number(pricemax.current.value) : null,
            });
          }}
        >
          <Form.Select
            defaultValue={params.search_by || 'id'}
            onChange={(e) => setParams({ ...params, search_by: e.target.value })}
            style={{ width: '150px' }}
          >

            <option value="id">Tên</option>
            <option value="description">Mô tả</option>
            <option value="code">Mã sản phẩm</option>
          </Form.Select>

          {/* category */}
          {/* <Form.Select
            value={params.category || ''}
            defaultValue={params.category || ''}
            onChange={(e) => setParams({ ...params, category: e.target.value })}
            style={{ width: '200px' }}
          >
            <option selected value="">Tất cả danh mục</option>
             {categorys.map(item => (
              <option key={item.id} value={item.id}>
                {item.id}
              </option>
            ))}
          </Form.Select> */}

          <Form.Control
            type="text"
            placeholder="Tìm kiếm sản phẩm"
            defaultValue={params.search || ''}
            ref={inputRef}
          />

          {/* giá min */}
          <Form.Control
            style={{ width: "300px" }}
            type="number"
            placeholder="Giá min"
            defaultValue={params.min_price || ''}
            ref={pricemin}
          />
          {/* giá max */}
          <Form.Control
            style={{ width: "300px" }}
            type="number"
            placeholder="Giá max"
            defaultValue={params.max_price || ''}
            ref={pricemax}
          />

          <Button variant="outline-secondary" type="submit">
            <Search size={16} />
          </Button>
        </Form>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <Button
            variant="primary"
            onClick={() => {
              // setParams({ ...params, page: 1 });
              navigate('/admin/invoice/table');
            }}
          >
            Thông tin bàn
          </Button>
        </div>
        {/* bảng dữ liệu */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ngày</th>
              <th>Tổng tiền</th>
              <th>Hình thức thanh toán</th>
              <th>Bàn</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {Bill.map((item, index) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{new Date(item.created_at).toLocaleDateString()}</td>
                <td>{item.totalPrice.toLocaleString()} đ</td>
                <td>{item.paymentMethod}</td>
                <td>{item.table.name}</td>
                {/* <td>{typeof item.table === 'object' && item.table !== null && 'id' in item.table ? (item.table as { id?: number | string }).id : ''}</td> */}
                <td>{item.status}</td>
                <td className="d-flex gap-2">
                  <Button variant="primary" onClick={() => {
                    setShowModal(true);
                    setSelectedBill(item);
                  }}>
                    Chi tiết
                  </Button>
                  <Button variant="danger" onClick={() => {
                    setIsShowUpdate(true);
                    setSelectedBill(item);
                    setUpdateStatus(item.status);
                  }}>Cập nhật</Button>
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
      <Chitiethoadon
        bill={selectedBill}
        show={showModal}
        handleClose={() => {
          setShowModal(false);
          setSelectedBill(null);
        }}
      />
      {/* cập nhập trạng thái hóa đơn */}
      <Modal show={isShowUpdate} onHide={() => setIsShowUpdate(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật trạng thái hóa đơn</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <p>Mã hóa đơn: {selectedBill?.id}</p>
          <p>Ngày lập: {new Date(selectedBill?.created_at || '').toLocaleString()}</p>
          <p>Tổng tiền: {selectedBill?.totalPrice.toLocaleString()} VND</p>
          <p>Hình thức thanh toán: {selectedBill?.paymentMethod}</p>
          <p>Trạng thái hiện tại: {selectedBill?.status}</p>

          <Form.Select
            // defaultValue={updateStatus}
            value={updateStatus}
            onChange={(e) => setUpdateStatus(e.target.value as billStatusEnum)}
          >
           {Object.values(billStatusEnum).map((status) => (
             <option key={status} value={status}>
               {status}
             </option>
           ))}  
          </Form.Select>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsShowUpdate(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() =>{
            if (selectedBill) {
              updateInvoiceStatus(selectedBill.id, updateStatus).finally(async () => {
                fetchinvoice(params);
              });
            };
            setIsShowUpdate(false); 
          }}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Invoice;






type Props = {
  bill?: BillType | null;
  show: boolean;
  handleClose: () => void;
}

export const Chitiethoadon: React.FC<Props> = ({ bill, show, handleClose }) => {
  if (!show) return null;
  if (!bill) return null;
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết hóa đơn</Modal.Title>
      </Modal.Header>
      <Modal.Body >
        <p>Mã hóa đơn: {bill.id}</p>
        <p>Ngày lập: {new Date(bill.created_at).toLocaleString()}</p>
        <p>Tổng tiền: {bill.totalPrice.toLocaleString()} VND</p>
        <p>Hình thức thanh toán: {bill.paymentMethod}</p>
        <p>Trạng thái: {bill.status}</p>
        <h5>Chi tiết đơn hàng:</h5>
        <Table>
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên món</th>
              <th>Số lượng</th>
              <th>Giá</th>
            </tr>
          </thead>
          <tbody>
            {bill.orderDetails && bill.orderDetails.map((item) => (
              <tr key={item.id}>
                <td>
                  <img src={`${url}${item.foodItem.image}`} alt={item.foodItem.name} style={{ width: "50px", height: "50px" }} />
                </td>
                <td>{item.foodItem.name}</td>
                <td>{item.quantity}</td>
                <td>{(item.quantity * item.foodItem.sell_price).toLocaleString()} VND</td>
              </tr>
            ))}
          </tbody>
        </Table>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>

      </Modal.Footer>
    </Modal>
  );
};
