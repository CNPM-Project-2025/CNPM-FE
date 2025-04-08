import React from "react";
import "/src/assets/styles/Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

interface ItemCardProps {
  stt: number;
  image: string;
  name: string;
  price: number;
  addToCart: () => void; // ✅ Thêm hàm addToCart với kiểu dữ liệu
}

const ItemCard: React.FC<ItemCardProps> = ({ stt, image, name, price, addToCart }) => {
  return (
    <div className="item-card">
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
        <button className="f-center background-red" onClick={addToCart} >
          <FontAwesomeIcon icon={faCartShopping} style={{ color: "white" }} />
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
