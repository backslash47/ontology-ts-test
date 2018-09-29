import { readFileSync } from 'fs';

export function loadContract(path: string) {
  return readFileSync(path);
}
