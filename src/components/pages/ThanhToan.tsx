import { Home, HomeIcon, LucideShoppingCart, X } from 'lucide-react'
import { useEffect, useState } from 'react';
import { categoryType, foodType } from '../../types/ProductTpye';
import { useCart } from '../../hooks/useCart.tsx';
import '../../assets/styles/HomeMobile.css';
import config from '../../config/config.ts';
import LoadingScreen from '../common/LoadingScreen.tsx';
import { PaymentMethod } from '../../types/PaymentMethod.ts';
import { Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CardInfoType } from '../../types/cardInfoType.ts'
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TableType } from './admin/Table.tsx';



type createorderDetails = {
    foodItemId: number;
    quantity: number;
}

type createBill = {
    totalPrice: number;
    paymentMethod: PaymentMethod;
    type: string;
    tableId?: number;
    cardinfo?: CardInfoType | null;
    orderDetails: createorderDetails[];
}

function ThanhToan() {

    const url = config.API_URL;
    const location = useLocation();
    // nhập table từ urlroute
    const Table: TableType | undefined = location.state?.Table;
    console.log('Table', Table);
    const { cart, addToCart, increaseQuantity, decreaseQuantity, getTotalPrice, isLoading, clearCart } = useCart();
    const [isLoadinglocal, setIsLoading] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(PaymentMethod.CASH); // Phương thức thanh toán mặc định là tiền mặt
    const navigate = useNavigate();

    const [expanded, setExpanded] = useState(true);

    const data: CardInfoType = location.state?.cardInfo;

    const fetchQRcode = async (id: number) => {
        const response = await fetch(`${url}payment/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "amount": 2000,
                "orderCode" : id,
            }),
        });
        if (!response.ok) {
            toast.error('Tạo QR thất bại');
            setIsLoading(false);
            return;
        }
        const data = await response.json();
        console.log('data', data);
        return data;
    }

    const fetchthanhtoan = async () => {
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
            tableId: Table?.id,
            cardinfo: data,
            orderDetails: orderDetails,
        };

        console.log('bill', bill);
        // Gửi bill đến API
        const response = await fetch(`${url}bill`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bill),
        })
        if (!response.ok) {
            toast.error('Thanh toán thất bại');
            setIsLoading(false);
            return false;
        }
        
        // toast.success('Thanh toán thành công');
        clearCart();
        // navigate(`/${Table?.id}`);
        setIsLoading(false);
        return response.json();
    }

    useEffect(() => {
        // Kiểm tra xem có dữ liệu cardInfo trong state không
        if (data) {
            setSelectedPayment(PaymentMethod.CARD);
        }
    }, [data]);
    // handle
    // Hàm để xử lý khi người dùng chọn một phương thức thanh toán
    const handleSelectPayment = (paymentMethod: PaymentMethod) => {
        setSelectedPayment(paymentMethod);
    };

    const handlethahtoan = async () => {
        if (selectedPayment === PaymentMethod.CARD) {
            if (data) {
                const check = await fetchthanhtoan();   
                if (check !== false){
                    toast.success('Thanh toán thành công');
                }
                navigate(`/${Table?.id}`);
                // toast.success('Thanh toán thành công');
            } else {
                navigate('/thanh-toan/the', {
                    state: { cardInfo: data }
                });
            }
        } else if (selectedPayment === PaymentMethod.BANK_TRANSFER){
            const data = await fetchthanhtoan();
            if (data !== false){
                console.log('data', data);
                // toast.success('Thanh toán thành công');
                const response = await fetchQRcode(data.data.id);
                // navigate(response.checkoutUrl);
                window.location.href = response.checkoutUrl;
            }
            // toast.success('Thanh toán thành công');
        } else {
            const data = await fetchthanhtoan();
            if (data !== false){
                toast.success('Thanh toán thành công');
                navigate(`/${Table?.id}`);
            } else {
                console.log('thanh toan that bai ');
            }
        }
    }

    if (isLoading || isLoadinglocal) {
        return <LoadingScreen />;
    }

    return (
        <div className='p-1 m-auto'>
            <div style={{ marginBottom: '120px' }}>

                <h1>Thanh Toán</h1>

                <div className='bg-white rounded-3 mb-2'>
                    <h2>Chọn phương thức thanh toán</h2>
                    <div className='d-flex flex-column align-items-left gap-2 mb-2'>
                        <Button className='text-start' variant={selectedPayment === PaymentMethod.CASH ? 'outline-info' : 'outline-secondary'} style={{ flex: 1 }} onClick={() => handleSelectPayment(PaymentMethod.CASH)}>Tiền Mặt</Button>
                        <Button className='text-start' variant={selectedPayment === PaymentMethod.BANK_TRANSFER ? 'outline-info' : 'outline-secondary'} style={{ flex: 1 }} onClick={() => handleSelectPayment(PaymentMethod.BANK_TRANSFER)}>Chuyển Khoản</Button>
                        <Button className='text-start' variant={selectedPayment === PaymentMethod.CARD ? 'outline-info' : 'outline-secondary'} style={{ flex: 1 }} onClick={() => handleSelectPayment(PaymentMethod.CARD)}>Thẻ</Button>
                    </div>
                    {selectedPayment === PaymentMethod.CARD && data && (
                        <div>
                            <div className="card shadow-sm  m-2 bg-body rounded" style={{ maxWidth: '400px', margin: '0 auto' }}>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center ">
                                        <h5 className="card-title mb-0">Card Information</h5>
                                        <Button
                                            variant="info"
                                            size="sm"
                                            onClick={() => setExpanded(!expanded)}
                                            className="text-decoration-none"
                                        >
                                            {expanded ? 'Thu gọn ▲' : 'Mở rộng ▼'}
                                        </Button>
                                    </div>

                                    {expanded && (
                                        <ul className="list-group list-group-flush mb-3">
                                            <li className="list-group-item">
                                                <strong>Card Number:</strong> **** **** **** {data.cardNumber.slice(-4)}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Card Holder:</strong> {data.cardHolderName}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Expiration Date:</strong> {data.expirationDate}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>CVV:</strong> *** (hidden)
                                            </li>
                                        </ul>
                                    )}

                                    {expanded && (
                                        <Button
                                            variant="outline-secondary"
                                            className="w-100"
                                            onClick={() => {
                                                navigate('/thanh-toan/the', {
                                                    state: { cardInfo: data }
                                                });
                                            }}
                                        >
                                            Nhập lại thông tin
                                        </Button>
                                    )}

                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className='invoice bg-white rounded-4' style={{ marginBottom: '10px' }}>
                    <h2>Hóa Đơn</h2>
                    {cart.map((item) => (
                        <div key={item.id} className='invoice-item d-flex align-items-center gap-1' style={{ fontSize: '16px' }}>
                            <div>
                                <img src={`${url}${item.image}`} style={{ width: "50px", height: "50px" }} alt="" />
                            </div>
                            <div className=''>
                                {item.quantity}
                            </div>
                            <div className='invoice-item-name flex-grow-1'>{item.name}</div>
                            <div className='invoice-item-price'>{item.sell_price.toLocaleString()}</div>
                        </div>
                    ))}
                </div>

                <div className='rounded-4 bg-white'>
                    <h2>Chi tiết thanh toán</h2>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div>Tống giá món ({cart.length} món)</div>
                        <div>{getTotalPrice().toLocaleString()}</div>
                    </div>
                </div>
            </div>
            <div className='d-flex flex-column gap-2 position-fixed bottom-0 bg-white p-3' style={{ width: '100%', zIndex: 100 }}>

                <Button variant="success" className='w-100' onClick={() => { handlethahtoan() }}>
                    {(PaymentMethod.CARD === selectedPayment && data) || selectedPayment === PaymentMethod.CASH || selectedPayment === PaymentMethod.BANK_TRANSFER ? 'Thanh Toán' : 'Nhập thông tin thẻ'}
                </Button>
            </div>
        </div>
    );
}

export default ThanhToan;
