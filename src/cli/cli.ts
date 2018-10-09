import { writeFileSync } from 'fs';
import { compile, CompilerType, deploy, initClient, loadContract } from '../';
import { loadCompiledContract } from '../common/utils';
import { Deployment } from '../deployer';
import { Account } from '../types';
import { createAccount } from '../wallet';

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

export interface CliDeployOptions extends Deployment {
  address: string;
  privateKey: string;
  gasPrice: string;
  gasLimit: string;
}

export function deployCli(input: string, options: CliDeployOptions) {
  const { privateKey, address, ...rest } = options;

  const client = initClient({ rpcAddress: address });
  const account: Account = createAccount(privateKey);

  const contract = loadCompiledContract(input);

  return deploy({ client, account, code: contract, ...rest });
}
