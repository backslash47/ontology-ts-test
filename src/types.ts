import { Account } from 'ontology-ts-crypto';
import { CompilerType } from './compiler/types';
import { DeployerOptions } from './deployer';
import { InvokerOptions } from './invoker';

export interface InitClientOptions {
  rpcAddress?: string;
}

export interface Client {
  rpcAddress: string;
}

export interface CompileOptions {
  code: Buffer;
  type: CompilerType;
  url?: string;
}

export interface DeployOptions extends DeployerOptions {
  client: Client;
  account: Account;
}

export interface IsDeployedOptions {
  client: Client;
  scriptHash: string;
}

export interface InvokeOptions extends InvokerOptions {
  client: Client;
  account?: Account;
}
