import React, { use, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Table } from "react-bootstrap";
import { useUser } from "../../../context/UserContext";
import { ImportType } from "../../../types/ImportType";
import LoadingScreen from "../../common/LoadingScreen";
import { Search } from "lucide-react";
import config from '../../../config/config.ts';
import { foodType, categoryType } from "../../../types/ProductTpye.ts";
import AdminSocketListener from './AdminSocketListener';

const url = config.API_URL;

interface cartType extends foodType {
    quantity: number;
    updatePrice: number;
};

export function ImportCreate() {

    const { user } = useUser();
    const [cart, setCart] = useState<cartType[]>([]);
    const navigate = useNavigate();

    const [food, setFood] = useState<foodType[]>([]);
    const [category, setCategory] = useState<categoryType[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number>(0);
    const [keyword, setKeyword] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [lastPage, setLastPage] = useState<number>(1);
    const [isLoadingProduct, setIsLoading] = useState<boolean>(false);
    const [isLoadingAdd, setIsLoadingAdd] = useState<boolean>(false);
    // fetch

    const fetchCreateImport = async () => {
        setIsLoadingAdd(true);
        const response = await fetch(`${url}purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.access_token}`,
            },
            body: JSON.stringify({
                details: cart.map((item) => ({
                    foodItemId: item.id,
                    quantity: item.quantity,
                    price: item.updatePrice,
                })),
            }),
        });
        const data = await response.json();
        setIsLoadingAdd(false);
        if (!response.ok) {
            throw new Error(data.message);
        }
        navigate('/admin/import');
    }

    const addtoCart = (item: foodType) => {
        const existingItem = cart.find((cartItem) => cartItem.id === item.id);
        if (existingItem) {
            setCart(cart.map((cartItem) =>
                cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
            ));
        } else {
            setCart([...cart, { ...item, quantity: 1, updatePrice: item.import_price }]);
        }
    }

    const fetchFood = async () => {
        setIsLoading(true);
        const response = await fetch(`${url}food?${selectedCategory !== 0 ? `category=${selectedCategory}` : ''}&page=${page}&search=${keyword}&search_by=name`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
        setFood(data.data);
        setLastPage(data.lastPage);
        console.log("lastPage", data.lastPage);
        setIsLoading(false);
    }

    const fetchCategory = async () => {
        setIsLoading(true);
        const response = await fetch(`${url}category`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
        setCategory(data.data);
        setIsLoading(false);
    }

    // useEffect(() => {

    useEffect(() => {
        fetchCategory();
        fetchFood();
    }, []);

    useEffect(() => {
        console.log("lastPage", lastPage);
    }, [lastPage]);

    useEffect(() => {
        console.log("data", food);
    }, [food]);

    useEffect(() => {
        console.log(selectedCategory);
        fetchFood();
    }, [selectedCategory, page, keyword]);

    // if (isLoadingProduct) {
    //     return <LoadingScreen />;
    // }

    return (
        <div className="w-100">
            <AdminSocketListener />
            <h1>Import Create</h1>
            <div className="d-flex alisgn-items-center mb-3 w-100">
                <div className="w-100 m-2">
                    <div className="d-flex align-items-center gap-2">
                        <Form>
                            <Form.Group controlId="category">
                                <Form.Select
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        setSelectedCategory(parseInt(e.target.value));

                                    }}
                                >
                                    <option value={0}>Tất cả</option>
                                    {category.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Form>
                        <div>
                            {/* xử lý submit */}
                            <Form className="d-flex gap-2 align-items-center"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const searchValue = (e.target as HTMLFormElement).search.value;
                                    console.log("searchValue", searchValue);
                                    setKeyword(searchValue);
                                    fetchFood();
                                }}
                            >
                                {/* thêm sự kiện submit */}

                                <Form.Group controlId="search">
                                    <Form.Control type="text" placeholder="Tìm kiếm sản phẩm" />
                                </Form.Group>
                                <Form.Group controlId="searchButton">
                                    <Button variant="primary" type="submit">
                                        <Search size={16} />
                                    </Button>
                                </Form.Group>
                            </Form>
                        </div>
                    </div>


                    <div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Hình ảnh</th>
                                    <th>ID</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Giá nhập</th>
                                    <th>Giá bán</th>
                                    <th>Số lượng</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {food.map((item, index) => (
                                    <tr key={item.id}>
                                        <td><img src={`${url}${item.image}`} alt={item.name} width="50" /></td>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.import_price}</td>
                                        <td>{item.sell_price}</td>
                                        <td>{item.stock}</td>
                                        <td>
                                            <div>
                                                <Button variant="primary" className="m-1" onClick={() => {
                                                    addtoCart(item);
                                                }}>
                                                    Thêm vào hóa đơn
                                                </Button>
                                                {/* <Button variant="secondary" className="m-1">
                                                Chi tiết
                                            </Button> */}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    <div>
                        {/* phân trang */}
                        <div className="d-flex justify-content-center align-items-center gap-2">
                            <Button variant="primary" disabled={page === 1} onClick={() => {
                                setPage(page - 1);
                            }}>
                                Trước
                            </Button>
                            <div>{page}</div>
                            <Button variant="primary" disabled={page === lastPage} onClick={() => {
                                setPage(page + 1);
                            }}>
                                Sau
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="bg-light d-flex flex-column" style={{ height: "calc(100vh - 150px)", width: "700px" }}>
                    <div className="overflow-y-scroll flex-grow-1">
                        {cart.map((item) => (
                            <div key={item.id} className="d-flex justify-content-between align-items-center border-bottom p-2 w-100">
                                <div className="d-flex align-items-center">
                                    <img src={`${url}${item.image}`} alt={item.name} width="50" className="me-2" />
                                    <div>
                                        <h5>{item.name}</h5>
                                        <div className="d-flex flex-column gap-2">
                                            <div className="d-flex gap-2">
                                                <div style={{ width: "80px" }}>Giá nhập</div>
                                                <input style={{ width: "200px" }} type="text" name="price" id="price" value={item.updatePrice} onChange={(e) => {
                                                    const newPrice = parseFloat(e.target.value);
                                                    if (!isNaN(newPrice)) {
                                                        setCart(cart.map((cartItem) =>
                                                            cartItem.id === item.id ? { ...cartItem, updatePrice: newPrice } : cartItem
                                                        ));
                                                    }
                                                }} />
                                            </div>
                                            <div className="d-flex gap-2">
                                                <div style={{ width: "80px" }}>Số lượng</div>
                                                <input style={{ width: "200px" }} type="text" name="quantity" id="quantity" value={item.quantity} onChange={(e) => {
                                                    const newQuantity = parseFloat(e.target.value);
                                                    if (!isNaN(newQuantity)) {
                                                        setCart(cart.map((cartItem) =>
                                                            cartItem.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem
                                                        ));
                                                    }
                                                }} />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <Button variant="danger" onClick={() => {
                                    setCart(cart.filter((cartItem) => cartItem.id !== item.id));
                                }}>
                                    Xóa
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="d-flex justify-content-center align-items-center p-2">
                        <Button variant="primary" onClick={() => {
                            fetchCreateImport();
                        }}>
                            {isLoadingAdd && <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>}
                            Tạo hóa đơn
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}