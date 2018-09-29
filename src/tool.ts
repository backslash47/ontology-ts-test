import { CompilerType, createCompiler } from './compiler';

export class Tool {
  migrate() {}

  invoke() {}

  compile(code: Buffer, type: CompilerType) {
    const compiler = createCompiler(type);
    return compiler.compile(code);
  }

  func() {}
}
