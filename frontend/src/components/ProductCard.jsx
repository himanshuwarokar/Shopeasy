import { Link } from "react-router-dom";
import { formatINR } from "../utils/formatCurrency";

const ProductCard = ({ product }) => (
  <article className="card product-card">
    <img
      src={product.image}
      alt={product.name}
      className="product-image"
      loading="lazy"
      decoding="async"
    />
    <div className="product-body">
      <h3>{product.name}</h3>
      <p className="muted">{product.category}</p>
      <p className="price">{formatINR(product.price)}</p>
      <Link to={`/product/${product._id}`} className="btn">
        View
      </Link>
    </div>
  </article>
);

export default ProductCard;
