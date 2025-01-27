import { z } from "zod";
import {
  audioFormats,
  audioQualityMap,
  filtersMap,
  videoFormats,
  videoQualitiesMap,
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

export const GenerateRequestSchema = z
  .object({
    filter: z.enum(Object.keys(filtersMap) as [string, ...string[]], {
      message:
        "Invalid filter. Please make sure you are selecting a valid filter.",
    }),
    quality: z.enum(
      [
        ...(Object.keys(videoQualitiesMap) as [string, ...string[]]),
        ...(Object.keys(audioQualityMap) as [string, ...string[]]),
      ],
      {
        message:
          "Invalid quality. Please make sure you are selecting a valid quality.",
      }
    ),
    url: z.string({ message: "URL must be type of string" }).refine(
      (url) => {
        return validateYouTubeUrl(url);
      },
      {
        message: "Please provide a valid YouTube or YouTube Music URL.",
      }
    ),
    format: z.enum([...videoFormats, ...audioFormats], {
      message: "Please make sure you are selecting a valid format.",
    }),
    embedSubs: z.boolean().default(false),
    addMetaData: z.boolean().default(true),
    audioQuality: z
      .enum(Object.keys(audioQualityMap) as [string, ...string[]], {
        message: "Please make sure you are selecting a valid audio quality.",
      })
      .nullable()
      .optional(),
    embedThumbnail: z.boolean().default(true),
  })
  .refine(
    (data) => {
      if (data.filter === "audioandvideo") {
        return data.audioQuality !== null && data.audioQuality !== undefined;
      }
      return true;
    },
    {
      message: "audioQuality is required when filter is 'audioandvideo'.",
      path: ["audioQuality"],
    }
  );
