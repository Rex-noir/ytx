import { z } from "zod";
import { audioQualitites, outputFormats, videoQualities } from "./options.js";

export const GenerateRequestSchema = z.object({
  format: z.enum(outputFormats, { message: "Invalid format" }),
  videoQuality: z.enum(videoQualities, { message: "Invalid video quality" }),
  audioQuality: z.enum(audioQualitites, { message: "Invalid audio quality" }),
  saveThumbnail: z.boolean().default(false),
  startTime: z.number().nullable().optional(),
  endTime: z.number().nullable().optional(),
  youtubeUrl: z
    .string()
    .regex(
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/|music\.youtube\.com\/watch\?v=)([\w-]{11})/,
      { message: "Invalid YouTube URL" }
    ),
});
