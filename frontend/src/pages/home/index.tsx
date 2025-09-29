import { Link } from "react-router-dom";
import { HomeLayout } from "@/app/layout";
import { FrontDeskIcon, BackendIcon } from "@/app/layout/home/components";
import '@/app/layout/home/styles/index.css';

export default function HomePage() {
  return (
    <HomeLayout>
      <main className="home-hero">
        <h1 className="home-title">Welcome to Schedular</h1>
        <p className="home-subtitle">Choose a workspace to get started.</p>
        <div className="home-cards">
          <Link to="/pos" className="home-card" aria-label="Open Front Desk workspace">
            <FrontDeskIcon />
            <h2>Front Desk</h2>
          </Link>
          <Link to="/admin" className="home-card" aria-label="Open Back Office workspace">
            <BackendIcon />
            <h2>Back Office</h2>
          </Link>
        </div>
      </main>
    </HomeLayout>
  );
}
