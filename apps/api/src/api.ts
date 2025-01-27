import { Hono } from "hono";
import { downloadFile, generateDownloadLink } from "./controller.js";

export const api = new Hono();

api.post("/generate-download-link", generateDownloadLink);
api.get("/file/:file", downloadFile);
