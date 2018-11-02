/*
 * Copyright (C) 2018 The ontology Authors
 * This file is part of The ontology library.
 *
 * The ontology is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The ontology is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with The ontology.  If not, see <http://www.gnu.org/licenses/>.
 */

import fetch from 'cross-fetch';
import { Address } from 'ontology-ts-crypto';

/**
 * Wrapper class for RPC apis.
 */
export class RpcClient {
  /**
   * Url of the blockchain node
   */
  url: string;

  constructor(url: string = 'http://polaris1.ont.io:20336') {
    this.url = url;
  }

  /**
   * Get the current blockchain node url.
   */
  getUrl() {
    return this.url;
  }

  /**
   * Make request base on method and parameters
   * @param method Method's name
   * @param params Parameters
   */
  makeRequest(method: string, ...params: any[]) {
    const request = {
      jsonrpc: '2.0',
      method,
      params,
      id: 1
    };

    return request;
  }

  sendRequest(req: any) {
    return fetch(this.url, {
      method: 'POST',
      body: JSON.stringify(req),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => response.json());
  }

  /**
   * Get the balance of some address.
   * The result contains ONT and ONG.
   * @param address Address
   */
  getBalance(address: Address): Promise<any> {
    const req = this.makeRequest('getbalance', address.toBase58());
    return this.sendRequest(req);
  }

  /**
   * Get the unbound ONG of some address.
   * The result contains ONG.
   * @param address Address
   */
  getUnboundOng(address: Address): Promise<any> {
    const req = this.makeRequest('getunboundong', address.toBase58());
    return this.sendRequest(req);
  }

  /**
   * Send ran transaction to blockchain.
   * @param data Hex encoded data.
   * @param preExec Decides if it is a pre-execute transaction.
   */
  sendRawTransaction(data: string | Buffer, preExec: boolean = false): Promise<any> {
    let req;

    if (data instanceof Buffer) {
      data = data.toString('hex');
    }

    if (preExec) {
      req = this.makeRequest('sendrawtransaction', data, 1);
    } else {
      req = this.makeRequest('sendrawtransaction', data);
    }

    return this.sendRequest(req);
  }

  /**
   * Get raw transaction by transaction hash.
   * The result is hex encoded string.
   * @param txHash Reversed transaction hash
   */
  getRawTransaction(txHash: string): Promise<any> {
    const req = this.makeRequest('getrawtransaction', txHash);
    return this.sendRequest(req);
  }

  /**
   * Get transaction info by transaction hash.
   * The result is json.
   * @param txHash Reversed transaction hash.
   */
  getRawTransactionJson(txHash: string): Promise<any> {
    const req = this.makeRequest('getrawtransaction', txHash, 1);
    return this.sendRequest(req);
  }

  /**
   * Get the nodes count.
   */
  getNodeCount(): Promise<any> {
    const req = this.makeRequest('getconnectioncount');
    return this.sendRequest(req);
  }

  /**
   * Get the current block height.
   */
  getBlockHeight(): Promise<any> {
    const req = this.makeRequest('getblockcount');
    return this.sendRequest(req);
  }

  /**
   * Get the all blocks count.
   */
  getBlockCount(): Promise<any> {
    const req = this.makeRequest('getblockcount');
    return this.sendRequest(req);
  }

  /**
   * Get block info by block's height or hash.
   * The result is json.
   * @param value Block's hash or height
   */
  getBlockJson(value: string | number): Promise<any> {
    const req = this.makeRequest('getblock', value, 1);
    return this.sendRequest(req);
  }

  /**
   * Get contract info by contract' code hash.
   * The result is hex encoded string.
   * @param hash Contract's code hash.
   */
  getContract(hash: string): Promise<any> {
    const req = this.makeRequest('getcontractstate', hash);
    return this.sendRequest(req);
  }

  /**
   * Get contract info by contract's code hash.
   * The result is json.
   * @param codeHash Contract's code hash.
   */
  getContractJson(codeHash: string): Promise<any> {
    const req = this.makeRequest('getcontractstate', codeHash, 1);
    return this.sendRequest(req);
  }

  /**
   * Get block info by block's height or hash.
   * The result is hex encoded string.
   *
   * @param value Block's height or hash
   */
  getBlock(value: string | number): Promise<any> {
    const req = this.makeRequest('getblock', value);
    return this.sendRequest(req);
  }

  /**
   * Get smart contract event.
   * If parameter is transaction's hash, the result is the event of that transaction.
   * If parameter is block's height, the result is all the events of that block.
   *
   * @param value Transaction's hash or block's height
   */
  getSmartCodeEvent(value: string | number): Promise<any> {
    const req = this.makeRequest('getsmartcodeevent', value);
    return this.sendRequest(req);
  }

  /**
   * Get block height by transaction hash
   * @param txHash Reversed transaction hash
   */
  getBlockHeightByTxHash(txHash: string): Promise<any> {
    const req = this.makeRequest('getblockheightbytxhash', txHash);
    return this.sendRequest(req);
  }

  /**
   * Get stored value in smart contract by contract's code hash and the key.
   * @param codeHash Contract's code hash
   * @param key Key of stored value
   */
  getStorage(codeHash: string, key: string): Promise<any> {
    const req = this.makeRequest('getstorage', codeHash, key);
    return this.sendRequest(req);
  }

  /**
   * Get merkle proof by transaction hash.
   * @param hash Reversed transaction hash
   */
  getMerkleProof(hash: string): Promise<any> {
    const req = this.makeRequest('getmerkleproof', hash);
    return this.sendRequest(req);
  }

  /**
   * Get allowanece
   * @param asset Asset's type. Only ONT and ONG supported.
   * @param from Address of allowance's sender.
   * @param to Address of allowance's receiver.
   */
  getAllowance(asset: string, from: Address, to: Address): Promise<any> {
    const req = this.makeRequest('getallowance', asset, from.toBase58(), to.toBase58());
    return this.sendRequest(req);
  }
}
