import { createAccount, initClient, loadCompiledContract, transfer } from '../src/index';

describe('Deployer test', () => {
  const client = initClient({ rpcAddress: 'http://polaris1.ont.io:20336' });

  const account1 = createAccount('75de8489fcb2dcaf2ef3cd607feffde18789de7da129b5e97c81e001793cb7cf');
  const account2 = createAccount('aade8489fcb2dcaf2ef3cd607feffde18789de7da129b5e97c81e001793cb7cf');

  test('test success', async () => {
    const output = await transfer({
      client,
      account: account1,
      sender: account1.address,
      to: account2.address,
      amount: '1',
      asset: 'ont'
    });

    console.log(output);

    expect(output.error).toBe(0);
    expect(output.result).toBeDefined();
  });
});
