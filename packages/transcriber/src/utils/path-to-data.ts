import path from 'path'

export const pathToData = (restOfFilePath: string): string => {
  return path.join(__dirname, '../../../../', 'data', restOfFilePath);
};

export default pathToData;