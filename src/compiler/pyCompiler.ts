import fetch from 'cross-fetch';
import { Compiler, CompilerError } from './types';

export class PyCompiler implements Compiler {
  async compile(code: Buffer) {
    const url = 'https://smartxcompiler.ont.io/api/beta/python/compile';
    const payload = { type: 'Python', code: code.toString('utf-8') };

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await response.json();

    if (json.errcode !== 0) {
      throw new CompilerError(json.errcode, json.errdetail);
    }

    let avm: string = json.avm;
    const abi: string = json.abi;

    // tslint:disable-next-line:quotemark
    if (avm.startsWith("b'")) {
      avm = avm.substr(2, avm.length - 1);
    }

    return {
      avm: new Buffer(avm, 'hex'),
      abi: new Buffer(abi)
    };
  }
}
