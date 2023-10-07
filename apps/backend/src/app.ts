import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

import backups from './routes/backups'
import streams from './routes/streams'
import ws from './routes/ws'

const app = new Elysia()
  .use(cors())
  .use(backups)
  .use(streams)
  .use(ws)
  .listen({
    hostname: '0.0.0.0',
    port: process.env.PORT || 8080
  })

console.log(
  `Haishin Api is running at ${app.server?.hostname}:${app.server?.port}`
)
