import styled from "styled-components";
import { FastFoodItem } from "../../types/FastFoodItem";
// import { formatCurrency } from "../../lib/formatCurrency";
// import Button from "../common/Button";
// import { useCart } from "../../hooks/useCart";

const Card = styled.div`
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
`;

interface ProductCardProps {
  product: FastFoodItem;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
//   const { addItem } = useCart();

  return (
    <div>
      <ProductImage src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{(product.price)}</p>
      <p>{product.category === "Food" ? "Đồ ăn" : "Đồ uống"}</p>
      <p>{product.inStock ? "Còn hàng" : "Hết hàng"}</p>
      {product.description && <p>{product.description}</p>}
      {/* {product.inStock && (
        // <button onClick={() => addItem(product)}>Thêm vào giỏ</button>
      )} */}
    </div>
  );
};

export default ProductCard;