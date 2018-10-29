import { randomBytes } from 'crypto';
import { Account, Hash, PrivateKey, programFromParams, programFromPubKey, Wallet } from 'ontology-ts-crypto';
import { RawSig, Transaction } from './core/transaction';

export function loadWallet(path: string): Wallet {
  throw new Error('Unsupported');
}

export function createWallet(accounts: Account[]): Wallet {
  const wallet = Wallet.create();

  accounts.forEach((account) => wallet.addAccount(account));
  return wallet;
}

export function createAccount(privateKey: string): Account {
  return Account.create(randomBytes(4).toString('hex'), PrivateKey.deserialize(new Buffer(privateKey, 'hex')), '');
}

export async function signTransaction(tx: Transaction, account: Account, password: string) {
  const bytes = tx.serializeUnsigned();
  const hash = Hash.sha256(Hash.sha256(bytes));

  const privateKey = await account.decryptKey(password);
  const publicKey = privateKey.getPublicKey();
  const signature = await privateKey.sign(hash);

  const invokationSript = programFromParams([signature.serialize()]);
  const verificationScript = programFromPubKey(publicKey);

  const sig = new RawSig(invokationSript, verificationScript);
  tx.addSig(sig);
}
