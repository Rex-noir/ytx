import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { api } from "./api.js";

const app = new Hono();

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
