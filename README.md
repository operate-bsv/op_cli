# Operate | CLI

Operate command line utility to help developers author and publish Ops (functions) on the BSV blockchain.

## About Operate

Operate is a toolset to help developers build applications, games and services on top of Bitcoin (SV). It lets you write functions, called "Ops", and enables transactions to become small but powerful programs, capable of delivering new classes of services layered over Bitcoin.

More infomation:

* [Project website](https://www.operatebsv.org)

## Installation

The CLI is a `npm` package. It can be installed using `npm` or `yarn`.

```bash
# Install with npm
> npm install -g @operate/cli

# Install with yarn
> yarn global add @operate/cli
```

## Usage

### Getting started

Initialise your working directory. This will generate a `.bit` environemnt file containing your publishing address and private key.

```bash
> operate init .
```

You will need to fund your publishing wallet before publishing any Ops. From within your working directory, use the `wallet` command to see your wallet address and balance.

```bash
> operate wallet
```

### Getting help

The CLI can list all available commands and provide usage instructions.

```bash
# List available commands
> operate --help 

# Get help on any command
> operate [command] --help
```

### Creating/publishing functions

Use the `new` command to generate a new blank function in the `src` folder of your working directory.

```bash
> operate new my/function -a arg1 -a arg2
```

### Publish a function

When ready (and your publishing wallet is funded), use the `publish` command to publish the Op to the blockchain.


```bash
> operate publish my/function
```

## Writing Ops

An Op is a function written in Lua. A generated function will look like this:

```lua
--[[
Document the function
]]--
return function(state, arg1, arg2, ...)
  state = state or {}
  -- Code here
  return state
end
```

The first argument of the function is always the `state`. Where a function is called in the first cell of a tape, the state will default to `nil` so your function should handle that.

The function can receive any number of arguments, as defined by your protocol's parameters. Within the body of the function, those arguments can be used to mutate the state in any way before returning a new, modified state.

The comment block immediately prior to the function should be used to add documentation and examples. Any Markdown formatted text can be placed here.

* [Learn more about writing Ops](https://www.operatebsv.org/docs)

## License

[MIT](https://github.com/operate-bsv/op_cli/blob/master/LICENSE.md)

© Copyright 2019 Chronos Labs Ltd.