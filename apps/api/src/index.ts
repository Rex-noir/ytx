import { serve } from "@hono/node-server";
import { getNodeEnv } from "@ytx/shared/utils";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { api } from "./api.js";

const app = new Hono();
app.use(
  cors({
    origin: getNodeEnv("FRONTEND_URL", "http://localhost:5173")!,
    allowHeaders: ["*"],
    allowMethods: ["*"],
  })
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api", api);

const port = 3000;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server started on http://localhost:${info.port}`);
  }
);
