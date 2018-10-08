import { writeFileSync } from 'fs';
import { compile, CompilerType, loadContract } from '../';

export function compileCli(input: string, outputAvm?: string, outputAbi?: string): Promise<void> {
  let type: CompilerType;

  if (input.endsWith('cs')) {
    type = 'CSharp';
  } else if (input.endsWith('py')) {
    type = 'Python';
  } else {
    throw new Error('Unsupported compiler type');
  }

  const contract = loadContract(input);

  return compile({ code: contract, type }).then(({ avm, abi }) => {
    const base = input.substr(0, input.lastIndexOf('.'));
    if (outputAvm === undefined) {
      outputAvm = base + '.avm';
    }

    if (outputAbi === undefined) {
      outputAbi = base + '.abi';
    }

    writeFileSync(outputAvm, avm);
    writeFileSync(outputAbi, abi);
  });
}
