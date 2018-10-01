import '../httpsFix';

import { compile, loadContract } from '../src/index';

describe('CSharp compiler test', () => {
  test('test success', async () => {
    const contract = loadContract('./test/contract/helloWorld/contract.cs');

    const output = await compile({ code: contract, type: 'CSharp' });

    expect(output.avm).toBeInstanceOf(Buffer);
    expect(output.avm.length).toBeGreaterThan(0);
    expect(output.abi).toBeInstanceOf(Buffer);
    expect(output.abi.length).toBeGreaterThan(0);
  });

  test('test failure', async () => {
    const contract = loadContract('./test/contract/helloWorld/contractFailure.cs');

    await expect(compile({ code: contract, type: 'CSharp' })).rejects.toBeTruthy();
  });
});
