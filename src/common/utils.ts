import { readFileSync } from 'fs';
import { Serialize } from 'ontology-ts-crypto';

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function loadContract(path: string) {
  return readFileSync(path);
}

export function loadCompiledContract(path: string) {
  const codeBuffer = readFileSync(path);
  const codeString = codeBuffer.toString();
  return new Buffer(codeString, 'hex');
}

export function loadOptionsFile(path: string) {
  return readFileSync(path).toString();
}

export function reverseBuffer(src: Buffer) {
  const buffer = Buffer.allocUnsafe(src.length);

  for (let i = 0, j = src.length - 1; i <= j; ++i, --j) {
    buffer[i] = src[j];
    buffer[j] = src[i];
  }

  return buffer;
}

export function hex2num(str: string) {
  const buffer = new Buffer(str, 'hex');
  return Serialize.bigIntFromBytes(buffer).toJSNumber();
}
