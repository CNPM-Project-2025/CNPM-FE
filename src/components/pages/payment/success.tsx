import { useSearchParams } from "react-router-dom";
import { Home, HomeIcon, LucideShoppingCart, X } from 'lucide-react'
import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import config from "../../../config/config";
import { BillType } from "../../../types/BillType";


const url = config.API_URL;

export function Success() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [bill, setBill] = useState<BillType | null>(null);
    const [loading, setLoading] = useState(false);


    const code = searchParams.get("code");
    const id = searchParams.get("id");
    const cancel = searchParams.get("cancel");
    const status = searchParams.get("status");
    const orderCode = searchParams.get("orderCode");

    console.log("code", code); 
    console.log("id", id);
    console.log("cancel", cancel);
    console.log("status", status);
    console.log("orderCode", orderCode);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${url}bill/${orderCode}`);
            const data = await response.json();
            setBill(data.data);
        } catch (error) {
            console.error("Error fetching bill:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Payment Successful!</h1>
            <p className="mt-4 text-lg">Thank you for your purchase.</p>
        {/* thông tin hóa đơn */}
            <div>
                {bill && (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ngày</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{bill.id}</td>
                                <td>{new Date(bill.created_at).toLocaleString()}</td>
                                <td>{bill.totalPrice.toLocaleString()} đ</td>
                                <td>{bill.status}</td>
                            </tr>
                        </tbody>
                    </Table>
                )}
            </div>
            <div className="d-flex flex-col align-items-center justify-content-center">

                <Button variant="primary" onClick={() => navigate(`/${bill?.table.id}`)} className="mt-4">
                    Về trang chủ
                </Button>
            </div>
        </div>

    );
}