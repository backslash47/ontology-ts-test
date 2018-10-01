import '../httpsFix';

import { CsCompiler } from '../../src/compiler/csCompiler';
import { loadContract } from './../utils';

describe('CSharp compiler test', () => {
  test('test success', async () => {
    const contract = loadContract('./test/contract/helloWorld/contract.cs');

    const compiler = new CsCompiler();
    const output = await compiler.compile(contract);

    expect(output.avm).toBeInstanceOf(Buffer);
    expect(output.avm.length).toBeGreaterThan(0);
    expect(output.abi).toBeInstanceOf(Buffer);
    expect(output.abi.length).toBeGreaterThan(0);
  });

  test('test failure', async () => {
    const contract = loadContract('./test/contract/helloWorld/contractFailure.cs');

    const compiler = new CsCompiler();
    await expect(compiler.compile(contract)).rejects.toBeTruthy();
  });
});
