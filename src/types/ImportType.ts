// enum('PENDING','APPROVED','REJECTED','COMPLETED'
import { foodType } from "./ProductTpye";

export enum ImportTypeEnum {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    COMPLETED = 'COMPLETED',
}

export type importDetails ={
    id: number;
    quantity: number;
    price: number;
    product: foodType;
}

export type user = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

export type ImportType = {
    id: number;
    created_at: string;
    updated_at: string;
    status: ImportTypeEnum;
    user: user;
    // totalPrice: number;
    purchaseOrderDetails: importDetails[];
}