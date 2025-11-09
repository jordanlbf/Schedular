import { AppRouter } from "./routing";
import { AuthProvider } from "@/core/auth";
import { useSessionManager } from "@/shared/hooks";

export default function App() {
  useSessionManager();

  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
