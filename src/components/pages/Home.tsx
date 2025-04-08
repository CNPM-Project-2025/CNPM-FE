
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import '/src/assets/styles/Home.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CategoryCard from '../ui/CategoryCard';
import ItemCard from '../ui/ItemCard';
import { useFetchProducts } from '../../hooks/useFetchProducts';
// import { FastFoodItem } from '../../types/FastFoodItem';
// import { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import CartCard from '../ui/CartCard';
// import { useCart } from "../../hooks/useCart"; // Import hook


function Home() {


    const { products } = useFetchProducts();
    const { cart, addToCart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart(); // Sử dụng useCart
    return (
        <>
            <div style={{ display: "flex", height: "92vh", overflow: "hidden"}}>
                <div style={{ width: "70%", height: "100%" }}>
                    <div className="home_Header">
                        <div className='home_Header-icon'>
                            <FontAwesomeIcon icon={faHouse} />
                        </div>
                        <div className='home_Header-content'>
                            Back to home
                        </div>
                    </div>
                    <div className='home_Content'>

                        <div className='home_Content-Category'>
                            <CategoryCard key={12} image={"https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Bucket-3.jpg?v=P38mNL"} name={"name"} />
                            <CategoryCard key={12} image={"https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Bucket-3.jpg?v=P38mNL"} name={"name"} />
                            <CategoryCard key={12} image={"https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Bucket-3.jpg?v=P38mNL"} name={"name"} />
                            <CategoryCard key={12} image={"https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Bucket-3.jpg?v=P38mNL"} name={"name"} />
                            <CategoryCard key={12} image={"https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Bucket-3.jpg?v=P38mNL"} name={"name"} />
                            <CategoryCard key={12} image={"https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Bucket-3.jpg?v=P38mNL"} name={"name"} />
                            <CategoryCard key={12} image={"https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Bucket-3.jpg?v=P38mNL"} name={"name"} />
                            <CategoryCard key={12} image={"https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Bucket-3.jpg?v=P38mNL"} name={"name"} />
                            <CategoryCard key={12} image={"https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Bucket-3.jpg?v=P38mNL"} name={"name"} />
                            <CategoryCard key={12} image={"https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Bucket-3.jpg?v=P38mNL"} name={"name"} />
                            <CategoryCard key={12} image={"https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Bucket-3.jpg?v=P38mNL"} name={"name"} />
                        </div>
                        <div className='home_Content-item'>
                            <div className='home_Content-item-header'>
                                <div style={{ width: "max-content" }}><span>Sea food</span></div>
                                <div className='line'></div>
                            </div>

                            <div className='item-list'>
                                {/* <ItemCard key={1} stt={1} image={"https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Bucket-3.jpg?v=P38mNL"} name={"hambergẹ"} price={12000}/> */}
                                {products.map((product, index) => (
                                    <ItemCard
                                        addToCart={() => addToCart(product)}
                                        key={product.id}
                                        image={product.image}
                                        stt={index}
                                        name={product.name}
                                        price={product.price} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ width: "30%", backgroundColor: "blue", display: "flex", flexDirection: "column", height: "100%" }}>

                    <div style={{ height: "10%" }}>
                        <span>header</span>
                    </div>
                    <div style={{ overflowY: "auto", height: "70%" }}>
                        <CartCard cart={cart} increaseQuantity={increaseQuantity} decreaseQuantity={decreaseQuantity} removeFromCart={removeFromCart} />
                    </div>
                    <div style={{ height: "10%" }}>
                        Pyament
                    </div>
                </div>
            </div>

        </>
    )
}
export default Home;