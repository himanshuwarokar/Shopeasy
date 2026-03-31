import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { formatINR } from "../utils/formatCurrency";

const OrdersPage = () => {
  const { userInfo } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/orders/mine", {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        });
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userInfo]);

  return (
    <section>
      <h2>My Orders</h2>
      {loading && <p>Loading orders...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !orders.length && <p>No orders found yet.</p>}
      {orders.map((order) => (
        <article className="card" key={order._id}>
          <p>
            Order ID: <strong>{order._id}</strong>
          </p>
          <p>Status: {order.status}</p>
          <p>Total: {formatINR(order.totalPrice)}</p>
          <p>Items: {order.orderItems.length}</p>
          <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
        </article>
      ))}
    </section>
  );
};

export default OrdersPage;
