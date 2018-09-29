import { randomBytes } from 'crypto';
import * as Long from 'long';
import { DeployCode } from './core/payload/deployCode';
import { Deploy, Transaction } from './core/transaction';

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
  gasLimit?: Long;
  gasPrice?: Long;

  processCallback?: (transaction: Transaction) => Promise<void>;
}

export class Deployer {
  nodeAddress: string;

  constructor(nodeAddress: string) {
    this.nodeAddress = nodeAddress;
  }

  async deploy({
    code,
    needStorage = false,
    name = '',
    version = '',
    author = '',
    email = '',
    description = '',
    gasPrice = Long.fromNumber(500),
    gasLimit = Long.fromNumber(20000),
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
      nonce: Long.fromBytes([...randomBytes(4)]).toNumber(),
      gasPrice,
      gasLimit
    });

    if (processCallback !== undefined) {
      await processCallback(tx);
    }
  }
}
