

type categoryType = {
    id: number;
    name: string;
    description: string;
    created_at: Date;
    status: number;
    created_update: Date;
    image: string;
}


type foodType = {
    id: number;
    name : string;
    description: string;
    sell_price: number;
    stock: number;
    import_price: number;
    image: string;
    created_at: Date;
    created_update: Date;
    status : number;
    category: categoryType;
}

// export default foodType;
export type { categoryType };
export type { foodType };