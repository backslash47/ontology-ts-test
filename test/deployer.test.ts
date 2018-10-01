import { createAccount, deploy, initClient, loadCompiledContract } from '../src/index';

describe('Deployer test', () => {
  const client = initClient({ rpcAddress: 'http://polaris1.ont.io:20336' });

  const contract = loadCompiledContract('./test/contract/helloWorld/contract.avm');

  const account1 = createAccount('75de8489fcb2dcaf2ef3cd607feffde18789de7da129b5e97c81e001793cb7cf');
  const account2 = createAccount('aade8489fcb2dcaf2ef3cd607feffde18789de7da129b5e97c81e001793cb7cf');

  test('test success', async () => {
    const output = await deploy({ client, account: account1, code: contract });

    expect(output.error).toBe(0);
    expect(output.result).toBeDefined();
  });

  test('test fail', async () => {
    await expect(deploy({ client, account: account2, code: contract })).rejects.toBeTruthy();
  });
});
