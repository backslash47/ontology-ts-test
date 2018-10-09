# Ontology TS Test

## Overview

Ontology TS Test is Ontology Smart contract Test framework written in Typescript. This Test framework can be used directly through CLI interface or as embedded component in your project.


### What does it currently do

* External compilation of C# and Python Smart Contracts
* Deployment to Test | Main | Private Net
* Invokation of Smart Contract method
* Test framework methods for unit testing

### What is currently missing

* Full CLI interface

## Usage

Examples of in code usage can be found at https://github.com/OntologyCommunityDevelopers/ontology-ts-test-demo
For direct use, see CLI interface.

## Installation

### Required Tools and Dependencies

* Node
* Npm

### Developing and Running

Execute these commands in the project's root directory:

#### Download
```
git clone 'https://github.com/OntologyCommunityDevelopers/ontology-ts-test.git'
cd ontology-ts-vm
```

#### Install

```
npm install
```

#### Development build
This will build the project with minimum polyfilling for better debug experience.

````
npm run build:dev
````

You will get the packaged code under '/lib'.


#### Production build 

````
npm run build:prod
````

You will get the packaged code under '/lib'

#### CLI interface

````
npm install -g
````

You will be able to call 'ontology-ts-test' command directly. Use option -h for further help.

## Built With

* [TypeScript](https://www.typescriptlang.org/) - Used language
* [Node.js](https://nodejs.org) - JavaScript runtime for building

## Authors

* **Matus Zamborsky** - *Initial work* - [Backslash47](https://github.com/backslash47)

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details
