import { Link } from "react-router-dom";
import Header from "@/app/layout/Header.tsx";

export default function Index() {
  return (
    <div className="home-wrap">
      <Header />
      <main className="home-hero">
        <h1 className="home-title">Welcome to Schedular</h1>
        <p className="home-subtitle">Choose a workspace to get started.</p>
        <div className="home-cards">
          <Link to="/pos" className="home-card" aria-label="Open Front Desk workspace">
            <div className="card-icon front-desk-icon"></div>
            <h2>Front Desk</h2>
          </Link>
          <Link to="/admin" className="home-card" aria-label="Open Backend workspace">
            <div className="card-icon backend-icon"></div>
            <h2>Backend</h2>
          </Link>
        </div>
      </main>
      <footer className="home-footer">© {new Date().getFullYear()} Schedular</footer>
    </div>
  );
}
