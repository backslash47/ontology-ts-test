import {
  CONST,
  Crypto,
  Parameter as OntParameter,
  ParameterType as OntParameterType,
  Transaction,
  TransactionBuilder,
  WebsocketClient
} from 'ontology-ts-sdk';

import Address = Crypto.Address;

export type ParameterType = 'Boolean' | 'Integer' | 'ByteArray' | 'Struct' | 'Map' | 'String';

export interface Parameter {
  type: ParameterType;
  value: any;
}

export interface Invoke {
  contract: string;
  method: string;
  parameters: Parameter[];
}

export interface InvokerOptions extends Invoke {
  gasLimit?: string;
  gasPrice?: string;

  processCallback?: (transaction: Transaction) => Promise<void>;
}

export class Invoker {
  nodeAddress: string;
  useSSL: boolean;

  constructor(nodeAddress: string, useSSL: boolean = false) {
    this.nodeAddress = nodeAddress;
    this.useSSL = useSSL;
  }

  async invoke({
    method,
    parameters,
    contract,
    gasPrice = '500',
    gasLimit = '20000000',
    processCallback
  }: InvokerOptions) {
    const params = parameters.map(
      (parameter) => new OntParameter('', OntParameterType[parameter.type], parameter.value)
    );

    const tx = TransactionBuilder.makeInvokeTransaction(method, params, new Address(contract), gasPrice, gasLimit);

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
