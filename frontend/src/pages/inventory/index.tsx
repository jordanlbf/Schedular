import { AppLayout } from "@/app/layout";
import CheckStock from "@/features/inventory/components/CheckStock";

export default function InventoryPage() {
  return (
    <AppLayout>
      <CheckStock />
    </AppLayout>
  );
}