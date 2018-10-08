import { compile, deploy, initClient, invoke, loadContract, loadWallet } from '../src/index';

describe('Demo Token test', () => {
  const contract = loadContract('./test/demoToken.py');
  const wallet = loadWallet('./test/wallet.json');
  const account1 = wallet.accounts[0];
  const account2 = wallet.accounts[1];

  let avm: Buffer;
  let abi: Buffer;
  let contractHash: string;

  const client = initClient({ rpcAddress: 'http://polaris1.ont.io:20336' });

  test('test compile', async () => {
    const response = await compile({ code: contract, type: 'Python' });
    avm = response.avm;
    abi = response.abi;
    contractHash = response.hash;

    expect(avm).toBeInstanceOf(Buffer);
    expect(avm.length).toBeGreaterThan(0);
    expect(abi).toBeInstanceOf(Buffer);
    expect(length).toBeGreaterThan(0);
  });

  test('test deploy', async () => {
    const response = await deploy({ client, code: avm, account: account1 });

    expect(response.Error).toBe(0);
    expect(response.Result).toBeDefined();
  });

  test('test init', async () => {
    const response = await invoke({
      client,
      contractHash,
      method: 'init',
      account: account1
    });

    expect(response.Error).toBe(0);
  });

  test('test getBalance of User 1', async () => {
    const response = await invoke({ client, contractHash, method: 'getBalance', parameters: [account1.address] });

    expect(response.Error).toBe(0);
    expect(response.Result).toBe('10000');
  });

  test('test getBalance of User 2', async () => {
    const response = await invoke({ client, contractHash, method: 'getBalance', parameters: [account2.address] });

    expect(response.Error).toBe(0);
    expect(response.Result).toBe('0');
  });

  test('test transfer', async () => {
    const response = await invoke({
      client,
      contractHash,
      method: 'transfer',
      account: account1,
      parameters: [account1.address, account2.address, 6000]
    });

    expect(response.Error).toBe(0);
  });

  test('test getBalance of User 1 after transfer', async () => {
    const response = await invoke({ client, contractHash, method: 'getBalance', parameters: [account1.address] });

    expect(response.Error).toBe(0);
    expect(response.Result).toBe('4000');
  });

  test('test getBalance of User 2 after transfer', async () => {
    const response = await invoke({ client, contractHash, method: 'getBalance', parameters: [account2.address] });

    expect(response.Error).toBe(0);
    expect(response.Result).toBe('6000');
  });
});
