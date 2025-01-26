import { z } from "zod";
import {
  audioFormats,
  audioQualities,
  audioQualityLevels,
  commonFormats,
  filters,
  mergeFormats,
  videoQualities,
} from "./options.js";

// Regular expressions for YouTube and YouTube Music URLs
const youtubeRegex =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
const youtubeMusicRegex =
  /^(https?:\/\/)?(www\.)?(music\.youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

// Custom validation function
const validateYouTubeUrl = (url: string) => {
  return youtubeRegex.test(url) || youtubeMusicRegex.test(url);
};

export const GenerateRequestSchema = z.object({
  filter: z.enum(filters, {
    message:
      "Invalid filter. Please make sure you are selecting a valid filter.",
  }),
  quality: z.enum(
    [...videoQualities, ...audioQualities, ...audioQualityLevels],
    {
      message:
        "Invalid quality. Please make sure you are selecting a valid quality.",
    }
  ),
  url: z.string().refine(
    (url) => {
      return validateYouTubeUrl(url);
    },
    {
      message: "Please provide a valid YouTube or YouTube Music URL.",
    }
  ),
  format: z.enum([...commonFormats, ...audioFormats, ...mergeFormats], {
    message: "Please make sure you are selecting a valid format.",
  }),
  embedSubs: z.boolean().default(false),
  defaultQuality: z.enum(["highest", "lowest", "none"]).default("none"),
});
