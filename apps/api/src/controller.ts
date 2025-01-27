import { GenerateRequestSchema } from "@ytx/shared/schemas";
import type { Context } from "hono";
import { stream } from "hono/streaming";
import mime from "mime";
import { createReadStream, statSync } from "node:fs";
import { YtDlpService } from "./ytdlp.service.js";

export const generateDownloadLink = async (c: Context) => {
  const body = GenerateRequestSchema.parse(await c.req.json());

  const ytdlpService = new YtDlpService();

  const stream = await ytdlpService.executeCommand(body);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};

export const downloadFile = async (c: Context) => {
  // Extract the file path from the query parameter or path parameter
  const filePath = c.req.query("file") || c.req.param("file");

  if (!filePath) {
    return c.json({ error: "No filename provided" }, 400); // 400 Bad Request
  }

  try {
    const stat = statSync(filePath);
    if (!stat.isFile()) {
      return c.json({ error: "Path is not a file" }, 404); // 404 Not Found
    }
  } catch (error) {
    return c.json({ error: "File not found" }, 404); // 404 Not Found
  }

  const mimeType = mime.getType(filePath) || "application/octet-stream";
  c.header("Content-Type", mimeType);

  const fileStream = createReadStream(filePath);

  const webReadableStream = new ReadableStream({
    start(controller) {
      fileStream.on("data", (chunk) => controller.enqueue(chunk));
      fileStream.on("end", () => controller.close());
      fileStream.on("error", (err) => controller.error(err));
    },
    cancel() {
      fileStream.destroy();
    },
  });

  return stream(c, async (stream) => {
    stream.onAbort(() => {
      console.log("Download aborted by the client");
      fileStream.destroy();
    });

    await stream.pipe(webReadableStream);
  });
};
