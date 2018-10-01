export type CompilerType = 'CSharp' | 'Python';

export interface CompilerOutput {
  avm: Buffer;
  abi: Buffer;
  hash: string;
}

export class CompilerError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

export interface Compiler {
  compile(code: Buffer): Promise<CompilerOutput>;
}
