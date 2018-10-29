import { Reader, Writer } from 'ontology-ts-crypto';

export interface DeployCodeOptions {
  code: Buffer;
  needStorage: boolean;
  name: string;
  version: string;
  author: string;
  email: string;
  description: string;
}

export class DeployCode {
  code: Buffer;
  needStorage: boolean;
  name: string;
  version: string;
  author: string;
  email: string;
  description: string;

  constructor(
    options: DeployCodeOptions = {
      code: new Buffer(''),
      needStorage: false,
      name: '',
      version: '',
      author: '',
      email: '',
      description: ''
    }
  ) {
    this.code = options.code;
    this.needStorage = options.needStorage;
    this.name = options.name;
    this.version = options.version;
    this.author = options.author;
    this.email = options.email;
    this.description = options.description;
  }

  serialize(w: Writer) {
    w.writeVarBytes(this.code);
    w.writeUint8(this.needStorage ? 1 : 0);
    w.writeString(this.name);
    w.writeString(this.version);
    w.writeString(this.author);
    w.writeString(this.email);
    w.writeString(this.description);
  }

  deserialize(r: Reader) {
    this.code = r.readVarBytes();
    this.needStorage = r.readByte() === 1 ? true : false;
    this.name = r.readVarString();
    this.version = r.readVarString();
    this.author = r.readVarString();
    this.email = r.readVarString();
    this.description = r.readVarString();
  }

  toArray(): Buffer {
    const bf = new Writer();
    this.serialize(bf);
    return new Buffer(bf.getBytes());
  }

  getCode() {
    return this.code;
  }
}

export function isDeployCode(item: any): item is DeployCode {
  return item instanceof DeployCode;
}
