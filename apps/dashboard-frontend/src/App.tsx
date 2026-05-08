import type { App } from "app"
import { treaty } from "@elysiajs/eden";
import { BrowserRouter, Route, Routes } from "react-router";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { ApiKeys } from "./pages/ApiKeys";
import { Credits } from "./pages/Credits";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ElysiaClientProvider } from "./providers/Eden";

const queryClient = new QueryClient()


export function App() {
  const client = treaty<App>('localhost:3000', {
    fetch: { credentials: 'include' }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ElysiaClientProvider value={client}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/api-keys" element={<ApiKeys />} />
            <Route path="/credits" element={<Credits />} />
          </Routes>
        </BrowserRouter>
      </ElysiaClientProvider>
    </QueryClientProvider>
  );
}

export default App;
