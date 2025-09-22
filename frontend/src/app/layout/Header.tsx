import { ReactNode } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "@/shared/hooks/useTheme";

export default function Header({ right, title }: { right?: ReactNode; title?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <header className="home-topbar">
      <Link to="/" className="brand">Schedular</Link>
      {title && <h1 className="header-title">{title}</h1>}
      <div className="actions">
        <ThemeToggle theme={theme} onToggle={toggle} />
        {right}
        <div className="profile" aria-label="User menu">👤</div>
      </div>
    </header>
  );
}
