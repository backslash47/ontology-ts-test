import { CONST, Crypto, TransactionBuilder } from 'ontology-ts-sdk';
import { Deployer } from '../../src/deployer';
import { loadAVMContract } from './../utils';

import Address = Crypto.Address;
import PrivateKey = Crypto.PrivateKey;

describe('Deployer test', () => {
  test('test success', async () => {
    const contract = loadAVMContract('./test/contract/helloWorld/contract.avm');

    const deployer = new Deployer(CONST.TEST_NODE);
    const output = await deployer.deploy({
      code: contract,
      async processCallback(tx) {
        const privateKey = new PrivateKey('75de8489fcb2dcaf2ef3cd607feffde18789de7da129b5e97c81e001793cb7cf');
        const publicKey = privateKey.getPublicKey();
        const address = Address.fromPubKey(publicKey);
        tx.payer = address;

        await TransactionBuilder.signTransactionAsync(tx, privateKey);
      }
    });

    expect(output.Error).toBe(0);
    expect(output.Result).toBeDefined();
  });

  test('test fail', async () => {
    const contract = loadAVMContract('./test/contract/helloWorld/contract.avm');

    const deployer = new Deployer(CONST.TEST_NODE);
    await expect(
      deployer.deploy({
        code: contract,
        async processCallback(tx) {
          const privateKey = new PrivateKey('aade8489fcb2dcaf2ef3cd607feffde18789de7da129b5e97c81e001793cb7cf');
          const publicKey = privateKey.getPublicKey();
          const address = Address.fromPubKey(publicKey);
          tx.payer = address;

          await TransactionBuilder.signTransactionAsync(tx, privateKey);
        }
      })
    ).rejects.toBeTruthy();
  });
});
