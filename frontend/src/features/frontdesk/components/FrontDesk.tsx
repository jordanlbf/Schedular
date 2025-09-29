import { Link } from "react-router-dom";
import { Header, Footer, ActionBar } from "@/app/layout";
import { CreateSaleIcon, CheckStockIcon, SearchCustomerIcon } from "./icons";
import "../styles/index.css";

export default function FrontDesk() {
  return (
    <div className="home-wrap frontdesk">
      <Header />
      <main className="home-hero">
        <h1 className="home-title">Dashboard</h1>
        <p className="home-subtitle">Choose an action to begin.</p>
        <div className="home-cards" role="list">
          <Link to="/pos/sale" className="home-card" role="listitem" aria-label="Create Sale">
            <CreateSaleIcon />
            <h2>Create Sale</h2>
          </Link>
          <Link to="/pos/stock" className="home-card" role="listitem" aria-label="Check Stock">
            <CheckStockIcon />
            <h2>Check Stock</h2>
          </Link>
          <Link to="/pos/customer" className="home-card" role="listitem" aria-label="Search Customer">
            <SearchCustomerIcon />
            <h2>Search Customer</h2>
          </Link>
        </div>
      </main>
      <Footer />
      <ActionBar />
    </div>
  );
}
