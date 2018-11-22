import { randomBytes } from 'crypto';
import * as fs from 'fs';
import {
  Account,
  Hash,
  PrivateKey,
  programFromMultiPubKeys,
  programFromParams,
  programFromPubKey,
  PublicKey,
  Wallet
} from 'ontology-ts-crypto';
import { RawSig, Transaction } from './core/transaction';
import { Signer } from './types';

export function loadWallet(walletPath: string): Wallet {
  const f = fs.readFileSync(walletPath, 'utf8');
  return Wallet.deserializeJson(f);
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

export async function signTransactionMulti(tx: Transaction, m: number, signers: Signer[]) {
  const bytes = tx.serializeUnsigned();
  const hash = Hash.sha256(Hash.sha256(bytes));
  const signatures: Buffer[] = [];
  const publicKeys: PublicKey[] = [];

  for (const signer of signers) {
    const privateKey = await signer.account.decryptKey(signer.password);
    const publicKey = privateKey.getPublicKey();
    const signature = await privateKey.sign(hash);

    publicKeys.push(publicKey);
    signatures.push(signature.serialize());
  }

  const invokationSript = programFromParams(signatures);
  const verificationScript = programFromMultiPubKeys(m, publicKeys);

  const sig = new RawSig(invokationSript, verificationScript);
  tx.addSig(sig);
}
