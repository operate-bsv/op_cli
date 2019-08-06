[![license](https://img.shields.io/github/license/functional-bitcoin/library.svg)](https://github.com/functional-bitcoin/library/blob/master/license.md)

# Functional Bitcoin :: CLI

**🚨 Alert: Functional Bitcoin is VERY beta software with frequent breaking changes. Brave pioneers only until the beta tag is removed.**

Command line utility to help author and publish functions to the Bitcoin (SV) blockchain, for use in extensible Bitcoin application protocols.

## Installation

```console
# Install cli
$ npm install -g @functional-bitcoin/cli@beta

# List available commands
$ fb --help 
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

## Creating functions

A generated function will look like this:

```lua
function main(ctx, arg1, arg2)
  return ctx
end
```

Functions are scripts that define a `main()` function, although within the script any other necessary functions, classes and variables can be defined. The script is written using Lua, and executed within a sandboxed environment with the `file` and `io` modules removed.

A function represents a "cell" - an atomic subroutine within a "tape" (a transaction output). The return value of each cell is passed to the next cell in the tape. Thus cell by cell the tapes' result is calculated - pure functional programming on bitcoin!
