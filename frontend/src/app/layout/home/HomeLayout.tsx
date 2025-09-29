import type { ReactNode } from 'react';
import Header from '../Header';
import './HomeLayout.css';

interface HomeLayoutProps {
  children: ReactNode;
  headerProps?: {
    title?: string;
    right?: ReactNode;
  };
}

/**
 * Home page layout with custom styling
 * Used for landing/dashboard pages
 */
export default function HomeLayout({ children, headerProps }: HomeLayoutProps) {
  return (
    <div className="home-wrap">
      <Header {...headerProps} />
      {children}
      <footer className="home-footer">
        © {new Date().getFullYear()} Schedular
      </footer>
    </div>
  );
}