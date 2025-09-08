import AppRoutes from "../routes.tsx";
import { useSessionManager } from "../../shared";

export default function App() {
  // Initialize global session management
  useSessionManager();
  
  return <AppRoutes />;
}
