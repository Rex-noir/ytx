import { getNodeEnv } from "@ytx/shared/utils";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const YTX_TEMPT_DIR = getNodeEnv("TEMP_DIR", join(tmpdir(), "ytx"));
