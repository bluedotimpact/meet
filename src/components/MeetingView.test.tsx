import { test, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ZOOM_VERSION } from './MeetingView';

test('zoom package.json version matches source version', () => {
  const packageJson = JSON.parse(readFileSync(join(__dirname, '..', '..', 'package.json'), { encoding: 'utf-8' }));
  const packageJsonVersion = packageJson.dependencies['@zoomus/websdk'].replace(/[\^~><]/g, '');

  expect(packageJsonVersion).toBe(ZOOM_VERSION);
});
