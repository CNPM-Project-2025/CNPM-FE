import { Home, HomeIcon, LucideShoppingCart, X } from 'lucide-react'
import { useEffect, useState } from 'react';
import { categoryType, foodType } from '../../types/ProductTpye';
import { useCart } from '../../hooks/useCart.tsx';
import '../../assets/styles/HomeMobile.css';
import LoadingScreen from '../common/LoadingScreen.tsx';
import { PaymentMethod } from '../../types/PaymentMethod.ts';
import { Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

type createorderDetails = {
    foodItemId: number;
    quantity: number;
}

type createBill = {
    totalPrice: number;
    paymentMethod: PaymentMethod;
    type: string;
    orderDetails: createorderDetails[];
}

function ThanhToan() {

    const url = 'http://192.168.16.92:9999/';

    const { cart, addToCart, increaseQuantity, decreaseQuantity, getTotalPrice, isLoading } = useCart();
    const [isLoadinglocal, setIsLoading] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(PaymentMethod.CASH); // Phương thức thanh toán mặc định là tiền mặt

    // Hàm để xử lý khi người dùng chọn một phương thức thanh toán
    const handleSelectPayment = (paymentMethod: PaymentMethod) => {
        setSelectedPayment(paymentMethod);
    };

    const handlethahtoan = () => {
        setIsLoading(true);
        console.log('selectedPayment', selectedPayment);
        const orderDetails = cart.map((item) => ({
            foodItemId: item.id,
            quantity: item.quantity,
        }));

        const bill: createBill = {
            totalPrice: getTotalPrice(),
            paymentMethod: selectedPayment,
            type: 'DINE_IN',
            orderDetails: orderDetails,
        };

        console.log('bill', bill);
        // Gửi bill đến API
        fetch(`${url}bill`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bill),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                // Xử lý phản hồi từ API nếu cần
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        setIsLoading(false);
    }

    if (isLoading || isLoadinglocal) {
        return <LoadingScreen />;
    }

    return (
        <div>
            <h1>Thanh Toán</h1>
            <div className='invoice'>
                <h2>Hóa Đơn</h2>
                {cart.map((item) => (
                    <div key={item.id} className='invoice-item d-flex align-items-center gap-1' style={{ fontSize: '16px' }}>
                        <div>
                            <img src={`${url}${item.image}`} style={{ width: "50px", height: "50px" }} alt="" />
                        </div>
                        <div className=''>
                            {item.quantity}x
                        </div>
                        <div className='invoice-item-name flex-grow-1'>{item.name}</div>
                        <div className='invoice-item-price'>{item.sell_price.toLocaleString()}</div>
                    </div>
                ))}
            </div>

            <div>
                <h2>Chi tiết thanh toán</h2>
                <div className='d-flex justify-content-between align-items-center'>
                    <div>Tống giá món ({cart.length} món)</div>
                    <div>{getTotalPrice().toLocaleString()}</div>
                </div>
            </div>
            <div className='d-flex flex-column gap-2 position-fixed bottom-0 bg-white p-3' style={{ width: '100%', zIndex: 100 }}>
                <div className='d-flex justify-content-between align-items-center gap-2'>
                    <Button variant={selectedPayment === PaymentMethod.CASH ? 'outline-info' : 'outline-secondary'} style={{ flex: 1 }} onClick={() => handleSelectPayment(PaymentMethod.CASH)}>Tiền Mặt</Button>
                    <Button variant={selectedPayment === PaymentMethod.BANK_TRANSFER ? 'outline-info' : 'outline-secondary'} style={{ flex: 1 }} onClick={() => handleSelectPayment(PaymentMethod.BANK_TRANSFER)}>Thẻ</Button>
                </div>
                <Button variant="success" className='w-100' onClick={() => { handlethahtoan() }}>
                    Thanh toán
                </Button>
            </div>
        </div>
    );
}

export default ThanhToan;