import './Footer.css';

/**
 * Shared footer component with copyright information
 * Used across different layouts
 */
export default function Footer() {
  return (
    <footer className="app-footer">
      © {new Date().getFullYear()} Schedular
    </footer>
  );
}