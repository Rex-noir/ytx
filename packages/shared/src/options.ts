// Common quality options
export const videoQualitiesMap = {
  "2160": "2160p",
  "1440": "1440p",
  "1080": "1080p",
  "720": "720p",
  "480": "480p",
  "360": "360p",
  "240": "240p",
  "144": "144p",
  "bv*+ba/b": "Best Quality",
} as const;

export const audioQualities = [
  "bestaudio",
  "high",
  "good",
  "medium",
  "low",
  "standard",
  "poor",
] as const;

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

export const videoFormats = ["mkv", "mp4", "webm"] as const;

export const audioQualityMap = {
  bestaudio: "Best Audio",
  1: "High Quality",
  2: "Good Quality",
  3: "Medium Quality",
  5: "Standard Quality",
  4: "Low Quality",
} as const;

export const filtersMap = {
  mergevideo: "Merge Video",
  audioonly: "Audio Only",
  videoonly: "Video Only",
  audioandvideo: "Audio and Video",
} as const;

export const optionInfoMap = {
  mergevideo: "Merge video and audio into a single file",
  audioonly: "Download only audio",
  videoonly: "Download only video without audio",
  audioandvideo: "Download both audio and video separately then merge them.",
};
