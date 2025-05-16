import { PaymentMethod } from "./PaymentMethod";
import { foodType } from "../types/ProductTpye";
import { TableType } from "../components/pages/admin/Table";
// tạo enum loại 
// hóa đơn
export enum BillTypeEnum {
    DINE_IN = 'DINE_IN',
    TAKE_AWAY = 'TAKE_AWAY',
}

export enum billStatusEnum {
    PENDING = 'UNPAID',
    PAID = 'PAID',
}
// tạo emnu 
    // enum('PLACED','PREPARING','SERVED','COMPLETED','CANCELLED') 

export enum OrderStatusEnum {
    PLACED = 'PLACED',
    PREPARING = 'PREPARING',
    SERVED = 'SERVED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export type orderDetails = {
    id: number;
    quantity: number;
    status: OrderStatusEnum;
    foodItem: foodType;
}

export type BillType = {
    id: number;
    paymentMethod: PaymentMethod;
    type: BillTypeEnum;
    totalPrice: number;
    created_at: string;
    updated_at: string;
    table: TableType;
    status: billStatusEnum;
    orderDetails: orderDetails[];
}
