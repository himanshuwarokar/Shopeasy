import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { formatINR } from "../utils/formatCurrency";

const statuses = ["Processing", "Shipped", "Delivered", "Cancelled"];

const AdminOrdersPage = () => {
  const { userInfo } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders", authConfig);
      setOrders(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}`, { status }, authConfig);
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Status update failed");
    }
  };

  return (
    <section>
      <h2>Admin Orders</h2>
      {error && <p className="error">{error}</p>}
      {!orders.length && <p>No orders found.</p>}
      {orders.map((order) => (
        <article className="card" key={order._id}>
          <p>
            <strong>{order._id}</strong>
          </p>
          <p>
            Customer: {order.user?.name} ({order.user?.email})
          </p>
          <p>Total: {formatINR(order.totalPrice)}</p>
          <p>Items: {order.orderItems.length}</p>
          <label htmlFor={`status-${order._id}`}>Status</label>
          <select
            id={`status-${order._id}`}
            value={order.status}
            onChange={(e) => updateStatus(order._id, e.target.value)}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </article>
      ))}
    </section>
  );
};

export default AdminOrdersPage;
