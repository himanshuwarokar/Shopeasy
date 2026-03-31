import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { formatINR } from "../utils/formatCurrency";

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addHandler = async () => {
    if (!product) return;
    try {
      await addToCart(product, qty);
      setMessage("Added to cart");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not add to cart");
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <section className="card product-detail">
      <img src={product.image} alt={product.name} className="detail-image" />
      <div>
        <h2>{product.name}</h2>
        <p className="muted">{product.category}</p>
        <p>{product.description}</p>
        <p className="price">{formatINR(product.price)}</p>
        <p>Stock: {product.countInStock}</p>
        <div className="row">
          <input
            type="number"
            min="1"
            max={product.countInStock}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
          />
          <button
            className="btn"
            type="button"
            onClick={addHandler}
            disabled={product.countInStock < 1}
          >
            Add To Cart
          </button>
        </div>
        {message && <p className="success">{message}</p>}
      </div>
    </section>
  );
};

export default ProductPage;
