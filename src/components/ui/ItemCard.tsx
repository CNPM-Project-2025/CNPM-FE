import React, { useState } from "react";
import "/src/assets/styles/Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import ItemPopup from "./ProductDetail";
import { FastFoodItem } from "../../types/FastFoodItem";
// import { useCart } from "../../hooks/useCart";

interface ItemCardProps {
  product: FastFoodItem;
  stt: number;
  image: string;
  name: string;
  price: number;
  //
  sl: number;
  slinc: () => void;
  sldec: () => void;
  inc: () => void;
  dec: () => void;
  //
  addToCart: () => void; // ✅ Thêm hàm addToCart với kiểu dữ liệu
  addToCartbySL: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  product,
  stt,
  sl,
  image,
  name,
  price,
  slinc,
  sldec,
  addToCart,
  addToCartbySL,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <>
      <div className="item-card" onClick={openPopup}>
        <img src={image} alt={name} />
        <div className="item-card-name">
          {/* <div className="item-card-text">
          {stt}. {name} 
        </div> */}
          {/* <span style={{ color: "red" }}>{stt}.&nbsp;</span> */}
          <div className="item-card-text">
            <span style={{ color: "red" }}>{stt}.&nbsp;</span>
            {name}
          </div>
        </div>
        <div className="item-card-group">
          <span>{price.toLocaleString()} VNĐ</span>
          <button className="f-center background-red" onClick={addToCart}>
            <FontAwesomeIcon icon={faCartShopping} style={{ color: "white" }} />
          </button>
        </div>
      </div>
      {isPopupOpen && (
        <ItemPopup
          product={product}
          add={addToCartbySL}
          closePopup={closePopup}
          inc={slinc}
          dec={sldec}
          sl={sl}
        />
      )}
    </>
  );
};

export default ItemCard;
