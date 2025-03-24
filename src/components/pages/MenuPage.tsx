import { useFetchProducts } from "../../hooks/useFetchProducts";
import ProductCard from "../ui/ProductCard";

const MenuPage: React.FC = () => {
  const { products, loading, error } = useFetchProducts();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Menu Đồ Ăn Nhanh</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default MenuPage;