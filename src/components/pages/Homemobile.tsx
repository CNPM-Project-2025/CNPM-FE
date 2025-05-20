import { Home, HomeIcon, LucideShoppingCart, X, Search, Phone } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react';
import { categoryType, foodType } from '../../types/ProductTpye';
import { CartItem, useCart } from '../../hooks/useCart.tsx';
import { Button, Modal } from 'react-bootstrap';
import '../../assets/styles/HomeMobile.css';
import config from '../../config/config.ts';
import { SyncLoader } from 'react-spinners';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { TableType } from './admin/Table.tsx';
import socket from '../../socket.ts';
// import 'react-toastify/dist/ReactToastify.css';

function HomeMobile() {
    const url = config.API_URL;
    const { cart, addToCart, increaseQuantity, decreaseQuantity, getTotalPrice, isLoading, getProductById } = useCart();
    const [category, setCategory] = useState<categoryType[]>([]);
    const [food, setFood] = useState<foodType[]>([]);
    const [ishowModal, setShowModal] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState<number>(1);
    const [lastPage, setLastPage] = useState<number>(1);
    const [selectedCategory, setSelectedCategory] = useState<number>(0);
    const [isLoadingProduct, setIsLoadingProduct] = useState<boolean>(false);
    const [isShowModal, setIsShowModal] = useState(false);
    const [selectfood, setSelectFood] = useState<foodType | null>(null);
    const [socketupdate, setSocketUpdate] = useState(false);
    const navigate = useNavigate();

    const tableId = useParams().tableId;
    const [Table, setTable] = useState<TableType | null>(null);
    // Fetch categories

    const fetchTable = async () => {
        try {
            const response = await fetch(`${url}table/${tableId}`);
            if (!response.ok) {
                toast.error('Không tìm thấy bàn');
                throw new Error('Failed to fetch table');
            }

            const data = await response.json();
            setTable(data);
        } catch (error) {
            console.error('Error fetching table:', error);
        }
    }

    const fetchCategory = async () => {
        try {
            const response = await fetch(`${url}category`);
            if (!response.ok) throw new Error('Failed to fetch category');
            const data = await response.json();
            setCategory(data.data);
            // Set initial category if available
            if (data.data.length > 0 && selectedCategory === 0) {
                setSelectedCategory(data.data[0].id);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);

        }
    };

    // Fetch food items
    const fetchFood = async (categoryId: number, keyword: string, pageNum: number = 1) => {
        console.log('fetch food 1', categoryId, keyword, pageNum);

        if (!categoryId) return;
        console.log('fetch food', categoryId, keyword, pageNum);
        setIsLoadingProduct(true);
        try {
            const response = await fetch(
                `${url}food?page=${pageNum}&search=${keyword}&search_by=name&category=${categoryId}`
            );
            if (!response.ok) throw new Error('Failed to fetch food');
            const data = await response.json();
            setLastPage(parseInt(data.lastPage));
            if (pageNum === 1) {
                setFood(data.data);
            } else {
                setFood(prev => [...prev, ...data.data]);
            }
            await new Promise(resolve => setTimeout(resolve, 800));
        } catch (error) {
            console.error('Error fetching food:', error);
        } finally {
            setIsLoadingProduct(false);
        }
    };

    // Handle scroll for infinite loading
    const handleScroll = useCallback(() => {
        const nearBottom =
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
        if (nearBottom && page < lastPage && !isLoadingProduct) {
            setPage(prev => prev + 1);
        }
    }, [page, lastPage, isLoadingProduct]);

    //call staff
    const handleCallStaff = () => {
        if (!Table?.id) {
            toast.error('Không xác định được bàn.');
            return;
        }
        fetch(`${url}call-admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tableId: Table.id }),
        })
            .then(response => {
                if (!response.ok) throw new Error('Gọi nhân viên thất bại');
                toast.success('Đã gọi nhân viên, vui lòng chờ!');
            })
            .catch(error => {
                console.error('Error calling admin:', error);
                toast.error('Gọi nhân viên thất bại');
            });
    };

    // Consolidated useEffect hooks
    useEffect(() => {
        fetchTable();
        fetchCategory();
    }, []);

    useEffect(() => {
        if (selectedCategory !== 0) {
            setPage(1);
            fetchFood(selectedCategory, keyword, 1);
            if (socketupdate) {
                setSocketUpdate(false);
            }
        }
    }, [selectedCategory, keyword, socketupdate]);

    useEffect(() => {
        if (page > 1 && selectedCategory !== 0) {
            fetchFood(selectedCategory, keyword, page);
        }
    }, [page]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on('food_updated', (data: any) => {
            console.log('Food updated:', selectedCategory, keyword, page);
            console.log('Food updated ksjkjd:', data);
            setSocketUpdate(true);
            // fetchFood(3, keyword, page);
        });

        return () => {
            socket.off('connect');
            socket.off('food_updated');
        };
    }, []);
    // useEffect(() => {
    //     if (ishowModal) {
    //         document.body.style.overflow = 'hidden';
    //     } else {
    //         document.body.style.overflow = 'auto';
    //     }
    //     return () => {
    //         document.body.style.overflow = 'auto';
    //     };
    // }, [ishowModal]);

    // Event handlers
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setPage(1);
        fetchFood(selectedCategory, keyword);
    };

    const handleThanhtoan = (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        console.log('click thanhtoan');
        // chuyển sang trang thanh toán
        navigate('/thanh-toan', {
            state: {
                // cart: cart,
                Table: Table,
            }
        });

    };

    const handleClickBuy = (item: foodType, event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        addToCart(item);

    };

    const handleClickItem = (item:foodType, event: React.MouseEvent) => {
        console.log('click item', item);
        event.stopPropagation();
        setSelectFood(item);
        // if (item.stock > 0) {
        //     addToCart(item);
        //     setSelectFood(getProductById(item.id));
        // }
        setIsShowModal(true);
    };

    const handleClickCategory = (id: number) => {
        setSelectedCategory(id);
        setPage(1);
    };

    if (isLoading) {
        return <div className='loading'>Loading...</div>;
    }

    return (
        <div className='home'>
            <div className='container-home'>
                <div>
                    <form onSubmit={handleSubmit} className='w-100 d-flex align-items-center gap-2'>
                        <input
                            className='flex-grow-1 border-0 rounded'
                            type="text"
                            placeholder='search'
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button type="submit"><Search /></button>
                    </form>
                    <div className='home-info'>
                        <div className='d-flex align-items-center gap-2'>
                            <HomeIcon />
                            <div>
                                Bạn đang ngồi bàn
                                <span> {Table?.name}</span>
                            </div>
                        </div>
                        <button style={{ border: "1px solid chocolate", borderRadius: "5px" }} className='p-1'
                        onClick={handleCallStaff} >
                            <div className='d-flex align-items-center gap-2'>
                                <Phone color='chocolate' />
                                Gọi nhân viên
                            </div>
                        </button>

                    </div>

                </div>
                <div className='doanhmuc-list'>
                    {category.map((item, i) => (
                        <button key={i} onClick={() => handleClickCategory(item.id)}>
                            <div className={`doanhmuc-item${selectedCategory === item.id ? ' active-item' : ''}`}>
                                <img src={`${url}${item.image}`} alt="" />
                                <div className={`doanhmuc-item-name${selectedCategory === item.id ? ' active-name' : ''}`}>
                                    {item.name}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
                <div>
                    {food && (
                        <div className='home-content-list'>
                            {food.map((item, i) => (
                                <div
                                    className='home-content-item'
                                    key={i}
                                    onClick={(e) => handleClickItem(item, e)}
                                >
                                    <div>
                                        <img src={`${url}${item.image}`} alt="" />
                                    </div>
                                    <div className='home-content-item-name'>
                                        {item.name}
                                    </div>
                                    <div className='price-icon'>
                                        <div className='home-content-item-price'>
                                            {item.sell_price.toLocaleString()}
                                        </div>
                                        <button
                                            onClick={(e) => handleClickBuy(item, e)}
                                            className='home-content-item-icon'
                                        >
                                            <LucideShoppingCart />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {isLoadingProduct && (
                        <div className='w-100 d-flex justify-content-center align-items-center p-3'>
                            <SyncLoader
                                className='p-1'
                                color="chocolate"
                                size={10}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className='cart'>
                <div className="cart-bar" onClick={() => setShowModal(!ishowModal)}>
                    <span>🛒 {cart.length} sản phẩm</span>
                    <button onClick={(e) => handleThanhtoan(e)}>Thanh Toán</button>
                </div>
                {ishowModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className='modal-cart' onClick={(e) => e.stopPropagation()}>
                            <div className='cart-detail'>
                                <div className='header-cart d-flex'>
                                    <div style={{ flex: 1 }}>Xóa tất cả</div>
                                    <div className='d-flex justify-content-center align-items-center' style={{ flex: 1 }}>
                                        Giỏ hàng
                                    </div>
                                    <button
                                        className='d-flex justify-content-end align-items-center'
                                        style={{ flex: 1 }}
                                        onClick={() => setShowModal(false)}
                                    >
                                        <div><X /></div>
                                    </button>
                                </div>
                                <div className='d-flex flex-column gap-2 flex-grow-1 overflow-auto'>
                                    {cart.map((item, i) => (
                                        <div key={i} className='cart-detail-item'>
                                            <div>
                                                <img
                                                    style={{ width: "60px", height: "60px" }}
                                                    src={`${url}${item.image}`}
                                                    alt=""
                                                />
                                            </div>
                                            <div className='d-flex flex-column justify-content-center align-items-start' style={{ flex: 1 }}>
                                                <div className='cart-detail-item-name'>{item.name}</div>
                                                <div className='d-flex justify-content-between align-items-center w-100'>
                                                    <div className='d-flex justify-content-center align-items-center gap-3'>
                                                        <button
                                                            onClick={() => decreaseQuantity(item.id)}
                                                            className='cart-detail-item-icon'
                                                        >
                                                            -
                                                        </button>
                                                        <span className='cart-detail-item-quantity'>
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => increaseQuantity(item.id)}
                                                            className='cart-detail-item-icon'
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <div className='cart-detail-item-price'>
                                                        {item.sell_price.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div>Total</div>
                                    <div>{getTotalPrice().toLocaleString()} VNĐ</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* modal chi tiết sản phẩm */}
            {/* <Modal show={isShowModal} onHide={() => setIsShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectfood?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img
                        style={{ width: "100%", height: "auto" }}
                        src={`${url}${selectfood?.image}`}
                        alt=""
                    />
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className='cart-detail-item-name'>{selectfood?.name}</div>
                        <div className='cart-detail-item-price'>
                            {selectfood?.sell_price.toLocaleString()}
                        </div>
                    </div>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className='d-flex justify-content-center align-items-center gap-3'>
                            <button
                                onClick={() => decreaseQuantity(selectfood?.id)}
                                className='cart-detail-item-icon'
                            >
                                -
                            </button>
                            <span className='cart-detail-item-quantity'>
                                {selectfood?.quantity}
                            </span>
                            <button
                                onClick={() => increaseQuantity(selectfood?.id)}
                                className='cart-detail-item-icon'
                            >
                                +
                            </button>
                        </div>
                        <div className='cart-detail-item-price'>
                            {selectfood?.sell_price.toLocaleString()}
                        </div>
                    </div>
                    <div className='cart-detail-item-description'>
                        {selectfood?.description}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setIsShowModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={() => handleClickBuy(selectfood, event)}>
                        Thêm vào giỏ hàng
                    </Button>
                </Modal.Footer> 

            </Modal> */}
        </div>
    );
}

export default HomeMobile;

