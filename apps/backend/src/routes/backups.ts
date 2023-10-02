import fs from "node:fs";
import path from "node:path";
import { Elysia } from "elysia";

import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";

export const backupFolder = path.join(
  process.env.RAILWAY_VOLUME_MOUNT_PATH as string,
  "backups"
);

if (!fs.existsSync(backupFolder)) {
  fs.mkdirSync(backupFolder);
}

const files = fs.readdirSync(backupFolder);
const liFiles = files
  .map((file) => `<li><a href="/backups/${file}">${file}</a></li>`)
  .join("");

const backups = new Elysia()
  .use(
    staticPlugin({
      assets: backupFolder,
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
