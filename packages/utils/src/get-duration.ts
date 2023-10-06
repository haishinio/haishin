export function getDuration(filePath: string): string | null {
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

  console.log({ exitCode })

  if (exitCode !== 0) {
    return null
  }

  const prettyProbe = JSON.parse(probeData.join(''))
  const { duration } = prettyProbe.format

  console.log({ duration })

  return duration
}

export default getDuration
