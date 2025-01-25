import { serve } from "@hono/node-server";
import { getNodeEnv } from "@ytx/shared/utils";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { ZodError } from "zod";
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

app.onError((error, c) => {
  if (error instanceof ZodError) {
    return c.json(
      {
        message: error.message,
        issues: error.issues,
      },
      400
    );
  }
  return c.json(
    {
      message: error.message,
      stack: error.stack,
    },
    500
  );
});

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
