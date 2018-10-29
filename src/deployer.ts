import * as Long from 'long';
import { Address, Writer } from 'ontology-ts-crypto';
import { sleep } from './common/utils';
import { DeployCode } from './core/payload/deployCode';
import { Deploy, Transaction } from './core/transaction';
import RpcClient from './network/rpcClient';

export interface Deployment {
  code: Buffer;
  needStorage?: boolean;
  name?: string;
  version?: string;
  author?: string;
  email?: string;
  description?: string;
}

export interface DeployerOptions extends Deployment {
  gasLimit?: string;
  gasPrice?: string;

  processCallback?: (transaction: Transaction) => Promise<void> | void;
}

export class Deployer {
  rpcAddress: string;

  constructor(rpcAddress: string) {
    this.rpcAddress = rpcAddress;
  }

  async isDeployed(address: Address) {
    const client = new RpcClient(this.rpcAddress);

    const response = await client.getContract(address.toArray().toString('hex'));
    if (response.result === 'unknow contract' || response.result === 'unknow contracts') {
      return false;
    } else {
      return true;
    }
  }

  async deploy({
    code,
    needStorage = false,
    name = '',
    version = '',
    author = '',
    email = '',
    description = '',
    gasPrice = '500',
    gasLimit = '20000000',
    processCallback
  }: DeployerOptions) {
    const payload = new DeployCode({
      code,
      needStorage,
      name,
      version,
      author,
      email,
      description
    });

    const tx = new Transaction({
      txType: Deploy,
      payload,
      gasPrice: Long.fromString(gasPrice),
      gasLimit: Long.fromString(gasLimit)
    });

    if (processCallback !== undefined) {
      const result = processCallback(tx);
      if (result instanceof Promise) {
        await result;
      }
    }

    const client = new RpcClient(this.rpcAddress);

    const w = new Writer();
    tx.serialize(w);

    const response = await client.sendRawTransaction(w.getBytes(), false);

    if (response.error !== 0) {
      throw new Error(`Failed to deploy contract: ${response.error} - ${response.result}`);
    }

    await sleep(3000);
    return await client.getSmartCodeEvent(response.result);
  }
}
