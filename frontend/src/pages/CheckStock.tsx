import { Link } from "react-router-dom";
export default function CheckStock() {
  return (
    <div className="page">
      <h1>Check Stock</h1>
      <p><Link to="/pos" className="back-link">← Back to Front Desk</Link></p>
    </div>
  );
}
