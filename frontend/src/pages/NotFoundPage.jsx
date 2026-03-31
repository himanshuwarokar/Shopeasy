import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <section className="card">
    <h2>Page Not Found</h2>
    <p>The page you requested does not exist.</p>
    <Link to="/" className="btn">
      Back Home
    </Link>
  </section>
);

export default NotFoundPage;
