import { Link } from "react-router-dom";
export default function SearchCustomer() {
  return (
    <div className="page">
      <h1>Search Customer</h1>
      <p><Link to="/pos" className="back-link">← Back to Front Desk</Link></p>
    </div>
  );
}
