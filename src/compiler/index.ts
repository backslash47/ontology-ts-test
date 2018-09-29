import { CsCompiler } from './csCompiler';
import { PyCompiler } from './pyCompiler';
import { CompilerType } from './types';

export function createCompiler(type: CompilerType) {
  switch (type) {
    case 'Python':
      return new PyCompiler();
    case 'CSharp':
      return new CsCompiler();
    default:
      throw new Error('Unsupported compiler');
  }
}

export * from './types';
