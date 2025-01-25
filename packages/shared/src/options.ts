// Common quality options
export const videoQualities = [
  "2160p",
  "1440p",
  "1080p",
  "720p",
  "480p",
  "360p",
  "240p",
  "144p",
  "highest",
  "lowest",
] as const;

export const audioQualities = ["highest", "lowest"] as const;

export const commonFormats = ["mp4", "webm"] as const;

export const audioFormats = [
  "mp3",
  "m4a",
  "ogg",
  "wav",
  "flac",
  "aac",
  "opus",
  "vorbis",
  "alac",
] as const;

export const mergeFormats = ["mkv", "mp4", "webm", "fiv"] as const;

export const audioQualityLevels = [
  "1",
  "2",
  "3",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "10",
] as const;

export const filters = [
  "audioonly",
  "videoonly",
  "audioandvideo",
  "mergevideo",
] as const;

// Configurations
export const videoOnly = {
  qualities: videoQualities,
  format: commonFormats,
  filter: "videoonly",
} as const;

export const audioOnly = {
  qualities: audioQualities,
  filter: "audioonly",
} as const;

export const audioAndVideo = {
  filter: "audioandvideo",
  qualities: audioQualities,
  format: commonFormats,
} as const;

export const mergeVideo = {
  filter: "mergevideo",
  qualities: videoQualities,
  format: mergeFormats,
  defaultQuality: ["highest", "lowest", "none"],
} as const;

export const extractAudio = {
  quality: audioQualityLevels,
  format: audioFormats,
} as const;
