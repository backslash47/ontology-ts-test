import { Address } from 'ontology-ts-crypto';
import { createCompiler } from './compiler';
import { Deployer } from './deployer';
import { Invoker } from './invoker';
import { Transactor } from './transactor';
import {
  Client,
  CompileOptions,
  DeployOptions,
  InitClientOptions,
  InvokeOptions,
  IsDeployedOptions,
  TransferOptions
} from './types';
import { signTransaction } from './wallet';

export function initClient({ rpcAddress = 'http://polaris1.ont.io:20336' }: InitClientOptions): Client {
  return {
    rpcAddress
  };
}

export function compile({ code, type, url }: CompileOptions) {
  const compiler = createCompiler({ type, url });
  return compiler.compile(code);
}

export function deploy({ client, account, password, ...rest }: DeployOptions) {
  const deployer = new Deployer(client.rpcAddress);
  return deployer.deploy({
    ...rest,
    processCallback: async (tx) => {
      tx.setPayer(account.address);
      await signTransaction(tx, account, password !== undefined ? password : '');
    }
  });
}

export function isDeployed({ client, scriptHash }: IsDeployedOptions) {
  const deployer = new Deployer(client.rpcAddress);
  return deployer.isDeployed(new Address(scriptHash));
}

export function invoke({ client, account, password, ...rest }: InvokeOptions) {
  const invoker = new Invoker(client.rpcAddress);
  return invoker.invoke({
    ...rest,
    processCallback: async (tx) => {
      if (account !== undefined) {
        tx.setPayer(account.address);
        await signTransaction(tx, account, password !== undefined ? password : '');
      }
    }
  });
}

export function transfer({ client, account, password, ...rest }: TransferOptions) {
  const transactor = new Transactor(client.rpcAddress);
  return transactor.transfer({
    ...rest,
    processCallback: async (tx) => {
      if (account !== undefined) {
        tx.setPayer(account.address);
        await signTransaction(tx, account, password !== undefined ? password : '');
      }
    }
  });
}

export function withdrawOng({ client, account, password, ...rest }: TransferOptions) {
  const transactor = new Transactor(client.rpcAddress);
  return transactor.withdrawOng({
    ...rest,
    processCallback: async (tx) => {
      if (account !== undefined) {
        tx.setPayer(account.address);
        await signTransaction(tx, account, password !== undefined ? password : '');
      }
    }
  });
}

export { CompilerType } from './compiler';
export { loadContract, loadCompiledContract } from './common/utils';
export { loadWallet, createWallet, createAccount } from './wallet';
export { compileCli, deployCli, invokeCli, invokeFileCli } from './cli/cli';
export { hex2num, reverseBuffer } from './common/utils';
export { RpcClient } from './network/rpcClient';
