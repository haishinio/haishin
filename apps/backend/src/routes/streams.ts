import fs from "node:fs";
import path from "node:path";

import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";

export const streamsFolder = path.join(
  process.env.RAILWAY_VOLUME_MOUNT_PATH as string,
  "streams"
);

if (!fs.existsSync(streamsFolder)) {
  fs.mkdirSync(streamsFolder);
}

const streams = new Elysia().use(
  staticPlugin({
    assets: streamsFolder,
    prefix: "/streams",
    ignorePatterns: [".gitkeep"],
  })
);

export default streams;
