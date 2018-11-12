export type CompilerType = 'CSharp' | 'Python';

export interface CompilerOutput {
  avm: Buffer;
  abi: Buffer;
  hash: string;
}

export interface Debug {
  avm: {
    name: string;
    hash: string;
  };

  compiler: {
    name: string;
    version: string;
  };

  files: Array<{ id: string; url: string }>;

  map: Array<{ start: number; end: number; file: number; method: string; line: number; file_line_no: number }>;
  breakpoints: any[];
}

export interface FuncMap {
  Functions: Array<{ Method: string; VarMap: { [key: string]: number } }>;
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
