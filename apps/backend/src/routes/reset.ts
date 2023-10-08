import fs from 'node:fs'
import { Elysia } from 'elysia'

import { setup } from '../app'
import { backupFolder } from './backups'
import { streamPartFolder, streamsFolder } from './streams'

const reset = new Elysia()
  .use(setup)
  .get('/total-reset', async ({ store: { redis } }) => {
    // Clean the redis db
    await redis.flushAll()

    // Clean the volumes
    fs.rmdirSync(backupFolder, { recursive: true })
    fs.rmdirSync(streamPartFolder, { recursive: true })
    fs.rmdirSync(streamsFolder, { recursive: true })

    // Rebuild the volumes
    fs.mkdirSync(backupFolder)
    fs.mkdirSync(streamPartFolder)
    fs.mkdirSync(streamsFolder)

    return { success: true }
  })

export default reset
