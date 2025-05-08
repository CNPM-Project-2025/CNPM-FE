import { useEffect, useState } from "react";
import { Button, Modal, Form, Table } from "react-bootstrap";
import { useUser } from "../../../context/UserContext";
import { foodType } from "../../../types/ProductTpye";

import LoadingScreen from "../../common/LoadingScreen";

type createFoodType = {
  name: string;
  description: string;
  sell_price: number;
  import_price: number;
  status: number;
  stock: number;
  category_id: number;
}

function Product() {
  
  
  const init = async () => {
    setIsLoading(true);
    await fetchallFood();
    setIsLoading(false);
  };

  // auth
  const { user, isLoading } = useUser();
  const [isProductLoading, setIsLoading] = useState(false);
  // value
  const [allFood, setAllFood] = useState<foodType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [createFood, setCreateFood] = useState<createFoodType>({
    name: '',
    description: '',
    sell_price: 0,
    import_price: 0,
    status: 1,
    stock: 0,
    category_id: 0,
  });


  // fetch
  const fetchallFood = async () => {
    // Gửi post loginForm lên server
    const response = await fetch('http://localhost:9999/food', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.access_token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      setAllFood(data.data);
      console.log('Lấy danh sách sản phẩm thành công:', allFood);
      return data;
    } else {
      alert('Lấy danh sách sản phẩm không thành công!');
    }
  }

  const fetchaddFood = async (createFood: createFoodType) => {
    // Gửi post loginForm lên server
    const response = await fetch('http://localhost:9999/food', {
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
      setAllFood([data]);
      return data;
    } else {
      alert('Thêm sản phẩm không thành công!');
    }
  }

  const fetchaddimg = async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('imageFood', file);

    const response = await fetch(`http://localhost:9999/food/${id}/upload-image-food`, {
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





  // handle
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleEdit = (food: foodType) => {};
  const handleDelete = async (id: number) => {};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCreateFood(prev => ({
      ...prev,
      [name]: name === 'sell_price' || name === 'import_price' || name === 'stock' || name === 'category_id' || name === 'status'
        ? Number(value)
        : value
    }));
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
    setIsLoading(false);
    handleClose(); // đóng modal sau khi thêm
    setCreateFood({
      name: '',
      description: '',
      sell_price: 0,
      import_price: 0,
      status: 1,
      stock: 0,
      category_id: 0,
    });
  };
  
  useEffect(() => {
    init();
  }, []);

  if (isLoading || isProductLoading) {
    return <LoadingScreen></LoadingScreen>;
  }

  return (
    <div>
      <h1>Product</h1>
      <Button onClick={handleShow}>
        Thêm sản phẩm
      </Button>
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
              <td><img className="img-thumbnail" src={food.image} alt={food.name} /></td>
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

            <Form.Group className="mb-3">
              <Form.Label>Số lượng trong kho</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={createFood.stock}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Danh mục (ID)</Form.Label>
              <Form.Control
                type="number"
                name="category_id"
                value={createFood.category_id}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Product;
