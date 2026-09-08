import type { App } from "primary-backend"
import { treaty } from "@elysiajs/eden";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { ApiKeys } from "./pages/ApiKeys";
import { Credits } from "./pages/Credits";
import { Docs } from "./pages/Docs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ElysiaClientProvider } from "./providers/Eden";
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient()


export function App() {
  const client = treaty<App>("https://one-api-primary.onrender.com", {
    fetch: { credentials: 'include' }
  })

  function AppRoutes() {
    const { data, isLoading } = useAuth();
    const isSignedIn = !!data;

    return (
       <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/docs" element={<Docs />} />

      <Route
        path="/dashboard"
        element={isSignedIn ? <Dashboard /> : <Navigate to="/signin" />}
      />

      <Route
        path="/api-keys"
        element={isSignedIn ? <ApiKeys /> : <Navigate to="/signin" />}
      />

      <Route
        path="/credits"
        element={isSignedIn ? <Credits /> : <Navigate to="/signin" />}
      />
    </Routes>
    );
  }



  return (
    <QueryClientProvider client={queryClient}>
      <ElysiaClientProvider value={client}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ElysiaClientProvider>
    </QueryClientProvider>
  );
}

export default App;
