import { Routes, Route, Link, Navigate } from "react-router-dom";
import "./home.css";

function Home() {
  return (
    <div className="home-wrap">
      <header className="home-topbar">
        <div className="brand">Schedular</div>
        <div className="profile" aria-label="User menu">👤</div>
      </header>

      <main className="home-hero">
        <h1 className="home-title">Welcome to Schedular</h1>
        <p className="home-subtitle">Choose a workspace to get started.</p>

        <div className="home-cards">
          <Link to="/pos" className="home-card" aria-label="Open Front Desk workspace">
            <span className="emoji" aria-hidden>💳</span>
            <h2>Front Desk</h2>
          </Link>

          <Link to="/admin" className="home-card" aria-label="Open Backend workspace">
            <span className="emoji" aria-hidden>🛠️</span>
            <h2>Backend</h2>
          </Link>
        </div>
      </main>

      <footer className="home-footer">
        © {new Date().getFullYear()} Schedular
      </footer>
    </div>
  );
}

function POS() {
  return (
    <div className="page">
      <h1>Front Desk</h1>
      <p><Link to="/" className="back-link">← Back home</Link></p>
    </div>
  );
}

function Admin() {
  return (
    <div className="page">
      <h1>Backend</h1>
      <p><Link to="/" className="back-link">← Back home</Link></p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pos" element={<POS />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
