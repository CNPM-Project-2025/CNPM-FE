import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Table } from "react-bootstrap";
import { useUser } from "../../../context/UserContext";
import { ImportType, ImportTypeEnum } from "../../../types/ImportType";
import LoadingScreen from "../../common/LoadingScreen";
import { Search } from "lucide-react";
import config from '../../../config/config.ts';


type Option = {
  label: string;
  value: ImportTypeEnum;
  disabled: boolean;
  selected: boolean;
};

function getStatusOptions(currentStatus: ImportTypeEnum): Option[] {
  return Object.entries(ImportTypeEnum).map(([key, value]) => {
    let disabled = false;
    let selected = value === currentStatus;

    if (currentStatus === ImportTypeEnum.REJECTED || currentStatus === ImportTypeEnum.COMPLETED) {
      disabled = true; // Không thao tác được gì
    } else if (currentStatus === ImportTypeEnum.PENDING && value === ImportTypeEnum.COMPLETED) {
      disabled = true; // Không cho hoàn thành nếu đang chờ duyệt
    } else if (currentStatus === ImportTypeEnum.APPROVED && value !== ImportTypeEnum.COMPLETED && value !== ImportTypeEnum.APPROVED) {
      disabled = true; // Đã duyệt thì chỉ cho chuyển sang hoàn thành
    }

    return {
      label: key,
      value: value as ImportTypeEnum,
      disabled,
      selected,
    };
  });
}


type Params = {
  page?: number | 1;
  limit?: number | 10;
  search?: string | null;
  search_by?: string | null;
  min_price?: number | null;
  max_price?: number | null;
  status?: ImportTypeEnum | null;
};

const url = config.API_URL;

