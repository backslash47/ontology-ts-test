import * as Long from 'long';
import { Address, OpCode, ProgramBuilder, Writer } from 'ontology-ts-crypto';
import { Struct } from './common/struct';
import { pushParam, sleep } from './common/utils';
import { InvokeCode } from './core/payload/invokeCode';
import { Invoke, Transaction } from './core/transaction';
import { RpcClient } from './network/rpcClient';

export interface Transfer {
  sender: Address;
  to: Address;
  amount: string;
  asset: string;
}

export interface TransactorTransferOptions extends Transfer {
  gasLimit?: string;
  gasPrice?: string;

  wait?: boolean;

  processCallback?: (transaction: Transaction) => Promise<void> | void;
}

export class Transactor {
  rpcAddress: string;

  constructor(rpcAddress: string) {
    this.rpcAddress = rpcAddress;
  }

  async transfer({
    sender,
    to,
    amount,
    asset,
    gasPrice = '500',
    gasLimit = '20000000',
    processCallback,
    wait = true
  }: TransactorTransferOptions) {
    const builder: ProgramBuilder = new ProgramBuilder();

    const tran = new Struct([sender, to, Long.fromString(amount)].reverse());
    const parameters = [0, new Address(this.getContract(asset)), 'transfer', [tran]];

    parameters.reverse().forEach((parameter) => pushParam(parameter, builder));
    builder.writeOpCode(OpCode.SYSCALL);
    builder.pushBytes(new Buffer('Ontology.Native.Invoke'));

    const code = builder.getProgram();
    const payload = new InvokeCode(code);

    const tx = new Transaction({
      txType: Invoke,
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
      throw new Error(`Failed to make the transfer: ${response.error} - ${response.result}`);
    }

    if (!wait) {
      return response;
    }

    await sleep(3000);
    return await client.getSmartCodeEvent(response.result);
  }

  async withdrawOng({
    sender,
    to,
    amount,
    gasPrice = '500',
    gasLimit = '20000000',
    processCallback,
    wait = true
  }: TransactorTransferOptions) {
    const builder: ProgramBuilder = new ProgramBuilder();

    const tran = new Struct([sender, new Address(this.getContract('ont')), to, Long.fromString(amount)].reverse());
    const parameters = [0, new Address(this.getContract('ong')), 'transferFrom', tran];

    parameters.reverse().forEach((parameter) => pushParam(parameter, builder));
    builder.writeOpCode(OpCode.SYSCALL);
    builder.pushBytes(new Buffer('Ontology.Native.Invoke'));

    const code = builder.getProgram();
    const payload = new InvokeCode(code);

    const tx = new Transaction({
      txType: Invoke,
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
      throw new Error(`Failed to make the withdraw Ong: ${response.error} - ${response.result}`);
    }

    if (!wait) {
      return response;
    }

    await sleep(3000);
    return await client.getSmartCodeEvent(response.result);
  }

  private getContract(asset: string) {
    if (asset === 'ont') {
      return '0000000000000000000000000000000000000001';
    } else if (asset === 'ong') {
      return '0000000000000000000000000000000000000002';
    } else {
      throw new Error(`Invalid asset: ${asset}.`);
    }
  }
}
