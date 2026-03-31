import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatINR } from "../utils/formatCurrency";

const CartPage = () => {
  const { items, updateItemQty, removeItem } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const totalItems = items.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.qty * item.price, 0);

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  return (
    <section>
      <h2>Your Cart</h2>
      {!items.length && (
        <p>
          Cart is empty. <Link to="/">Go shopping</Link>
        </p>
      )}
      {items.map((item) => (
        <article className="card cart-item" key={item.product}>
          <img src={item.image} alt={item.name} />
          <div>
            <h4>{item.name}</h4>
            <p>{formatINR(item.price)}</p>
          </div>
          <input
            type="number"
            min="1"
            max={item.countInStock}
            value={item.qty}
            onChange={(e) => updateItemQty(item.product, Number(e.target.value))}
          />
          <button
            type="button"
            className="danger-btn"
            onClick={() => removeItem(item.product)}
          >
            Remove
          </button>
        </article>
      ))}

      {!!items.length && (
        <div className="card summary">
          <p>
            Items: <strong>{totalItems}</strong>
          </p>
          <p>
            Total: <strong>{formatINR(totalPrice)}</strong>
          </p>
          <button type="button" className="btn" onClick={checkoutHandler}>
            Proceed to Checkout
          </button>
          {!userInfo && (
            <p className="muted small">Login is required for checkout and order creation.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default CartPage;
