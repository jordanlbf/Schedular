import type { ReactNode } from 'react';
import Header from './Header';

interface AppLayoutProps {
  children: ReactNode;
  headerProps?: {
    title?: string;
    right?: ReactNode;
  };
}

/**
 * Standard application layout with header and footer
 * Used for most internal pages (not home page)
 */
export default function AppLayout({ children, headerProps }: AppLayoutProps) {
  return (
    <div className="home-wrap">
      <Header {...headerProps} />
      <main className="page">
        {children}
      </main>
      <footer className="home-footer">
        © {new Date().getFullYear()} Schedular
      </footer>
    </div>
  );
}