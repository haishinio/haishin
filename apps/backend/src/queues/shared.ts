import Queue from 'bee-queue'

export const simulataneousJobs = 20

const options = {
  removeOnSuccess: true,
  redis: {
    url: process.env.REDIS_URL
  }
}
export const restreamingQueue = new Queue('restreaming', options)
export const transcribingQueue = new Queue('transcribing', options)
export const thumbnailGeneratingQueue = new Queue('thumbnail', options)
