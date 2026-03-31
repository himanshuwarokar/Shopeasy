import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Header = () => {
  const { userInfo, logout } = useAuth();
  const { items } = useCart();

  const cartCount = items.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="topbar">
      <div className="container nav-wrap">
        <Link className="logo" to="/">
          ShopEasy
        </Link>
        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/cart">Cart ({cartCount})</NavLink>
          {userInfo ? (
            <>
              <NavLink to="/orders">My Orders</NavLink>
              {userInfo.isAdmin && (
                <>
                  <NavLink to="/admin/products">Admin Products</NavLink>
                  <NavLink to="/admin/orders">Admin Orders</NavLink>
                </>
              )}
              <button type="button" className="link-btn" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
