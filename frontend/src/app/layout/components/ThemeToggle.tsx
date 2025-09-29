import { Theme } from "@/shared/hooks/useTheme";
import './ThemeToggle.css';

export default function ThemeToggle({
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
