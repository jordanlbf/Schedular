import { Link } from "react-router-dom";
import { AppLayout } from "@/app/layout";

export default function AdminPage() {
  return (
    <AppLayout>
      <h1>Backend</h1>
      <p><Link to="/" className="back-link">← Back home</Link></p>
    </AppLayout>
  );
}
