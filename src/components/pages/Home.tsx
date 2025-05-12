import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFetchProducts } from "../../hooks/useFetchProducts";
import { useCart } from "../../hooks/useCart";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons/faCartShopping";
import { useState } from "react";

import CategoryCard from "../ui/CategoryCard";
import ItemCard from "../ui/ItemCard";
import CartCard from "../ui/CartCard";

import "/src/assets/styles/Home.css";

function Home() {
  const { products } = useFetchProducts();
  const [sl, setsl] = useState<number>(1);
  const {
    cart,
    addToCartbySL,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    getTotalPrice,
    getTotalTax,
    removeFromCart,
  } = useCart(); // Sử dụng useCart
  return (
    <>
      <div style={{ display: "flex", height: "92vh", overflow: "hidden" }}>
        <div style={{ width: "70%", height: "100%" }}>
          <div className="home_Header">
            <div className="home_Header-icon">
              <FontAwesomeIcon icon={faHouse} />
            </div>
            <div className="home_Header-content">Back to home</div>
          </div>
          <div className="home_Content">
            <div className="home_Content-Category">
              <CategoryCard
                key={12}
                image={
                  "https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Bucket-3.jpg?v=P38mNL"
                }
                name={"name"}
              />
              <CategoryCard
                key={12}
                image={
                  "https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Bucket-3.jpg?v=P38mNL"
                }
                name={"name"}
              />
              <CategoryCard
                key={12}
                image={
                  "https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Bucket-3.jpg?v=P38mNL"
                }
                name={"name"}
              />
              <CategoryCard
                key={12}
                image={
                  "https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Bucket-3.jpg?v=P38mNL"
                }
                name={"name"}
              />
              <CategoryCard
                key={12}
                image={
                  "https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Bucket-3.jpg?v=P38mNL"
                }
                name={"name"}
              />
              <CategoryCard
                key={12}
                image={
                  "https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Bucket-3.jpg?v=P38mNL"
                }
                name={"name"}
              />
              <CategoryCard
                key={12}
                image={
                  "https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Bucket-3.jpg?v=P38mNL"
                }
                name={"name"}
              />
              <CategoryCard
                key={12}
                image={
                  "https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Bucket-3.jpg?v=P38mNL"
                }
                name={"name"}
              />
              <CategoryCard
                key={12}
                image={
                  "https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Bucket-3.jpg?v=P38mNL"
                }
                name={"name"}
              />
              <CategoryCard
                key={12}
                image={
                  "https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Bucket-3.jpg?v=P38mNL"
                }
                name={"name"}
              />
              <CategoryCard
                key={12}
                image={
                  "https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Bucket-3.jpg?v=P38mNL"
                }
                name={"name"}
              />
            </div>
            <div className="home_Content-item">
              <div className="home_Content-item-header">
                <div style={{ width: "max-content" }}>
                  <span>Sea food</span>
                </div>
                <div className="line"></div>
              </div>

              <div className="item-list">
                {/* <ItemCard key={1} stt={1} image={"https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Bucket-3.jpg?v=P38mNL"} name={"hambergẹ"} price={12000}/> */}
                {products.map((product, index) => (
                  <ItemCard
                    product={product}
                    addToCart={() => addToCart(product)}
                    addToCartbySL={() => {
                      addToCartbySL(product, sl), setsl(1);
                    }}
                    key={product.id}
                    image={product.image}
                    stt={index}
                    name={product.name}
                    price={product.price}
                    sl={sl}
                    slinc={() => setsl(sl + 1)}
                    sldec={() => setsl(sl - 1)}
                    inc={() => increaseQuantity(product.id)}
                    dec={() => decreaseQuantity(product.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div
          // style={{
          //   boxShadow: "-5px 0 10px rgba(0,0,0,0.2)",
          //   width: "30%",
          //   // backgroundColor: "blue",
          //   display: "flex",
          //   flexDirection: "column",
          //   height: "100%",
          // }}
          className="cart_container"
        >
          <div className="cart_header" style={{ margin: "10px" }}>
            <div className="left_header">
              <span>
                <FontAwesomeIcon icon={faCartShopping} />
              </span>
              <span>Your Cart ({cart.length})</span>
            </div>
            <span className="right_header f-center">DINE IN</span>
          </div>
          <div style={{ overflowY: "auto", flex: "1" }}>
            <CartCard
              cart={cart}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
              removeFromCart={removeFromCart}
            />
          </div>
          <div style={{ margin: "0 10px" }}>
            <div className="total">
              <span>Total:</span>
              <span style={{ color: "red" }}>
                {getTotalPrice().toLocaleString()} VNĐ
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              (Incl.tax 10% = {getTotalTax().toLocaleString()})
            </div>
            <div className="payment">PAYMENT</div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Home;
