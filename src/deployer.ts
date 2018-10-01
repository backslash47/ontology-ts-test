import { CONST, Transaction, TransactionBuilder, WebsocketClient } from 'ontology-ts-sdk';

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

  processCallback?: (transaction: Transaction) => Promise<void>;
}

export class Deployer {
  nodeAddress: string;
  useSSL: boolean;

  constructor(nodeAddress: string, useSSL: boolean = false) {
    this.nodeAddress = nodeAddress;
    this.useSSL = useSSL;
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
    const tx = TransactionBuilder.makeDeployCodeTransaction(
      code.toString('hex'),
      name,
      version,
      author,
      email,
      description,
      needStorage,
      gasPrice,
      gasLimit
    );

    if (processCallback !== undefined) {
      await processCallback(tx);
    }

    const url = `${this.useSSL ? 'wss' : 'ws'}://${this.nodeAddress}:${CONST.HTTP_WS_PORT}`;
    const client = new WebsocketClient(url, false, true);

    try {
      return await client.sendRawTransaction(tx.serialize(), false, false);
    } finally {
      client.close();
    }
  }
}
