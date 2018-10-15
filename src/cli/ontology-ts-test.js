#!/usr/bin/env node

require('babel-polyfill');
var program = require('commander');
var https = require('https');
var cli = require('./index');

https.globalAgent.options.rejectUnauthorized = false;

program.description('Ontology test framework CLI').version('0.1.0', '-v, --version');

program
  .command('compile <file>')
  .description('Compile C# or Python smart contract')
  .option('--output', 'Compiled smart contract')
  .option('--abi', 'ABI file for smart contract')
  .action(async function(file, options) {
    console.log('compiling: ', file);
    await cli.compileCli(file, options.output, options.abi);
  });

program
  .command('deploy <file>')
  .description('Deploy compiled smart contract')
  .option('--address [address]', 'RPC node address')
  .option('--privateKey <privateKey>', 'Private key in HEX format')
  .option('--gasLimit [gasLimit]', 'GAS Limit')
  .option('--gasPrice [gasPrice]', 'GAS Price')
  .option('--needStorage', 'True if smart contract needs storage')
  .option('--contractName [contractName]')
  .option('--contractVersion [contractVersion]')
  .option('--contractAuthor [contractAuthor]')
  .option('--contractEmail [contractEmail]')
  .option('--contractDescription [contractDescription]')
  .action(function(file, options) {
    if (options.privateKey === undefined) {
      console.log('--privateKey option is required.');
      return;
    }

    console.log('Deploying ', file);

    const deployOptions = {
      address: options.address,
      privateKey: options.privateKey,
      gasLimit: options.gasLimit,
      gasPrice: options.gasPrice,
      needStorage: options.needStorage,
      name: options.contractName,
      version: options.contractVersion,
      author: options.contractAuthor,
      email: options.contractEmail,
      description: options.contractDescription
    };
    return cli
      .deployCli(file, deployOptions)
      .then((_) => console.log('Deployment complete'))
      .catch((err) => console.log(err.message));
  });

program
  .command('invoke')
  .description('Invoke smart contract method')
  .option('--address [address]', 'RPC node address')
  .option('--privateKey [privateKey]', 'Private key in HEX format')
  .option('--gasLimit [gasLimit]', 'GAS Limit')
  .option('--gasPrice [gasPrice]', 'GAS Price')
  .option('--contract <contract>', 'Contract address')
  .option('--method <method>', 'Contract method')
  .option('--parameters [parameters]', 'Contract parameters')
  .option('--preExec', 'Invoke read-only method')
  .action(function(options) {
    if (options.privateKey === undefined && options.preExec !== true) {
      console.log('--privateKey option or --preExec option is required.');
      return;
    }

    if (options.contract === undefined) {
      console.log('--contract option is required.');
      return;
    }

    if (options.method === undefined) {
      console.log('--method option is required.');
      return;
    }

    console.log('Invoking');

    const invokeOptions = {
      address: options.address,
      privateKey: options.privateKey,
      gasLimit: options.gasLimit,
      gasPrice: options.gasPrice,
      preExec: options.preExec,
      contract: options.contract,
      method: options.method,
      parameters: options.parameters !== undefined ? JSON.parse(options.parameters) : undefined
    };
    return cli
      .invokeCli(invokeOptions)
      .then((result) => console.log(JSON.stringify(result)))
      .catch((err) => console.log(err.message));
  });

program
  .command('invokeFile <file>')
  .description('Invoke smart contract method defined in config file')
  .action(function(file) {
    console.log('Invoking');

    return cli
      .invokeFileCli(file)
      .then((result) => console.log(JSON.stringify(result)))
      .catch((err) => console.log(err.message));
  });

program.parse(process.argv);
