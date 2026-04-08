import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const PRODUCTS_CACHE_KEY = "shopeasy_products_cache";

const readCachedProducts = () => {
  try {
    const raw = localStorage.getItem(PRODUCTS_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const HomePage = () => {
  const [products, setProducts] = useState(readCachedProducts);
  const [loading, setLoading] = useState(products.length === 0);

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const { data } = await api.get("/products");
      setProducts(data);
      localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section>
      <div className="hero card">
        <h1>Everything You Need, In One Shop</h1>
        <p>Browse products, add to cart, and place orders in minutes.</p>
      </div>

      {loading && !products.length && <p>Loading products...</p>}
      {!loading && !products.length && <p>No products found.</p>}

      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default HomePage;
