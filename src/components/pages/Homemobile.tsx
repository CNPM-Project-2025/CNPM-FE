
import { Home, HomeIcon, LucideShoppingCart } from 'lucide-react'

import '../../assets/styles/HomeMobile.css';


function HomeMobile() {

    const handleClickBuy = (id: String, event: React.MouseEvent) => {
        // chặn sự kiện cha 
        event.stopPropagation();
        event.preventDefault();
        console.log('click buy', id);
    }

    const handleClickItem = (id: String, event: React.MouseEvent) => {
        // chặn sự kiện mặc định
        // event.preventDefault();
        console.log('click item', id);
    }

    return (
        <div className='home'>
            <div className='container-home'>
                <div>
                    <div className='home-info'>
                        <HomeIcon></HomeIcon>
                        <div>
                            Bạn đang ngồi bàn
                            <span> Bàn 49</span>
                        </div>
                    </div>
                </div>
                <div className='doanhmuc-list'>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <button key={i} onClick={() => { console.log('click') }}>
                            <div className='doanhmuc-item'>
                                <img src="https://mcdonalds.vn/uploads/2018/mccafe/xhotmatcha.png.pagespeed.ic.i1Eo-BIuI3.webp" alt="" />
                                <div className='doanhmuc-item-name'>Gà rán</div>
                            </div>
                        </button>
                    ))}
                </div>
                <div>
                    <div className='home-content-list'>
                        {Array.from({ length: 10 }).map((_, i) => (
                            <button key={i} onClick={(e) => handleClickItem(`${i + 1}`, e)}>
                                <div className='home-content-item'>
                                    <div>
                                        <img src="https://mcdonalds.vn/uploads/2018/food/desserts/xoreo_mcflurry.png.pagespeed.ic.X74SrJJa1S.webp" alt="" />
                                    </div>
                                    <div className='home-content-item-name'>
                                        Kem xoay bánh Oreo
                                    </div>
                                    <div className='price-icon' >
                                        <div className='home-content-item-price'>25000VNĐ</div>
                                        <button onClick={(e) => { handleClickBuy("1", e) }} className='home-content-item-icon'>
                                            <LucideShoppingCart></LucideShoppingCart>
                                        </button>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <div className="cart-bar">
                    <span>🛒 2 sản phẩm</span>
                    <button>Xem giỏ hàng</button>
                </div>
            </div>

        </div>
    );
}

export default HomeMobile;