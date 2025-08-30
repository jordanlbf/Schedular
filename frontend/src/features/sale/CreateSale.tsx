import { Link } from "react-router-dom";

export default function CreateSale() {
  return (
    <div className="page">
      <h1>Create Sale</h1>
      <p><Link to="/pos" className="back-link">← Back to Front Desk</Link></p>
    </div>
  );
}
