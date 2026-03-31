import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatINR } from "../utils/formatCurrency";

const CheckoutPage = () => {
  const { userInfo } = useAuth();
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const totalPrice = useMemo(
    () => items.reduce((acc, item) => acc + item.qty * item.price, 0),
    [items]
  );

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!items.length) {
      setError("Cart is empty");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api.post(
        "/orders",
        {
          shippingAddress: { address, city, postalCode, country },
          paymentMethod: "Cash on Delivery"
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );
      await clearCart();
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card auth-card">
      <h2>Checkout</h2>
      <p className="muted">Total: {formatINR(totalPrice)}</p>
      <form onSubmit={submitHandler}>
        <label htmlFor="address">Address</label>
        <input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <label htmlFor="city">City</label>
        <input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
        <label htmlFor="postalCode">Postal Code</label>
        <input
          id="postalCode"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          required
        />
        <label htmlFor="country">Country</label>
        <input
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Placing order..." : "Place Order"}
        </button>
      </form>
    </section>
  );
};

export default CheckoutPage;
