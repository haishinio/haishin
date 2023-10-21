import fs from 'node:fs'
import path from 'node:path'
import { Elysia } from 'elysia'

import { html } from '@elysiajs/html'

export const backupsFolder = path.join(
  process.env.RAILWAY_VOLUME_MOUNT_PATH as string,
  'backups'
)

if (!fs.existsSync(backupsFolder)) {
  fs.mkdirSync(backupsFolder)
}

const backups = new Elysia()
  .use(html())
  .get('/backups', () => {
    const files = fs.readdirSync(backupsFolder)
    const liFiles = files
      .map((file) => `<li><a href="/backups/${file}">${file}</a></li>`)
      .join('')

    return `
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
  })
  .get('/wipe-backups', async () => {
    fs.rmdirSync(backupsFolder, { recursive: true })
    fs.mkdirSync(backupsFolder)
    return { success: true }
  })
  .delete('/backups/:file', async ({ params: { file } }) => {
    fs.rmSync(`${backupsFolder}/${file}`)
    return { success: true }
  })

export default backups
