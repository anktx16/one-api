import { Elysia } from "elysia";
import { app as authApp } from "./modules/auth"
import { app as apikeyApp } from "./modules/apikeys"
import { app as modelsApp } from "./modules/models"
import { app as paymentsApp } from "./modules/payments"


export const app = new Elysia()
    .use(authApp)
    .use(apikeyApp)
    .use(modelsApp)
    .use(paymentsApp)

export type App = typeof app