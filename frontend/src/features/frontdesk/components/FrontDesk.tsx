import { Link } from "react-router-dom";
import Header from "@/app/layout/Header";
import "../styles/index.css";

export default function FrontDesk() {
  return (
    <div className="home-wrap frontdesk">
      <Header />
      <main className="home-hero">
        <h1 className="home-title">Front Desk</h1>
        <p className="home-subtitle">Choose an action to begin.</p>
        <div className="home-cards" role="list">
          <Link to="/pos/sale" className="home-card" role="listitem" aria-label="Create Sale">
            <span className="emoji" aria-hidden>🧾</span>
            <h2>Create Sale</h2>
          </Link>
          <Link to="/pos/stock" className="home-card" role="listitem" aria-label="Check Stock">
            <span className="emoji" aria-hidden>📦</span>
            <h2>Check Stock</h2>
          </Link>
          <Link to="/pos/customer" className="home-card" role="listitem" aria-label="Search Customer">
            <span className="emoji" aria-hidden>🧍</span>
            <h2>Search Customer</h2>
          </Link>
        </div>
      </main>
      <footer className="home-footer">© {new Date().getFullYear()} Schedular</footer>
    </div>
  );
}
