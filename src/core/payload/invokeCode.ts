import { Reader, Writer } from 'ontology-ts-crypto';

export class InvokeCode {
  private code: Buffer;

  constructor(code: Buffer = new Buffer('')) {
    this.code = code;
  }

  serialize(w: Writer) {
    try {
      w.writeVarBytes(this.code);
    } catch (e) {
      throw new Error(`InvokeCode Code Serialize failed: ${e}`);
    }
  }

  deserialize(r: Reader) {
    try {
      const code = r.readVarBytes();

      this.code = code;
    } catch (e) {
      throw new Error(`InvokeCode Code Deserialize failed: ${e}`);
    }
  }
}
