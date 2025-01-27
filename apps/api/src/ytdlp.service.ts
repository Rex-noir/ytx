import type { GenerateRequestSchema } from "@ytx/shared/schemas";
import { getNodeEnv } from "@ytx/shared/utils";
import { spawn } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import type { z } from "zod";
import { YTX_TEMPT_DIR } from "./constants.js";

export class YtDlpService {
  private ffmpegLocation: string;

  constructor() {
    this.ffmpegLocation = getNodeEnv(
      "FFMPEG_LOCATION",
      "/usr/local/bin/ffmpeg"
    )!;
  }

  /**
   * Generate a unique output file path.
   */
  private generateOutputFilePath(): { shortUUID: string; path: string } {
    const shortUUID = crypto.randomUUID().replace(/-/g, "").substring(0, 8);
    return { shortUUID, path: `${YTX_TEMPT_DIR}/${shortUUID}.%(ext)s` };
  }

  public buildCommandArgs(
    body: z.infer<typeof GenerateRequestSchema>,
    filename: string | null = null
  ): string[] {
    const outputFilepath = filename ?? this.generateOutputFilePath().path;
    const commandArgs = [
      body.url,
      "-o",
      outputFilepath,
      "--progress-template",
      "%(progress)j",
      "--newline",
    ];

    if (this.ffmpegLocation) {
      commandArgs.push("--ffmpeg-location", this.ffmpegLocation);
    }

    switch (body.filter) {
      case "audioonly":
        if (body.quality === "bestaudio") {
          commandArgs.push("-f", "bestaudio[ext=m4a]");
        } else {
          commandArgs.push("-x", "--audio-format", body.format);
          commandArgs.push("--audio-quality", body.quality);
        }
        break;
      case "videoonly":
        commandArgs.push("-f", `bestvideo[height<=?${body.quality}]`);
        break;
      case "audioandvideo":
        commandArgs.push("-f", `bestvideo[height<=?${body.quality}]+bestaudio`);
        break;
      case "mergevideo":
        commandArgs.push("--merge-output-format", body.format); // Merge video
        break;
    }

    if (body.embedSubs) {
      commandArgs.push("--embed-subs");
    }

    if (body.addMetaData) {
      commandArgs.push("--add-metadata");
    }

    if (body.embedThumbnail) {
      commandArgs.push("--embed-thumbnail");
    }

    return commandArgs;
  }

  public async executeCommand(
    body: z.infer<typeof GenerateRequestSchema>
  ): Promise<ReadableStream> {
    if (!existsSync(YTX_TEMPT_DIR!)) {
      mkdirSync(YTX_TEMPT_DIR!, { recursive: true });
    }

    const filePath = this.generateOutputFilePath();
    const commandArgs = this.buildCommandArgs(body, filePath.path);

    console.log("Executing yt-dlp with command:", commandArgs);

    const ytdlpProcess = spawn("yt-dlp", commandArgs);

    const stream = new ReadableStream({
      start(controller) {
        ytdlpProcess.stdout.on("data", (data) => {
          const progress = data.toString().trim();
          console.log(progress);
          controller.enqueue(`${progress}\n\n`);
        });

        ytdlpProcess.stderr.on("data", (data) => {
          const error = data.toString();
          console.error(error);
          controller.enqueue(`error: ${error}\n\n`);
        });
        ytdlpProcess.on("close", async (code) => {
          console.log(`yt-dlp process exited with code ${code}`);
          if (code === 0) {
            try {
              // Send the file information as the last event
              controller.enqueue(
                `${JSON.stringify({ status: "complete", file: join(YTX_TEMPT_DIR!, `${filePath.shortUUID}.${body.format}`) })}\n\n`
              );
            } catch (error) {
              controller.enqueue(`error: ${error}\n\n`);
            }
          } else {
            controller.enqueue(`error: Process exited with code ${code}\n\n`);
          }
          controller.close();
        });
      },
    });

    return stream;
  }
}
