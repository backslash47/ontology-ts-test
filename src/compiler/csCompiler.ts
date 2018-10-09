import fetch from 'cross-fetch';
import { Compiler, CompilerError } from './types';

// tslint:disable:quotemark
export class CsCompiler implements Compiler {
  url: string;
  constructor(url: string = 'https://smartxcompiler.ont.io/api/v1.0/csharp/compile') {
    this.url = url;
  }

  async compile(code: Buffer) {
    const payload = { type: 'CSharp', code: code.toString('utf-8') };

    const response = await fetch(this.url, {
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
    let abi: string = json.abi;

    if (avm.startsWith("b'")) {
      avm = avm.substring(2, avm.lastIndexOf("'"));
    }

    if (abi.startsWith("b'")) {
      abi = abi.substring(2, abi.lastIndexOf("'"));
      abi = abi.replace(/\\n/g, '\n');
    }

    return {
      avm: new Buffer(avm, 'hex'),
      abi: new Buffer(abi),
      hash: JSON.parse(abi).hash
    };
  }
}
