import { Home, HomeIcon, LucideShoppingCart, X } from 'lucide-react'
import { useEffect, useState } from 'react';
import { categoryType, foodType } from '../../types/ProductTpye';
import { useCart } from '../../hooks/useCart.tsx';
import '../../assets/styles/HomeMobile.css';
import { Button } from 'react-bootstrap';



function HomeMobile() {


    const url = 'http://192.168.16.92:9999/';
    // var
    const { cart, addToCart, increaseQuantity, decreaseQuantity, getTotalPrice , isLoading} = useCart();
    const [category, setCategory] = useState<categoryType[]>([]);
    const [food, setFood] = useState<foodType[]>([]);
    const [ishowModal, setShowModal] = useState(false);
    // fetch


    const fetchCategory = async () => {
        const response = await fetch(`${url}category`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error('Failed to fetch category');
        }
        setCategory(data.data);
    };

    const fetchFood = async (categoryId: number) => {
        const response = await fetch(`${url}food/category/${categoryId}`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error('Failed to fetch food');
        }
        setFood(data.data);
    }


    // usseEffect
    useEffect(() => {
        fetchCategory();
    }, []);

    useEffect(() => {
        if (category.length > 0) {
            fetchFood(category[0].id);
        }
    }, [category]);

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
        console.log('click category', id);
        fetchFood(id)
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
                        <input type="text" placeholder='search'/>
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
                            <div className='doanhmuc-item'>
                                <img src={`${url}${item.image}`} alt="" />
                                <div className='doanhmuc-item-name'>{item.name}</div>
                            </div>
                        </button>
                    ))}
                </div>
                <div>
                    {food && (
                        <div className='home-content-list'>
                            {food.map((item, i) => (
                                <button key={i} onClick={(e) => handleClickItem(`${i + 1}`, e)}>
                                    <div className='home-content-item'>
                                        <div>
                                            <img src={`${url}${item.image}`} alt="" />
                                        </div>
                                        <div className='home-content-item-name text-wrap'>
                                            {item.name}
                                        </div>
                                        <div className='price-icon' >
                                            <div className='home-content-item-price'>{item.sell_price.toLocaleString()}</div>
                                            <button onClick={(e) => { handleClickBuy(item, e) }} className='home-content-item-icon'>
                                                <LucideShoppingCart></LucideShoppingCart>
                                            </button>
                                        </div>
                                    </div>
                                </button>
                            ))}
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