import { treaty } from "@elysiajs/eden";
import type { App } from "primary-backend"
import { createContext, useContext } from "react";

const client = treaty<App>("https://one-api-primary.onrender.com", {
    fetch: { credentials: 'include' }
})

export const ElysiaClientContext = createContext(client);

export const ElysiaClientProvider = ElysiaClientContext.Provider;

export const useElysiaClient = () => {
    const client = useContext(ElysiaClientContext)
    return client
}