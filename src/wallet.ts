import { Address } from './common/address';
import { programFromParams, programFromPubKey } from './common/program';
import { sha256 } from './common/utils';
import { RawSig, Transaction } from './core/transaction';
import { PrivateKey } from './crypto/privateKey';
import { Account, Wallet } from './types';

export function loadWallet(path: string): Wallet {
  throw new Error('Unsupported');
}

export function createWallet(accounts: Account[]): Wallet {
  return {
    accounts
  };
}

export function createAccount(privateKey: string): Account {
  const sk = new PrivateKey(privateKey);
  const pk = sk.getPublicKey();
  const address = Address.fromPubKey(pk)
    .toArray()
    .toString('hex');

  return {
    address,
    privateKey
  };
}

export function signTransaction(tx: Transaction, account: Account) {
  const bytes = tx.serializeUnsigned();
  const hash = sha256(sha256(bytes));

  const privateKey = new PrivateKey(account.privateKey);
  const publicKey = privateKey.getPublicKey();
  const signature = privateKey.sign(hash);

  const invokationSript = programFromParams([signature.serialize()]);
  const verificationScript = programFromPubKey(publicKey);

  const sig = new RawSig(invokationSript, verificationScript);
  tx.addSig(sig);
}
