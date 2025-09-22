import { Link } from "react-router-dom";
// @ts-ignore
import Header from "@/app/layout/Header.tsx";

export default function Index() {
  return (
    <div className="home-wrap">
      <Header />
      <main className="page">
        <h1>Backend</h1>
        <p><Link to="/" className="back-link">← Back home</Link></p>
      </main>
      <footer className="home-footer">© {new Date().getFullYear()} Schedular</footer>
    </div>
  );
}
