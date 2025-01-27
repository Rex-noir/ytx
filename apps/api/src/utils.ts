import type { createReadStream } from "node:fs";

export const getAudioQualityLevel = (quality: string) => {
  switch (quality) {
    case "high":
      return "1"; // Very high quality
    case "good":
      return "2"; // High quality
    case "medium":
      return "3"; // Good quality
    case "low":
      return "6"; // Low quality
    case "standard":
      return "5"; // Standard quality
    default:
      return "3"; // Default to good quality
  }
};

export function convertReadStreamToWeb(
  readStream: ReturnType<typeof createReadStream>
): ReadableStream {
  return new ReadableStream({
    start(controller) {
      readStream.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      readStream.on("end", () => {
        controller.close();
      });
      readStream.on("error", (err) => {
        controller.error(err);
      });
    },
    cancel() {
      readStream.destroy();
    },
  });
}
