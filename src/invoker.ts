import * as Long from 'long';
import { APPCALL, PACK } from './common/opCode';
import { ProgramBuilder } from './common/program';
import { sleep, reverseBuffer } from './common/utils';
import { InvokeCode } from './core/payload/invokeCode';
import { Invoke, Transaction } from './core/transaction';
import RpcClient from './network/rpcClient';
import { Writer } from './utils/writer';

export interface Invoke {
  contractHash: string;
  method: string;
  parameters?: any[];
}

export interface InvokerOptions extends Invoke {
  gasLimit?: string;
  gasPrice?: string;
  preExec?: boolean;

  processCallback?: (transaction: Transaction) => void;
}

export class Invoker {
  rpcAddress: string;

  constructor(rpcAddress: string) {
    this.rpcAddress = rpcAddress;
  }

  async invoke({
    method,
    parameters = [],
    contractHash,
    gasPrice = '500',
    gasLimit = '20000000',
    preExec,
    processCallback
  }: InvokerOptions) {
    const builder: ProgramBuilder = new ProgramBuilder();

    parameters = [method, parameters];

    parameters.reverse().forEach((parameter) => this.pushParam(parameter, builder));

    builder.writeOpCode(APPCALL);
    builder.writeBytes(reverseBuffer(new Buffer(contractHash, 'hex')));

    const code = builder.getProgram();
    const payload = new InvokeCode(code);

    const tx = new Transaction({
      txType: Invoke,
      payload,
      gasPrice: Long.fromString(gasPrice),
      gasLimit: Long.fromString(gasLimit)
    });

    if (processCallback !== undefined) {
      processCallback(tx);
    }

    const client = new RpcClient(this.rpcAddress);

    const w = new Writer();
    tx.serialize(w);

    const response = await client.sendRawTransaction(w.getBytes(), preExec);

    if (preExec) {
      return response;
    }

    if (response.error !== 0) {
      throw new Error('Failed to invoke contract: ' + response.result);
    }

    await sleep(3000);
    return await client.getSmartCodeEvent(response.result);
  }

  pushParam(parameter: any, builder: ProgramBuilder) {
    if (typeof parameter === 'number') {
      builder.pushNum(parameter);
    } else if (typeof parameter === 'string') {
      builder.pushBytes(new Buffer(parameter));
    } else if (typeof parameter === 'boolean') {
      builder.pushBool(parameter);
    } else if (parameter instanceof Buffer) {
      builder.pushBytes(parameter);
    } else if (parameter instanceof Map) {
      // const mapBytes = getMapBytes(parameter);
      // builder.pushBytes(mapBytes);
    } else if (Array.isArray(parameter)) {
      this.pushStruct(parameter, builder);
    } else {
      throw new Error('Unsupported param type');
    }
  }

  pushStruct(parameters: any[], builder: ProgramBuilder) {
    parameters.reverse().forEach((parameter) => this.pushParam(parameter, builder));

    builder.pushNum(parameters.length);
    builder.writeOpCode(PACK);
  }
}
