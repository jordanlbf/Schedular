import { ReactNode } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "@/shared/theme/useTheme";

export default function Header({ right }: { right?: ReactNode }) {
  const { theme, toggle } = useTheme();
  return (
    <header className="home-topbar">
      <Link to="/" className="brand">Schedular</Link>
      <div className="actions">
        <ThemeToggle theme={theme} onToggle={toggle} />
        {right}
        <div className="profile" aria-label="User menu">👤</div>
      </div>
    </header>
  );
}
