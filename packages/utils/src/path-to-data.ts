import path from 'path'

export const pathToData = (restOfFilePath: string): string => {
  return path.join(process.cwd(), 'data', restOfFilePath)
}

export default pathToData
