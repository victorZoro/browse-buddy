import fs from 'fs';
import logger from './utils/logger';
import path from 'path';
import { app, dialog } from 'electron';
import { RunTest } from './interfaces/run-test';

const defaultPath = app.getPath('downloads');

export function openFileDialog(): string | undefined {
  const filePaths = dialog.showOpenDialogSync({
    title: 'Open File',
    defaultPath: defaultPath,
    filters: [{ name: 'JSON', extensions: ['json'] }],
  });
  if (filePaths && filePaths.length > 0) {
    const filePath = filePaths[0];
    const fileData = readJsonFile(filePath);
    return fileData;
  } else {
    return undefined;
  }
}

export function saveFileDialog(jsonData: string): void {
  const runTest: RunTest = JSON.parse(jsonData);
  dialog
    .showSaveDialog({
      title: runTest.name,
      defaultPath: path.join(defaultPath, `${runTest.name}.json`),
      filters: [{ name: 'JSON', extensions: ['json'] }],
    })
    .then((fileName) => {
      if (fileName && fileName.filePath.length > 0) {
        saveJsonFile(fileName.filePath, jsonData);
      }
    });
}

export function readJsonFile(filePath: string): string | undefined {
  try {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    return fileData;
  } catch (error) {
    logger.error('Error reading JSON file:', error);
    return undefined;
  }
}

export function saveJsonFile(filePath: string, jsonData: string): void {
  try {
    fs.writeFileSync(filePath, jsonData, { encoding: 'utf-8' });
    logger.info('File successfully saved in:', filePath);
  } catch (error) {
    logger.error('Error saving file:', error);
  }
}
