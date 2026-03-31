import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { formatINR } from "../utils/formatCurrency";

const initialForm = {
  name: "",
  image: "",
  brand: "",
  category: "",
  description: "",
  price: "",
  countInStock: ""
};

const AdminProductsPage = () => {
  const { userInfo } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`
    }
  };

  const fetchProducts = async () => {
    const { data } = await api.get("/products");
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditId("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        countInStock: Number(form.countInStock)
      };
      if (editId) {
        await api.put(`/products/${editId}`, payload, authConfig);
        setMessage("Product updated");
      } else {
        await api.post("/products", payload, authConfig);
        setMessage("Product created");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    }
  };

  const startEdit = (product) => {
    setEditId(product._id);
    setForm({
      name: product.name,
      image: product.image || "",
      brand: product.brand || "",
      category: product.category,
      description: product.description,
      price: product.price,
      countInStock: product.countInStock
    });
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`, authConfig);
      setMessage("Product deleted");
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <section>
      <h2>Admin Products</h2>
      <form className="card product-form" onSubmit={submitHandler}>
        <h3>{editId ? "Edit Product" : "Create Product"}</h3>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />
        <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          name="countInStock"
          type="number"
          placeholder="Stock"
          value={form.countInStock}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows="3"
          required
        />
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
        <div className="row">
          <button className="btn" type="submit">
            {editId ? "Update Product" : "Create Product"}
          </button>
          {editId && (
            <button type="button" className="danger-btn" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="grid">
        {products.map((product) => (
          <article className="card" key={product._id}>
            <h4>{product.name}</h4>
            <p className="muted">
              {product.category} | Stock: {product.countInStock}
            </p>
            <p>{formatINR(product.price)}</p>
            <div className="row">
              <button className="btn" type="button" onClick={() => startEdit(product)}>
                Edit
              </button>
              <button
                type="button"
                className="danger-btn"
                onClick={() => deleteHandler(product._id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AdminProductsPage;
