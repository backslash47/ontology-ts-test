#!/usr/bin/env node

require('babel-polyfill');
var program = require('commander');
// var jest = require('jest-cli');
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
  .command('template <file>')
  .description('Create template test file')
  .action(function(file) {
    console.log('templating: ', file);
  });

// program
//   .command('test <file>')
//   .description('Run smart contract test')
//   .action(function(file) {
//     console.log('Testing ', file);

//     return jest.runCLI({ testRegex: file, _: [file] }, [__dirname]);
//   });

program
  .command('invoke')
  .description('Invoke smart contract method')
  .option('--contract', 'Contract address')
  .option('--method', 'Contract method')
  .option('--preexec', 'Invoke read-only method')
  .action(function(file) {
    console.log('invoking: ', file);
  });

program.parse(process.argv);
