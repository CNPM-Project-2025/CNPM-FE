import AdminSocketListener from './AdminSocketListener';
import { use, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Table, Card, Badge } from "react-bootstrap";
import { useUser } from "../../../context/UserContext";
import { billStatusEnum, BillType, BillTypeEnum, OrderStatusEnum } from "../../../types/BillType";
import LoadingScreen from "../../common/LoadingScreen";
import { Search } from "lucide-react";
import config from '../../../config/config.ts';
import { toast } from "react-toastify";


const url = config.API_URL;

function Statistics() {
  const { user } = useUser();
  const [Bill, setBill] = useState<BillType[]>([]);

  const fetchBills = async () => {
    const response = await fetch(`${url}bill/cook/paid`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user?.access_token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      setBill(data);
      // toast.success("Fetched bills successfully");
    } else {
      // toast.error("Failed to fetch bills");
    }
  }

  // handle
  const onCompleteItem = async (billId: number, orderDetailId: number) => {
    const response = await fetch(`${url}bill/updateOrderStatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.access_token}`,
      },
      body: JSON.stringify({
        // billId: billId,
        id: orderDetailId,
        status: OrderStatusEnum.COMPLETED,
      }),   
    });
    if (response.ok) {
      toast.success("Cập nhật trạng thái thành công");
      await fetchBills();
    }
  }
 
  useEffect(() => {
    fetchBills();
  }, []);


  useEffect(() => {
    console.log("Fetched bills: ", Bill);
  }, [Bill]);

  return (
    <>
      <AdminSocketListener />
      <div>
        <div className="mt-4">
          {Bill.map((order) => (
            <Card className="mb-4" key={order.id}>
              <Card.Header>
                <div>Hóa đơn</div>
                <small>Ngày tạo: {new Date(order.created_at).toLocaleString()}</small>
              </Card.Header>
              <Card.Body>
                <Table bordered responsive>
                  <thead>
                    <tr>
                      <th>Hình ảnh</th>
                      <th>Tên món</th>
                      <th>Số lượng</th>
                      <th>Giá bán</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderDetails.map((item) => (
                      <tr key={item.id}>
                        <td><img src={`${url}${item.foodItem.image}`} alt={item.foodItem.name} width="60" /></td>
                        <td>{item.foodItem.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.foodItem.sell_price.toLocaleString()}đ</td>
                        <td>
                          <Badge bg={item.status === 'PLACED' ? 'warning' : 'success'}>
                            {item.status === 'PLACED' ? 'Đang chế biến' : 'Hoàn thành'}
                          </Badge>
                        </td>
                        <td>
                          {item.status === 'PLACED' && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => onCompleteItem(order.id, item.id)}
                            >
                              Hoàn thành
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
export default Statistics;