import fs from 'node:fs'
import { Elysia } from 'elysia'

import { setup } from '../plugins/setup'
import { backupsFolder } from './backups'
import { streamPartsFolder, streamsFolder } from './streams'

const reset = new Elysia()
  .use(setup)
  .get('/total-reset', async ({ store: { redis } }) => {
    // Clean the redis db
    await redis.flushAll()

    // Clean the volumes
    fs.rmdirSync(backupsFolder, { recursive: true })
    fs.rmdirSync(streamPartsFolder, { recursive: true })
    fs.rmdirSync(streamsFolder, { recursive: true })

    // Rebuild the volumes
    fs.mkdirSync(backupsFolder)
    fs.mkdirSync(streamPartsFolder)
    fs.mkdirSync(streamsFolder)

    return { success: true }
  })

export default reset
