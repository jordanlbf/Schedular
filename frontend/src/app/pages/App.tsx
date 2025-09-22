import { AppRouter } from "../routing";
import { useSessionManager } from "@/shared/hooks";

export default function App() {
  useSessionManager();
  
  return <AppRouter />;
}
