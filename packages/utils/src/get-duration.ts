export function getDuration(filePath: string): number {
  const ffprobe = Bun.spawnSync([
    'ffprobe',
    '-show_format',
    '-print_format',
    'json',
    filePath
  ])

  let probeData = []
  let errData = []
  let exitCode = null

  probeData.push(ffprobe.stdout.toString())
  errData.push(ffprobe.stderr.toString())

  exitCode = ffprobe.exitCode

  if (exitCode !== 0) {
    return -1
  }

  const prettyProbe = JSON.parse(probeData.join(''))
  const { duration } = prettyProbe.format

  return Math.floor(parseFloat(duration))
}

export default getDuration
