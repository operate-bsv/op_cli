# Operate | CLI

Operate is an extensible Bitcoin meta programming protocol. It offers a way of constructing Turing Complete programs encapsulated in Bitcoin transactions that can be be used to process data, perform calculations and operations, and return any kind of result.

**Operate | CLI** is a node utility to help author and publish Ops (functions) on the Bitcoin (SV) blockchain.

More infomation:

* [Project website](https://www.operatebsv.org)

## Installation

```bash
# Install cli
> npm install -g operate-cli

# List available commands
> operate --help 
```

## Usage

Initialise your working directory. This will generate a `.bit` environemnt file containing your publishing address and private key.

```bash
> operate init --help

> operate init .
```

Create new functions. This will generate a blank function in the `src` folder of your working directory.

```bash
> operate new --help

> operate new my/function -a arg1 -a arg2
```

Publish functions to the blockchain. It is necessary to fund your publishing address (in the `.bit` file) with a few satoshis before publishing.


```bash
> operate publish --help

> operate publish my/function
```

## Creating functions

A generated function will look like this:

```lua
return function(state, arg1, arg2)
  return state
end
```

Functions are scripts that define a `main()` function, although within the script any other necessary functions, classes and variables can be defined. The script is written using Lua, and executed within a sandboxed environment with the `file` and `io` modules removed.

A function represents a "cell" - an atomic subroutine within a "tape" (a transaction output). The return value of each cell is passed to the next cell in the tape. Thus cell by cell the tapes' result is calculated - pure functional programming on bitcoin!
