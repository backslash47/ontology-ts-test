import { writeFileSync } from 'fs';
import { Account } from 'ontology-ts-crypto';
import { compile, CompilerType, deploy, initClient, invoke, loadContract } from '../';
import { loadCompiledContract, loadOptionsFile } from '../common/utils';
import { Deployment } from '../deployer';
import { Invoke } from '../invoker';
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

export interface CliInvokeOptions extends Invoke {
  address?: string;
  privateKey?: string;
  gasPrice?: string;
  gasLimit?: string;
  preExec?: boolean;
}

type ParameterType = 'String' | 'Number' | 'Boolean' | 'Array' | 'Struct' | 'Map' | 'ByteArray';

interface ParameterOptions {
  value: any;
  type: ParameterType;
}

interface CliInvokeFileOptions {
  address?: string;
  privateKey?: string;
  gasPrice?: string;
  gasLimit?: string;
  preExec?: boolean;

  contract: string;
  method: string;
  parameters?: ParameterOptions[];
}

export function deployCli(input: string, options: CliDeployOptions) {
  const { privateKey, address, ...rest } = options;

  const client = initClient({ rpcAddress: address });
  const account = createAccount(privateKey);

  const contract = loadCompiledContract(input);

  return deploy({ client, account, code: contract, ...rest });
}

export function invokeCli(options: CliInvokeOptions) {
  const { privateKey, address, ...rest } = options;

  const client = initClient({ rpcAddress: address });

  let account: Account | undefined;

  if (privateKey !== undefined) {
    account = createAccount(privateKey);
  }

  return invoke({ client, account, ...rest });
}

export function invokeFileCli(file: string) {
  const str = loadOptionsFile(file);
  const options = JSON.parse(str) as CliInvokeFileOptions;

  const { privateKey, address, parameters = [], ...rest } = options;

  let account: Account | undefined;

  if (privateKey !== undefined) {
    account = createAccount(privateKey);
  }

  const client = initClient({ rpcAddress: address });

  const parametersCli: any[] = processParameters(parameters);

  return invoke({ client, account, parameters: parametersCli, ...rest });
}

function processParameters(parameters: ParameterOptions[]): any[] {
  return parameters.map((parameter) => {
    if (parameters !== undefined) {
      if (parameter.type === 'Boolean') {
        return Boolean(parameter.value);
      } else if (parameter.type === 'Number') {
        return Number(parameter.value);
      } else if (parameter.type === 'String') {
        return String(parameter.value);
      } else if (parameter.type === 'ByteArray') {
        return new Buffer(parameter.value, 'hex');
      } else if (parameter.type === 'Array') {
        return processParameters(parameter.value);
      } else if (parameter.type === 'Struct') {
        return processParameters(parameter.value);
      } else if (parameter.type === 'Map') {
        throw new Error('Unsupported param type');
      }
    }
  });
}
