import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FastFoodItem } from "../../types/FastFoodItem";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import "/src/assets/styles/Home.css";

interface CartItem extends FastFoodItem {
  quantity: number;
}

export default function Cart({
  cart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
}: {
  cart: CartItem[];
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
}) {
  return (
    <div>
      {cart.length > 0 ? (
        cart.map((item, index) => (
          <div className="itemCart_container">
            <img className="itemCart-img" src={item.image} alt="qq" />
            <div className="itemCart-name-group">
              <div className="itemCart-name">
                <span>
                  <span style={{ color: "red" }}>{index + 1}.</span> {item.name}
                </span>
              </div>
              <div className="itemCart-group">
                <div className="itemCart-icon f-center">
                  <button onClick={() => decreaseQuantity(item.id)}>
                    <div className="boder-25 f-center">
                      <FontAwesomeIcon icon={faMinus} />
                    </div>
                  </button>
                  <span style={{ fontSize: "20px" }}>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)}>
                    <div className="boder-25 f-center">
                      <FontAwesomeIcon icon={faPlus} />
                    </div>
                  </button>
                </div>
                <div className="itemCart-price">
                  <span style={{ color: "red" }}>
                    {item.price.toLocaleString()} VNĐ
                  </span>
                </div>
              </div>
            </div>
          </div>
          // <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", borderBottom: "1px solid #ddd" }}>
          //   <span>{item.name} - {item.price.toLocaleString()}đ</span>
          //   <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          //     <button onClick={() => decreaseQuantity(item.id)} style={{ padding: "4px 8px", border: "1px solid #ddd", backgroundColor: "#fff", cursor: "pointer" }}>➖</button>
          //     <span>{item.quantity}</span>
          //     <button onClick={() => increaseQuantity(item.id)} style={{ padding: "4px 8px", border: "1px solid #ddd", backgroundColor: "#fff", cursor: "pointer" }}>➕</button>
          //     <button onClick={() => removeFromCart(item.id)} style={{ padding: "4px 8px", border: "1px solid #ff0000", backgroundColor: "#ffdddd", cursor: "pointer" }}>🗑️</button>
          //   </div>
          // </div>
        ))
      ) : (
        <p style={{ color: "#777", display: "flex", justifyContent: "center" }}>
          Giỏ hàng trống
        </p>
      )}
    </div>
  );
}
