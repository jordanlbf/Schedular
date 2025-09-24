import Header from "@/app/layout/Header";
import CheckStock from "@/features/inventory/components/CheckStock";

export default function CheckStockPage() {
  return (
    <div className="home-wrap">
      <Header />
      <main className="page">
        <CheckStock />
      </main>
      <footer className="home-footer">© {new Date().getFullYear()} Schedular</footer>
    </div>
  );
}