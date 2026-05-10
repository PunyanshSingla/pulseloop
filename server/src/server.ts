import app from "./app";
import { env } from "./config/env";
import { auth } from "./config/auth";
import { toNodeHandler } from "better-auth/node";
app.all("/api/auth/*splat", toNodeHandler(auth));
const PORT = env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});