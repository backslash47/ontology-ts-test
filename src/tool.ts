import { CompilerType, createCompiler } from './compiler';
import { Deployer, DeployerOptions } from './deployer';

export class Tool {
  deploy(nodeAddress: string, useSSL: boolean, options: DeployerOptions) {
    const deployer = new Deployer(nodeAddress, useSSL);
    return deployer.deploy(options);
  }

  invoke() {}

  compile(code: Buffer, type: CompilerType) {
    const compiler = createCompiler(type);
    return compiler.compile(code);
  }

  func() {}
}
