import { Home, HomeIcon, LucideShoppingCart, X, Search } from 'lucide-react'
import { useEffect, useState } from 'react';
import { categoryType, foodType } from '../../types/ProductTpye';
import { useCart } from '../../hooks/useCart.tsx';
import { Button } from 'react-bootstrap';


import '../../assets/styles/HomeMobile.css';
import config from '../../config/config.ts';
import { SyncLoader } from 'react-spinners';


function HomeMobile() {


    const url = config.API_URL;
    // var
    const { cart, addToCart, increaseQuantity, decreaseQuantity, getTotalPrice, isLoading } = useCart();
    const [category, setCategory] = useState<categoryType[]>([]);
    const [food, setFood] = useState<foodType[]>([]);
    const [ishowModal, setShowModal] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<number>(0);
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);
    // fetch

    const handleScroll = () => {
        const nearBottom =
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
        if (nearBottom) {
            fetchMore(selectedCategory, keyword);
            if (page < lastPage) {
            setPage((prevPage) => prevPage + 1);
            }
        }
    };

    const fetchCategory = async () => {
        const response = await fetch(`${url}category`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error('Failed to fetch category');
        }
        setCategory(data.data);
    };

    const fetchFood = async (categoryId: number, keyword: string) => {
        setIsLoadingProduct(true);
        const response = await fetch(`${url}food?page=1&search=${keyword}&search_by=name&category=${categoryId}`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error('Failed to fetch food');
        }
        setLastPage(data.lastpage);
        setFood(data.data);
        // delay 0.8s
        await new Promise((resolve) => setTimeout(resolve, 800));
        setIsLoadingProduct(false);
    }

    const fetchMore = async (categoryId: number, keyword: string) => {
        setIsLoadingProduct(true);
        const response = await fetch(`${url}food?page=${page}&search=${keyword}&search_by=name&category=${categoryId}`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error('Failed to fetch food');
        }
        setLastPage(data.lastpage);
        setFood(prevFood => [...prevFood, ...data.data]);
        // delay 0.8s
        await new Promise((resolve) => setTimeout(resolve, 800));
        setIsLoadingProduct(false);
    }


    // usseEffect
    useEffect(() => {
        fetchCategory();
    }, []);

    useEffect(() => {
        if (category.length > 0) {
            fetchFood(selectedCategory, keyword);
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [selectedCategory, page]);

    useEffect(() => {
        console.log('food', food);
    }, [food]);

    // useEffect(() => {
    //     if (ishowModal) {
    //         document.body.style.overflow = 'hidden'; // chặn cuộn
    //     } else {
    //         document.body.style.overflow = 'auto';   // cho cuộn lại
    //     }

    //     return () => {
    //         document.body.style.overflow = 'auto';   // đảm bảo luôn reset
    //     };
    // }, [ishowModal]);

    // useEffect(() => {
    //     console.log('category', category);
    // }, [category]);
    // // handle

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // console.log('submit', keyword);
        fetchFood(selectedCategory, keyword);
        console.log('keyword', keyword);
    }

    const handleThanhtoan = (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        console.log('click thanhtoan');
    }

    const handleClickBuy = (item: foodType, event: React.MouseEvent) => {
        // chặn sự kiện cha 
        event.stopPropagation();
        event.preventDefault();
        // console.log('click buy', id);
        addToCart(item);
    }

    const handleClickItem = (id: String, event: React.MouseEvent) => {
        // chặn sự kiện mặc định
        // event.preventDefault();
        console.log('click item', id);
    }

    const handleClickCategory = (id: number) => {
        setSelectedCategory(id);
        // console.log('click category', id);
        // fetchFood(id, keyword);
    }

    if (isLoading) {
        return <div className='loading'>Loading...</div>
    }

    return (
        <div className='home'>
            {/* <div className='home-header'>
                <input type="text" placeholder='search ' />
            </div> */}
            <div className='container-home'>
                <div>
                    <div>
                        {/* tạo một Form */}
                        <form onSubmit={handleSubmit} className='w-100 d-flex align-items-center gap-2'>
                            <input className='flex-grow-1 border-0 rounded' type="text" placeholder='search' value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                            <button type="submit"><Search /></button>
                        </form>
                        {/* <input className='home-search' type="text" placeholder='search' /> */}
                    </div>
                    <div className='home-info'>
                        <HomeIcon></HomeIcon>
                        <div>
                            Bạn đang ngồi bàn
                            <span> Bàn 49</span>
                        </div>
                    </div>
                </div>
                <div className='doanhmuc-list'>
                    {category.map((item, i) => (
                        <button key={i} onClick={() => { handleClickCategory(item.id) }}>
                            <div className={`doanhmuc-item${selectedCategory === item.id ? ' active-item' : ''}`}>
                                <img src={`${url}${item.image}`} alt="" />
                                <div className={`doanhmuc-item-name${selectedCategory === item.id ? ' active-name' : ''}`}>{item.name}</div>
                            </div>
                        </button>
                    ))}
                </div>
                <div>
                    {food && (
                        <div className='home-content-list'>
                            {food.map((item, i) => (
                                <div className='home-content-item' key={i} onClick={(e) => handleClickItem(`${i + 1}`, e)}>
                                    <div>
                                        <img src={`${url}${item.image}`} alt="" />
                                    </div>
                                    <div className='home-content-item-name'>
                                        {item.name}
                                    </div>
                                    <div className='price-icon' >
                                        <div className='home-content-item-price'>{item.sell_price.toLocaleString()}</div>
                                        <button onClick={(e) => { handleClickBuy(item, e) }} className='home-content-item-icon'>
                                            <LucideShoppingCart></LucideShoppingCart>
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
                    <button onClick={(e) => { handleThanhtoan(e) }}>Thanh Toán</button>
                </div>
                {/* tạo modal hiển thị chi tiết */}
                {ishowModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className='modal-cart' onClick={(e) => e.stopPropagation()}>
                            <div className='cart-detail'>
                                <div className='header-cart d-flex '>
                                    <div style={{ flex: 1 }}>Xóa tất cả</div>
                                    <div className='d-flex justify-content-center align-items-center' style={{ flex: 1 }}>Giỏ hàng</div>
                                    <button className='d-flex justify-content-end align-items-center' style={{ flex: 1 }}
                                        onClick={() => setShowModal(false)}>
                                        <div ><X /></div>
                                    </button>
                                </div>
                                <div className='d-flex flex-column gap-2 flex-grow-1 overflow-auto'>
                                    {cart.map((item, i) => (
                                        <div key={i} className='cart-detail-item'>
                                            <div>
                                                <img style={{ width: "60px", height: "60px" }} src={`${url}${item.image}`} alt="" />
                                            </div>
                                            <div className='d-flex flex-column justify-content-center align-items-start' style={{ flex: 1 }}>
                                                <div className='cart-detail-item-name'>{item.name}</div>
                                                <div className='d-flex justify-content-between align-items-center w-100'>
                                                    <div className='d-flex justify-content-center align-items-center gap-3'>
                                                        <button onClick={() => decreaseQuantity(item.id)} className='cart-detail-item-icon'>-</button>
                                                        <span className='cart-detail-item-quantity'>{item.quantity}</span>
                                                        <button onClick={() => increaseQuantity(item.id)} className='cart-detail-item-icon'>+</button>
                                                    </div>
                                                    <div className='cart-detail-item-price'>{item.sell_price.toLocaleString()}</div>
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

        </div>
    );
}

export default HomeMobile;