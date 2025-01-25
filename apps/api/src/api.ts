import { Hono } from "hono";
import { generateDownloadLink } from "./controller.js";

export const api = new Hono();

api.post("/generate-download-link", generateDownloadLink);
