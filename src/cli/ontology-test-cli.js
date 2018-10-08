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
  .option('--address', 'RPC node address')
  .option('--privateKey', 'Private key in HEX format')
  .action(function(file) {
    console.log('deploying: ', file);
  });

program
  .command('template <file>')
  .description('Create template test file')
  .action(function(file) {
    console.log('templating: ', file);
  });

program
  .command('test <file>')
  .description('Run smart contract test')
  .action(function(file) {
    console.log('testing: ', file);
  });

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
