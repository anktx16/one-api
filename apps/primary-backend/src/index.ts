import cors from "@elysiajs/cors";
import { app } from "./app";

app.use(
  cors({
    origin: true,
    credentials: true,
  })
).listen(Number(process.env.PORT) || 3000, () => {
  console.log(`Primary backend running on port ${process.env.PORT || 3000}`);
});