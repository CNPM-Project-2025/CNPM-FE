import "/src/assets/styles/Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FastFoodItem } from "../../types/FastFoodItem";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { faMinus } from "@fortawesome/free-solid-svg-icons/faMinus";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { useState } from "react";

interface ItemPopupProps {
  product: FastFoodItem;
  add: () => void; // ✅ Thêm hàm addToCart với kiểu dữ liệu
  inc: () => void;
  dec: () => void;
  closePopup: () => void;
  sl: number;
}
// const [quantity, setquantity] = useState<number>(1);
// const inc = () => {
//   setquantity(quantity + 1);
// };
// const dec = () => {
//   setquantity(quantity - 1);
// };
const ItemPopup: React.FC<ItemPopupProps> = ({
  product,
  add,
  inc,
  dec,
  closePopup,
  sl,
}) => {
  return (
    <>
      <div className="popup-overlay" onClick={closePopup}>
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <div className="popup-header">
            <span>
              <h2>ADD TO CART</h2>
            </span>
            <span>
              <button
                className="popup-close"
                style={{
                  backgroundColor: "#ececee",
                  fontSize: "20px",
                  color: "#5a5860",
                  padding: "12px 24px",
                }}
                onClick={closePopup}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </span>
          </div>
          <div className="popup-body">
            <div className="popup-body-left">
              <img src={product.image} alt="Ảnh" />
            </div>
            <div className="popup-body-right">
              <div className="popup-info">
                <div>
                  <span>
                    <h3>SKU</h3>
                  </span>
                  <span>
                    <h3>{product.name}</h3>
                  </span>
                  <span>
                    <h3>Unit Price</h3>
                  </span>
                </div>
                <div>
                  <span>{product.id}</span>
                  <span>Burger</span>
                  <span>{product.price.toLocaleString()} VNĐ</span>
                </div>
              </div>
              <div className="popup-quantity">
                <div>
                  <h3>Quantity</h3>
                </div>
                <div className="itemCart-icon f-center">
                  <button onClick={dec}>
                    <div className="boder-25 f-center">
                      <FontAwesomeIcon icon={faMinus} />
                    </div>
                  </button>
                  <span style={{ fontSize: "20px" }}>{sl}</span>
                  <button onClick={inc}>
                    <div className="boder-25 f-center">
                      <FontAwesomeIcon icon={faPlus} className="icon_plus" />
                    </div>
                  </button>
                </div>
              </div>
              <div className="additional-info-wrapper">
                <div className="additional-info">
                  <p>
                    Protein: <span>What is Lorem ipsum?</span>
                  </p>
                  <p>
                    Additives: <span>03</span>
                  </p>
                  <p>
                    Banking material: <span>040</span>
                  </p>
                  <p>
                    Food decoration: <span>04</span>
                  </p>
                </div>
                <div className="side-dishes">
                  <div>
                    <label>Side Dishes(*)</label>
                    <span>selected quantity 0</span>
                  </div>
                  <p>sjbdcdsichdic</p>
                </div>

                <div className="option">
                  <input type="checkbox" id="Vegetables-checkbox" />
                  <label
                    htmlFor="Vegetables-checkbox"
                    style={{ marginLeft: "5px" }}
                  >
                    Vegetables
                  </label>
                </div>
              </div>
              <button
                className="popup-footer"
                onClick={() => {
                  add();
                  closePopup();
                }}
              >
                <span>
                  <FontAwesomeIcon icon={faCartShopping} />
                </span>
                <span>{product.price.toLocaleString()} VNĐ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemPopup;
