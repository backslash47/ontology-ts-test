import './httpsFix';

import { PyCompiler } from '../src/compiler/pyCompiler';
import { loadContract } from './utils';

describe('Python compiler test', () => {
  test('test success', async () => {
    const contract = loadContract('./test/contract/helloWorld/contract.py');

    const compiler = new PyCompiler();
    const output = await compiler.compile(contract);

    expect(output.avm).toBeInstanceOf(Buffer);
    expect(output.avm.length).toBeGreaterThan(0);
    expect(output.abi).toBeInstanceOf(Buffer);
    expect(output.abi.length).toBeGreaterThan(0);
  });

  test('test failure', async () => {
    const contract = loadContract('./test/contract/helloWorld/contractFailure.py');

    const compiler = new PyCompiler();
    await expect(compiler.compile(contract)).rejects.toBeTruthy();
  });
});
