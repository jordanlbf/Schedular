import { useEffect, useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import "./home.css";

type Theme = "light" | "dark";
const THEME_KEY = "schedular-theme";

function getInitialTheme(): Theme {
  const saved = localStorage.getItem(THEME_KEY) as Theme | null;
  if (saved === "light" || saved === "dark") return saved;
  return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("theme-light", "theme-dark");
  root.classList.add(`theme-${theme}`);
}

function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: Theme;
  onToggle: () => void;
}) {
  return (
    <div className="theme-toggle" role="group" aria-label="Color theme">
      <span className={`theme-label ${theme === "dark" ? "active" : ""}`}>DARK</span>
      <button
        className="switch"
        onClick={onToggle}
        role="switch"
        aria-checked={theme === "light"}
        title="Toggle theme"
      >
        <span className="knob" />
      </button>
      <span className={`theme-label ${theme === "light" ? "active" : ""}`}>LIGHT</span>
    </div>
  );
}

function Home() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  return (
    <div className="home-wrap">
      <header className="home-topbar">
        <div className="brand">Schedular</div>
        <div className="actions">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <div className="profile" aria-label="User menu">👤</div>
        </div>
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

      <footer className="home-footer">© {new Date().getFullYear()} Schedular</footer>
    </div>
  );
}

function POS() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  return (
    <div className="home-wrap">
      <header className="home-topbar">
        <div className="brand">Schedular</div>
        <div className="actions">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <div className="profile" aria-label="User menu">👤</div>
        </div>
      </header>

      <main className="home-hero">
        <h1 className="home-title">Front Desk</h1>
        <p className="home-subtitle">Choose an action to begin.</p>

        <div className="home-cards">
          <Link to="/pos/sale" className="home-card" aria-label="Create Sale">
            <span className="emoji" aria-hidden>🧾</span>
            <h2>Create Sale</h2>
          </Link>

          <Link to="/pos/stock" className="home-card" aria-label="Check Stock">
            <span className="emoji" aria-hidden>📦</span>
            <h2>Check Stock</h2>
          </Link>

          <Link to="/pos/customer" className="home-card" aria-label="Search Customer">
            <span className="emoji" aria-hidden>🧍</span>
            <h2>Search Customer</h2>
          </Link>
        </div>
      </main>

      <footer className="home-footer">© {new Date().getFullYear()} Schedular</footer>
    </div>
  );
}

function CreateSale() {
  return (
    <div className="page">
      <h1>Create Sale</h1>
      <p><Link to="/pos" className="back-link">← Back to Front Desk</Link></p>
    </div>
  );
}

function CheckStock() {
  return (
    <div className="page">
      <h1>Check Stock</h1>
      <p><Link to="/pos" className="back-link">← Back to Front Desk</Link></p>
    </div>
  );
}

function SearchCustomer() {
  return (
    <div className="page">
      <h1>Search Customer</h1>
      <p><Link to="/pos" className="back-link">← Back to Front Desk</Link></p>
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
      <Route path="/pos/sale" element={<CreateSale />} />
      <Route path="/pos/stock" element={<CheckStock />} />
      <Route path="/pos/customer" element={<SearchCustomer />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
