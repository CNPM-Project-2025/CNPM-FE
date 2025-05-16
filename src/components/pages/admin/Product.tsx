import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Table } from "react-bootstrap";
import { useUser } from "../../../context/UserContext";
import { foodType, categoryType } from "../../../types/ProductTpye";
import LoadingScreen from "../../common/LoadingScreen";
import { Search } from "lucide-react";
import config from '../../../config/config.ts';
import { toast } from "react-toastify";

type createFoodType = {
  name: string;
  description: string;
  sell_price: number;
  import_price: number;
  status: number;
  stock: number;
  categoryId: number;
}

type Params = {
  page?: number | 1;
  items_per_page?: number | 10;
  search?: string | null;
  search_by?: string | null;
  category?: string | null;
  min_price?: number | null;
  max_price?: number | null;
};

const url = config.API_URL;

function Product() {

  const navigate = useNavigate();
  const location = useLocation();

  const init = async (params: Params) => {
    setIsLoading(true);
    await fetchallFood(params);
    await fetchCategory();
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
  const [params, setParams] = useState<Params>({
    page: 1,
    items_per_page: 10,
    search: null,
    search_by: null,
    category: null,
    min_price: null,
    max_price: null,
  });
  const [allFood, setAllFood] = useState<foodType[]>([]);
  const [categorys, setCategorys] = useState<categoryType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [createFood, setCreateFood] = useState<createFoodType>({
    name: '',
    description: '',
    sell_price: 0,
    import_price: 0,
    status: 1,
    stock: 0,
    categoryId: 0,
  });

  const [isShowUpdate, setIsShowUpdate] = useState(false);
  const [UpdateProduct, setUpdateProduct] = useState<foodType | null>(null);

  // fetch

  const fetchCategory = async () => {
    const response = await fetch(`${url}category`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.access_token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      setCategorys(data.data);
      console.log('Lấy danh sách danh mục thành công:', data.data);
    } else {
      alert('Lấy danh sách danh mục không thành công!');
    }
  }

  const fetchallFood = async (params: Params) => {
    // Gửi post loginForm lên server

    const filteredParams: Record<string, string> = {};

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        filteredParams[key] = String(value);
      }
    });

    const queryParams = new URLSearchParams(filteredParams);
    const response = await fetch(`${url}food?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.access_token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      setAllFood(data.data);
      setLastPage(data.lastPage);
      // setPage(data.currentPage);
      console.log('Lấy danh sách sản phẩm thành công:', allFood);
      return data;
    } else {
      alert('Lấy danh sách sản phẩm không thành công!');
    }
  }

  const fetchaddFood = async (createFood: createFoodType) => {
    // Gửi post loginForm lên server
    const response = await fetch(`${url}food`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.access_token}`,
      },
      body: JSON.stringify(createFood),
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Thêm sản phẩm thành công:', data);
      // setAllFood([data]);
      fetchallFood(params);
      return data;
    } else {
      alert('Thêm sản phẩm không thành công!');
    }
  }

  const fetchaddimg = async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('imageFood', file);

    const response = await fetch(`${url}food/${id}/upload-image-food`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user?.access_token}`,
      },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Hình ảnh đã được thêm thành công:', data);
      return data;
    } else {
      alert('Thêm hình ảnh không thành công!');
    }
  }

  const fetchUpdateProduct = async (food: foodType) => {
    // Gửi post loginForm lên server
    const response = await fetch(`${url}food/${food.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.access_token}`,
      },
      body: JSON.stringify(food),
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Cập nhật sản phẩm thành công:', data);
      return data;
    } else {
      alert('Cập nhật sản phẩm không thành công!');
    }
  };




  // handle
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleEdit = (food: foodType) => {
    setUpdateProduct(food);
    setIsShowUpdate(true);
  };
  const handleDelete = async (id: number) => { };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCreateFood(prev => ({
      ...prev,
      [name]: name === 'sell_price' || name === 'import_price' || name === 'stock' || name === 'category_id' || name === 'status'
        ? Number(value)
        : value
    }));
  };

  const handleChangeUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdateProduct(prev => {
      if (!prev) return prev;
      let newValue: any = value;
      if (name === 'sell_price' || name === 'import_price' || name === 'stock' || name === 'status') {
        newValue = Number(value);
      }
      if (name === 'categoryId') {
        // update category object if categoryId changes
        const selectedCategory = categorys.find(cat => cat.id === Number(value));
        return {
          ...prev,
          category: selectedCategory ? selectedCategory : prev.category,
          categoryId: Number(value),
        };
      }
      return {
        ...prev,
        [name]: newValue,
      };
    });
  };

  const handleUpdate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (!UpdateProduct) {
      toast.error("Sản phẩm không hợp lệ");
      return;
    }
    if (imageFile) {
      await fetchaddimg(UpdateProduct.id, imageFile);
    }

    const data = await fetchUpdateProduct(UpdateProduct);
    if (data) {
      toast.success("Cập nhật sản phẩm thành công");
      await fetchallFood(params);
    }
    setIsLoading(false);
    setIsShowUpdate(false);
  };

  const handleAdd = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: call API to create product
    console.log("Sản phẩm mới:", createFood);
    const data = await fetchaddFood(createFood);
    if (imageFile) {
      await fetchaddimg(data.id, imageFile);
    }
    await fetchallFood(params);
    setIsLoading(false);
    handleClose(); // đóng modal sau khi thêm
    setCreateFood({
      name: '',
      description: '',
      sell_price: 0,
      import_price: 0,
      status: 1,
      stock: 0,
      categoryId: 0,
    });
  };

  useEffect(() => {
    // Lấy giá trị từ URLSearchParams
    const searchParams = new URLSearchParams(location.search);

    // Lấy tất cả các giá trị trong URL và gán vào params
    const newParams: Params = {
      page: searchParams.has('page') ? Number(searchParams.get('page')) : 1,
      items_per_page: searchParams.has('items_per_page') ? Number(searchParams.get('items_per_page')) : 10,
      search: searchParams.get('search') || null,
      search_by: searchParams.get('search_by') === 'name' ? 'name' : null,
      category: searchParams.get('category') || null,
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
    console.log("allFood", allFood);
  }, [allFood]);

  useEffect(() => {
    console.log("categorys", categorys);
  }, [categorys]);

  if (isLoading || isProductLoading) {
    return <LoadingScreen></LoadingScreen>;
  }

  return (
    <div>
      <h1>Product</h1>

      <div>
        <Form
          className="d-flex gap-2 mb-3"
          onSubmit={(e) => {
            e.preventDefault();
            setParams({
              ...params,
              page: 1,
              search: inputRef.current?.value,
              search_by: 'name',
              min_price: pricemin.current?.value ? Number(pricemin.current.value) : null,
              max_price: pricemax.current?.value ? Number(pricemax.current.value) : null,
            });
          }}
        >
          <Form.Select
            defaultValue={params.search_by || 'name'}
            onChange={(e) => setParams({ ...params, search_by: e.target.value })}
            style={{ width: '150px' }}
          >

            <option value="name">Tên</option>
            <option value="description">Mô tả</option>
            <option value="code">Mã sản phẩm</option>
          </Form.Select>

          {/* category */}
          <Form.Select
            value={params.category || ''}
            defaultValue={params.category || ''}
            onChange={(e) => setParams({ ...params, category: e.target.value })}
            style={{ width: '200px' }}
          >
            <option selected value="">Tất cả danh mục</option>
            {categorys.map(item => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Form.Select>

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

      </div>

      <div className="d-flex gap-3 align-items-center mb-3">
        <Button onClick={handleShow}>
          Thêm sản phẩm
        </Button>

        <Button onClick={() => { navigate('/admin/category') }}>
          Thông tin danh mục
        </Button>
      </div>


      {/* bảng dữ liệu */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>ID</th>
            <th>Tên</th>
            <th>Giá bán</th>
            <th>Giá nhập</th>
            <th>Ngày tạo</th>
            <th>Mô tả</th>
            <th>Số lượng</th>
            <th>Danh mục</th>
            <th>Trạng thái</th>
            <th style={{ width: '130px' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {allFood.map((food, index) => (
            <tr key={food.id}>
              <td><img className="img-thumbnail" style={{ width: "50px", height: "50px" }} src={`${url}${food.image}`} alt={food.name} /></td>
              <td>{food.id}</td>
              <td>{food.name}</td>
              <td>{food.sell_price.toLocaleString()}₫</td>
              <td>{food.import_price.toLocaleString()}₫</td>
              <td>{new Date(food.created_at).toLocaleDateString()}</td>
              <td>{food.description}</td>
              <td>{food.stock}</td>
              <td>{food.category.name}</td>
              <td>{food.status === 1 ? "Đang bán" : "Ngừng bán"}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <div className="d-flex gap-2">
                  <Button variant="warning" size="sm" onClick={() => handleEdit(food)}>
                    Sửa
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(food.id)}>
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

      {/* Modal thêm sản phẩm */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm sản phẩm mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên sản phẩm</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={createFood.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={createFood.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Hình ảnh</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    setImageFile(file);
                    console.log("File hình đã chọn:", file);
                  }
                }}
              />
            </Form.Group>


            <Form.Group className="mb-3">
              <Form.Label>Giá bán</Form.Label>
              <Form.Control
                type="number"
                name="sell_price"
                value={createFood.sell_price}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Giá nhập</Form.Label>
              <Form.Control
                type="number"
                name="import_price"
                value={createFood.import_price}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Danh mục</Form.Label>
              <Form.Select
                name="categoryId"
                value={createFood.categoryId}
                onChange={handleChange}
              >
                <option value="">Chọn danh mục</option>
                {categorys.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                name="status"
                value={createFood.status}
                onChange={handleChange}
              >
                <option value={1}>Đang bán</option>
                <option value={0}>Ngừng bán</option>
              </Form.Select>
            </Form.Group>

            {/* select */}

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal sửa sản phẩm */}
      <Modal show={isShowUpdate} onHide={() => setIsShowUpdate(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên sản phẩm</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={UpdateProduct?.name}
                onChange={handleChangeUpdate}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={UpdateProduct?.description}
                onChange={handleChangeUpdate}
              />
            </Form.Group>

            {/* img */}
            <Form.Group className="mb-3 d-flex gap-2">
              {UpdateProduct?.image && (
                <img
                  className="img-thumbnail mt-2"
                  style={{ width: "auto", height: "80px" }}
                  src={`${url}${UpdateProduct.image}`}
                  alt={UpdateProduct.name}
                />
              )}
              <div>
                <Form.Label>Hình ảnh</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      setImageFile(file);
                      console.log("File hình đã chọn:", file);
                    }
                  }}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Giá bán</Form.Label>
              <Form.Control
                type="text"
                name="sell_price"
                value={UpdateProduct?.sell_price}
                onChange={handleChangeUpdate}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Giá nhập</Form.Label>
              <Form.Control
                type="text"
                name="import_price"
                value={UpdateProduct?.import_price}
                onChange={handleChangeUpdate}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Danh mục</Form.Label>
              <Form.Select
                name="categoryId"
                value={UpdateProduct?.category.id}
                onChange={handleChangeUpdate}
              >
                {categorys.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                name="status"
                value={UpdateProduct?.status}
                onChange={handleChangeUpdate}
              >
                <option value={1}>Đang bán</option>
                <option value={0}>Ngừng bán</option>
              </Form.Select>
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsShowUpdate(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default Product;
