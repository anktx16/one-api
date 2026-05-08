

import cors from "@elysiajs/cors"
import { app } from "./app"

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
})).listen(3000)