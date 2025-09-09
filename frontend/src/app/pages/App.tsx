import { AppRouter } from "@/core/router";
import { useSessionManager } from "@/shared/hooks";

export default function App() {
  useSessionManager();
  
  return <AppRouter />;
}
