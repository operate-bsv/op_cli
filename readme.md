[![license](https://img.shields.io/github/license/functional-bitcoin/library.svg)](https://github.com/functional-bitcoin/library/blob/master/license.md)

# Functional Bitcoin :: CLI

Command line utility to help author and publish functions to the Bitcoin (SV) blockchain, for use in extensible Bitcoin application protocols.

## Installation

Either install globally:

```console
# Install cli
$ npm install -g @functional-bitcoin/cli@beta

# List available commands
$ fb --help 
```

Or install into local project and use with `npx`:

```console
# Install
$ yarn add @functional-bitcoin/cli@beta

# List available commands
$ npx fb --help 
```

## Usage

Initialise your working directory. This will generate a `.bit` environemnt file containing your publishing address and private key.

```console
$ fb init --help

$ fb init .
```

Create new functions. This will generate a blank function in the `src` folder of your working directory.

```console
$ fb new --help

$ fb new my/function -a arg1 -a arg2
```

Publish functions to the blockchain. It is necessary to fund your publishing address (in the `.bit` file) with a few satoshis before publishing.


```console
$ fb publish --help

$ fb publish my/function
```

## Functional Bitcoin protocol

Functional Bitcoin is an `OP_RETURN` protocol, following the [Bitcom Bitcoin Application Protocol](https://bitcom.bitdb.network) pattern with the prefix `1AKyFQWGGrpj1Nwp6H6uUEercQP213zj3P`. Functions are encoded in an `OP_RETURN` output as such:

```text
OP_RETURN
  [PROTOCOL_PREFIX] [NAME] [FUNCTION] [?VERSION]
```

The TXID from any transaction following this protocol provides a reference which can be used when composing Functional Bitcoin scripts. The TXID is a command, which can recieve any number of arguments, and return an output. In a script, functions are "piped" together so the output from the first function is passed to the next in sequence until a final result is returned.

```text
OP_RETURN
  [TXID] [ARG1] [ARG2] [ARG3] [ARG4] |
  [TXID] [ARG1] [ARG2] |
  [TXID] [ARG1] [ARG2]

```

## Creating functions

A generated function will look like this:

```javascript
module.exports = ({ ctx }, arg1, arg2) => {
  return ctx;
}
```

Functions are executed in scripts, in which the return value of each function is passed to the next function in the script as `ctx`. Each subsequent argument is received as a Buffer and it is up to the function to cast the Buffer into the desired type.

Functions are executed within a sandboxed node VM. Unless objects are explicitly exposed to the sandbox by [the agent](https://github.com/functional-bitcoin/agent), functions do not have access to the agent's environment or global variables. Functions cannot access environment variables, overwrite global functions, or do thing like `process.exit(0)`. [Read more here](https://github.com/functional-bitcoin/agent).

