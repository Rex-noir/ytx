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

export const GenerateRequestSchema = z.object({
  filter: z.enum(filters),
  quality: z.enum([
    ...videoQualities,
    ...audioQualities,
    ...audioQualityLevels,
  ]),
  url: z.string().url(),
  format: z.enum([...commonFormats, ...audioFormats, ...mergeFormats]),
  embedSubs: z.boolean().default(false),
  defaultQuality: z.enum(["highest", "lowest", "none"]).default("none"),
});
