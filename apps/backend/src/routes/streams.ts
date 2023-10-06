import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";

const streams = new Elysia().use(
  staticPlugin({
    assets: "data/streams",
    prefix: "/streams",
    ignorePatterns: [".gitkeep"],
  })
);

export default streams;
