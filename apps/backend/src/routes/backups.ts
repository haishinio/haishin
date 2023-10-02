import fs from "node:fs";
import { Elysia } from "elysia";

import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";

if (!fs.existsSync("data/backups")) {
  fs.mkdirSync("data/backups");
}

const files = fs.readdirSync("data/backups");
const liFiles = files
  .map((file) => `<li><a href="/backups/${file}">${file}</a></li>`)
  .join("");

const backups = new Elysia()
  .use(
    staticPlugin({
      assets: "data/backups",
      prefix: "/backups",
      ignorePatterns: [".gitkeep"],
    })
  )
  .use(html())
  .get(
    "/backups",
    () => `
    <html>
      <head>
        <title>Haishin Backups</title>
      </head>
      <body>
        <ul>
          ${liFiles}
        </ul>
      </body>
    </html>
    `
  );

export default backups;
