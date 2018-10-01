import { Address } from './common/address';
import { createCompiler } from './compiler';
import { Deployer } from './deployer';
import { Invoker } from './invoker';
import { Client, CompileOptions, DeployOptions, InitClientOptions, InvokeOptions } from './types';
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

export function deploy({ client, account, ...rest }: DeployOptions) {
  const deployer = new Deployer(client.rpcAddress);
  return deployer.deploy({
    ...rest,
    processCallback: (tx) => {
      tx.setPayer(new Address(account.address));
      signTransaction(tx, account);
    }
  });
}

export function invoke({ client, account, ...rest }: InvokeOptions) {
  const invoker = new Invoker(client.rpcAddress);
  return invoker.invoke({
    ...rest,
    processCallback: (tx) => {
      if (account !== undefined) {
        tx.setPayer(new Address(account.address));
        signTransaction(tx, account);
      }
    }
  });
}

export { loadContract, loadCompiledContract } from './common/utils';
export { loadWallet, createWallet, createAccount } from './wallet';