function Import() {

  const navigate = useNavigate();
  const location = useLocation();

  const init = async (params: Params) => {
    setIsLoading(true);
    await fetchinvoice(params);
    setIsLoading(false);
  };

  // auth
  const isFirstRender = useRef(true);
  const { user, isLoading } = useUser();
  const [isProductLoading, setIsLoading] = useState(false);
  // value
  // const [page, setPage] = useState(1);
  const [selectedBill, setSelectedBill] = useState<ImportType | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const statusRef = useRef<HTMLSelectElement | null>(null);
  const pricemin = useRef<HTMLInputElement | null>(null);
  const pricemax = useRef<HTMLInputElement | null>(null);
  const [isShowTable, setIsShowTable] = useState(true);
  const [lastpage, setLastPage] = useState(1);
  const [isShowUpdate, setIsShowUpdate] = useState(false);
  const [params, setParams] = useState<Params>({
    page: 1,
    limit: 10,
    search: null,
    search_by: null,
    min_price: null,
    max_price: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [Bill, setBill] = useState<ImportType[]>([]);
  const [updateStatus, setUpdateStatus] = useState<ImportTypeEnum>(ImportTypeEnum.PENDING);

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
    const response = await fetch(`${url}purchase?${queryParams}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error('Failed to fetch food');
    }
    setBill(data.data);
    setLastPage(data.lastpage);
  }


  const fetchUpdateStatus = async (id: number, status: ImportTypeEnum) => {
    const response = await fetch(`${url}purchase/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.access_token}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error('Failed to update status');
    }
    alert('Cập nhật trạng thái thành công'); // Replace with a notification library if needed

  }


  // handle
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleUpdate = (item: ImportType) => {
    setIsShowUpdate(true);
    setSelectedBill(item);
    setUpdateStatus(item.status);
  }
  // const handleDelete = async (item: ) => { 
  //   const
  // };





  useEffect(() => {
    // Lấy giá trị từ URLSearchParams
    const searchParams = new URLSearchParams(location.search);

    // Lấy tất cả các giá trị trong URL và gán vào params
    const newParams: Params = {
      page: searchParams.has('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.has('limit') ? Number(searchParams.get('limit')) : 10,
      search: searchParams.get('search') || null,
      search_by: searchParams.get('search_by') === 'id' ? 'id' : null,
      min_price: searchParams.has('min_price') ? Number(searchParams.get('min_price')) : null,
      max_price: searchParams.has('max_price') ? Number(searchParams.get('max_price')) : null,
      status: searchParams.get('status') as ImportTypeEnum || null,
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
              status: selectRef.current?.value as ImportTypeEnum,
            });
          }}
        >
          {/* lọc theo trạng thái */}
          <Form.Select
              defaultValue={params.status || ''}
              onChange={(e) => setParams({ ...params, status: e.target.value as ImportTypeEnum })}
              style={{ width: '150px' }}
            >
              <option value="">Tất cả</option>
              <option value={ImportTypeEnum.PENDING}>PENDING</option>
              <option value={ImportTypeEnum.APPROVED}>APPROVED</option>
              <option value={ImportTypeEnum.COMPLETED}>COMPLETED</option>
              <option value={ImportTypeEnum.REJECTED}>REJECTED</option>
            </Form.Select>

          {/* lọc theo tên */}

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

        <div className="d-flex gap-3 align-items-center mb-3">
          <Button className="btn btn-primary" onClick={() => { navigate('/admin/import/create') }}>
            Tạo hóa đơn nhập hàng
          </Button>
        </div>
        {/* bảng dữ liệu */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ngày</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {Bill.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{new Date(item?.created_at).toLocaleDateString()}</td>
                <td>{item.status.toString()}</td>
                <td className="d-flex gap-2">
                  <Button variant="primary" onClick={() => {
                    setShowModal(true);
                    setSelectedBill(item);
                  }}>
                    Chi tiết
                  </Button>
                  <Button variant="danger" onClick={() => handleUpdate(item)}>
                    Cập nhật
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {/* phân trang */}
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
      <Modal show={isShowUpdate} onHide={() => setIsShowUpdate(false)} size="lg"  >
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết hóa đơn</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <p>Mã hóa đơn: {selectedBill?.id}</p>
          <p>Ngày lập: {selectedBill?.created_at ? new Date(selectedBill.created_at).toLocaleString() : "N/A"}</p>
          <p>Trạng thái hiện tại: {selectedBill?.status}</p>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select onChange={(e) => {
                setUpdateStatus(e.target.value as ImportTypeEnum);
              }}>
                {getStatusOptions(selectedBill?.status ?? ImportTypeEnum.PENDING).map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    // selected={opt.selected}

                    disabled={opt.disabled}
                  >
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>


          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" onClick={async () => {
            console.log("updateStatus", updateStatus);
            if (selectedBill && selectedBill.status !== updateStatus) {
              console.log("selectedBill.id", selectedBill.id);
              await fetchUpdateStatus(selectedBill.id, updateStatus);
              setIsShowUpdate(false);
              setSelectedBill(null);
              setUpdateStatus(ImportTypeEnum.PENDING);
              fetchinvoice(params);
            }
          }}>
            Cập nhật
          </Button>
          <Button variant="secondary" onClick={() => setIsShowUpdate(false)}>
            Đóng
          </Button>

        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default Import;


type Props = {
  bill?: ImportType | null;
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
        <p>Tổng tiền:  VND</p>
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
            {bill.purchaseOrderDetails && bill.purchaseOrderDetails.map((item) => (
              <tr key={item.id}>
                <td>
                  <img src={`${url}${item.product.image}`} alt={item.product.name} style={{ width: "50px", height: "50px" }} />
                </td>
                <td>{item.product.name}</td>
                <td>{item.quantity}</td>
                <td>{(item.quantity * item.product.sell_price).toLocaleString()} VND</td>
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

type DataTableProps = {
  data: ImportType[];
  setShowModal: (show: boolean) => void;
  setSelectedBill: (bill: ImportType | null) => void;
  handleDelete: (bill: ImportType) => void;
}

export const DsTable: React.FC<DataTableProps> = ({ data, setShowModal, setSelectedBill, handleDelete }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Ngày</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{new Date(item.created_at).toLocaleDateString()}</td>
            <td>{item.status}</td>
            <td className="d-flex gap-2">
              <Button variant="primary" onClick={() => {
                setShowModal(true);
                setSelectedBill(item);
              }}>
                Chi tiết
              </Button>
              <Button variant="danger" onClick={() => handleDelete(item)}>
                Cập nhật
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}