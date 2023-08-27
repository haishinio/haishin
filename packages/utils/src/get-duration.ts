import { spawnSync } from 'child_process'

export function getDuration(filePath: string): string | null {
  const ffprobe = spawnSync(
    'ffprobe',
    ['-show_format', '-print_format', 'json', filePath],
    { encoding: 'utf8' }
  )

  let probeData = []
  let errData = []
  let exitCode = null

  probeData.push(ffprobe.stdout)
  errData.push(ffprobe.stderr)

  exitCode = ffprobe.status

  if (ffprobe.error || exitCode) {
    return null
  }

  const prettyProbe = JSON.parse(probeData.join(''))
  const { duration } = prettyProbe.format

  return duration
}

export default getDuration
