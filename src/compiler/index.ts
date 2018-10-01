import { CsCompiler } from './csCompiler';
import { PyCompiler } from './pyCompiler';
import { CompilerType } from './types';

export interface CreateCompilerOptions {
  type: CompilerType;
  url?: string;
}

export function createCompiler({ type, url }: CreateCompilerOptions) {
  switch (type) {
    case 'Python':
      return new PyCompiler(url);
    case 'CSharp':
      return new CsCompiler(url);
    default:
      throw new Error('Unsupported compiler');
  }
}

export * from './types';
