import { readFileSync } from 'fs';
import * as Long from 'long';
import { Address, OpCode, ProgramBuilder, Serialize } from 'ontology-ts-crypto';
import { Struct } from './struct';

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

export function pushParam(parameter: any, builder: ProgramBuilder) {
  if (typeof parameter === 'boolean') {
    builder.pushBool(parameter);
    builder.writeOpCode(OpCode.PUSH0);
    builder.writeOpCode(OpCode.BOOLOR);
  } else if (typeof parameter === 'number') {
    builder.pushNum(parameter);
    builder.writeOpCode(OpCode.PUSH0);
    builder.writeOpCode(OpCode.ADD);
  } else if (parameter instanceof Long) {
    builder.pushNum(parameter);
    builder.writeOpCode(OpCode.PUSH0);
    builder.writeOpCode(OpCode.ADD);
  } else if (typeof parameter === 'string') {
    builder.pushBytes(new Buffer(parameter));
  } else if (parameter instanceof Buffer) {
    builder.pushBytes(parameter);
  } else if (parameter instanceof Address) {
    builder.pushBytes(parameter.toArray());
  } else if (parameter instanceof Map) {
    pushMap(parameter, builder);
  } else if (parameter instanceof Struct) {
    pushStruct(parameter, builder);
  } else if (Array.isArray(parameter)) {
    pushArray(parameter, builder);
  } else if (typeof parameter === 'object') {
    // this is last, because other classes are also objects
    pushMap(new Map(Object.entries(parameter)), builder);
  } else {
    throw new Error('Unsupported param type');
  }
}

export function pushArray(parameters: any[], builder: ProgramBuilder) {
  parameters.reverse().forEach((parameter) => pushParam(parameter, builder));

  builder.pushNum(parameters.length);
  builder.writeOpCode(OpCode.PACK);
}

export function pushStruct(parameters: Struct, builder: ProgramBuilder) {
  builder.pushNum(0);
  builder.writeOpCode(OpCode.NEWSTRUCT);
  builder.writeOpCode(OpCode.TOALTSTACK);

  parameters.items.reverse().forEach((parameter) => {
    pushParam(parameter, builder);
    builder.writeOpCode(OpCode.DUPFROMALTSTACK);
    builder.writeOpCode(OpCode.SWAP);
    builder.writeOpCode(OpCode.APPEND);
  });

  builder.writeOpCode(OpCode.FROMALTSTACK);
}

export function pushMap(parameters: Map<any, any>, builder: ProgramBuilder) {
  builder.writeOpCode(OpCode.NEWMAP);
  builder.writeOpCode(OpCode.TOALTSTACK);

  Array.from(parameters.entries())
    .reverse()
    .forEach(([key, value]) => {
      builder.writeOpCode(OpCode.DUPFROMALTSTACK);
      pushParam(key, builder);
      pushParam(value, builder);
      builder.writeOpCode(OpCode.SETITEM);
    });

  builder.writeOpCode(OpCode.FROMALTSTACK);
}
