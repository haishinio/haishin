import fs from 'node:fs'
import path from 'node:path'
import { Elysia } from 'elysia'

import { html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static'

export const backupFolder = path.join(
  process.env.RAILWAY_VOLUME_MOUNT_PATH as string,
  'backups'
)

if (!fs.existsSync(backupFolder)) {
  fs.mkdirSync(backupFolder)
}

const backups = new Elysia()
  .use(
    staticPlugin({
      assets: backupFolder,
      prefix: '/backups',
      ignorePatterns: ['.gitkeep']
    })
  )
  .use(html())
  .get('/backups', () => {
    console.log({ backupFolder })
    const files = fs.readdirSync(backupFolder)
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
    fs.rmdirSync(backupFolder, { recursive: true })
    fs.mkdirSync(backupFolder)
    return { success: true }
  })
  .delete('/backups/:file', async ({ params: { file } }) => {
    fs.rmSync(`${backupFolder}/${file}`)
    return { success: true }
  })

export default backups
