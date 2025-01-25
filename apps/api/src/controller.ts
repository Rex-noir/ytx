import { GenerateRequestSchema } from "@ytx/shared/schemas";
import type { Context } from "hono";

export const getFormats = (c: Context) => {
  return c.json({});
};

export const generateDownloadLink = async (c: Context) => {
  const body = GenerateRequestSchema.parse(await c.req.parseBody());
  console.log(body);
  return c.json({
    message: "Hello World",
  });
};
