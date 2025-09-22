import Header from "@/app/layout/Header";
import SearchCustomer from "@/features/customers/components/SearchCustomer";

export default function SearchCustomerPage() {
  return (
    <div className="home-wrap">
      <Header />
      <main className="page">
        <SearchCustomer />
      </main>
      <footer className="home-footer">© {new Date().getFullYear()} Schedular</footer>
    </div>
  );
}