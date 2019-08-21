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
const info    = require('./commands/info')
const newFunc = require('./commands/new')
const publish = require('./commands/publish')

// CLI Banner
console.log('\n' + chalk.green.bold('Functional Bitcoin'))
console.log(chalk.grey.italic('fb-cli'), chalk.grey(`(v ${chalk.white(version)})`) + '\n')

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
   * Create a new function library
   */
  .command('init [path]', 'Create a new function library',
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
   * Command: init [path]
   * Builds a new fb-publish project
   */
  .command('info', 'Show library info',
    (yargs) => { },
    (argv) => info.run(argv)
  )

  /**
   * Command: new [name]
   * Create a new function
   */
  .command('new [name]', 'Create a new function',
    (yargs) => {
      yargs
        .positional('name', {
          describe: 'function name in format "namespace/name"',
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
   * Publish function to blockchain
   */
  .command('publish [name]', 'Publish function to blockchain',
    (yargs) => {
      yargs
        .positional('name', {
          describe: 'function name in format "namespace/name"',
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

  .recommendCommands()
  .version(false)
  .argv
