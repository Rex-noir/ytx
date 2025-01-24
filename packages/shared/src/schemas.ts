import { z } from "zod";
import { audioQualitites, outputFormats, videoQualities } from "./options.js";

export const GenerateRequestSchema = z.object({
  format: z.enum(outputFormats, { message: "Invalid format" }),
  videoQuality: z.enum(videoQualities, { message: "Invalid video quality" }),
  audioQuality: z.enum(audioQualitites, { message: "Invalid audio quality" }),
  saveThumbnail: z.boolean(),
});
