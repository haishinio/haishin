import fs from "node:fs";

import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";

if (!fs.existsSync("data/streams")) {
  fs.mkdirSync("data/streams");
}

const streams = new Elysia().use(
  staticPlugin({
    assets: "data/streams",
    prefix: "/streams",
    ignorePatterns: [".gitkeep"],
  })
);

export default streams;
