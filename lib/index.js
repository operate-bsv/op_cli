#!/usr/bin/env node
const path    = require('path')
const dotenv  = require('dotenv')
const yargs   = require('yargs')
const chalk   = require('chalk')

dotenv.config({
  path: path.resolve(process.cwd(), '.bit')
})

const version = require('../package.json').version
const init    = require('./commands/init')
const newFunc = require('./commands/new')
const publish = require('./commands/publish')
const wallet  = require('./commands/wallet')
const sweep   = require('./commands/sweep')

// CLI Banner
console.log( chalk.gray('-'.repeat(21)) )
console.log(
  chalk.white.bold('Operate')
  + chalk.magenta.bold(' | ')
  + chalk.white('CLI')
)
console.log( chalk.grey.italic('v' + version) )
console.log( chalk.gray('-'.repeat(21)) )
console.log( '👉 ' + chalk.cyan('www.operatebsv.org') + '\n')

const helper = {
  coerceName(arg) {
    return arg
      .replace(/([a-z])([A-Z])/, (m, p1, p2) => `${p1}_${p2}`)
      .replace(/\-/, '_')
      .toLowerCase();
  },

  setPath(argv) {
    const filePath = path.resolve('src', argv.name.concat('.lua'));
    return { filePath };
  },

  validateName(arg) {
    if ( !/^[a-z0-9_\-\/]+$/i.test(arg) ) {
      throw `Invalid name: ${arg}`
    }
  }
}

yargs
  /**
   * Command: init [path]
   * Initiate a new Op library
   */
  .command('init [path]', 'Initiate a new Op library',
    (yargs) => {
      yargs
        .positional('path', {
          describe: 'path in which to create project',
          default: '.'
        })
        .coerce('path', arg => {
          return path.resolve(arg);
        })
    },
    (argv) => init.run(argv)
  )

  /**
   * Command: new [name]
   * Create a new Op
   */
  .command('new [name]', 'Create a new Op',
    (yargs) => {
      yargs
        .positional('name', {
          describe: 'Op name in format "namespace/name"',
        })
        .option('args', {
          alias: 'a',
          describe: 'list of function arguments',
          type: 'array'
        })
        .demandOption(['name'])
        .coerce('name', helper.coerceName)
        .middleware(helper.setPath)
        .check(argv => {
          helper.validateName(argv.name)
          return true;
        })
    },
    (argv) => newFunc.run(argv)
  )

  /**
   * Command: publish [name]
   * Publish Op to blockchain
   */
  .command('publish [name]', 'Publish Op to blockchain',
    (yargs) => {
      yargs
        .positional('name', {
          describe: 'Op name in format "namespace/name"',
        })
        .demandOption(['name'])
        .coerce('name', helper.coerceName)
        .middleware(helper.setPath)
        .check(argv => {
          helper.validateName(argv.name)
          return true;
        })
    },
    (argv) => publish.run(argv)
  )

  /**
   * Command: wallet
   * Show wallet balance and deposit address
   */
  .command('wallet', 'Show wallet balance and deposit address',
    (yargs) => {
      yargs
        /**
         * Command: wallet:sweep [address]
         * Split wallet UTXOs
         */
        .command('sweep [address]', 'Sweep wallet UTXOs into another address',
          (yargs) => {
            yargs
              .positional('address', {
                describe: 'Bitcoin address to send wallet balance to',
              })
              .demandOption('address', 'Address is required')
          },
          (argv) => sweep.run(argv)
        )
    },
    (argv) => wallet.run(argv)
  )

  .scriptName('operate')
  .recommendCommands()
  .version(false)
  .argv
