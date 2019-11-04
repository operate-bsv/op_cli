const fs        = require('fs')
const chalk     = require('chalk')
const inquirer  = require('inquirer')
const bsv       = require('bsv')
const bitindex  = require('../bitindex')

// Operate protocol prefix
const protocolPrefix = '1PcsNYNzonE39gdZkvXEdt7TKBT5bXQoz4';

module.exports = {
  run(argv) {
    console.log('Publishing Op…')
    console.log('>', chalk.white(argv.filePath) + '\n')

    if ( !process.env.ADDRESS || !process.env.PRIVATE ) {
      console.log('❗️', chalk.bold.red('Wallet not found. Have you generated it?'))
      return false;
    }
    if ( !fs.existsSync(argv.filePath) ) {
      console.log('❗️', chalk.bold.red(`${argv.name}.lua function file not found`))
      return false;
    }

    bitindex.getUtxo(process.env.ADDRESS)
      .then(utxos => utxos.map(bsv.Transaction.UnspentOutput))
      .then(utxos => this.buildTx(argv, utxos))
      .then(tx    => bitindex.sendTx(tx))
      .then(txid  => console.log(chalk.gray('TXID'), chalk.white.bold(txid), '✅'))
      .catch(err  => console.log('❗️', chalk.red(err.message)))
  },

  buildTx(argv, utxos) {
    if (!utxos.length) throw new Error('No UTXOs to sweep.');

    const op = fs.readFileSync(argv.filePath, { encoding: 'utf8' }),
          data = [protocolPrefix, op, argv.name],
          script = bsv.Script.buildSafeDataOut(data),
          tx = new bsv.Transaction()
            .from(utxos)
            .change(process.env.ADDRESS)
            .addOutput(new bsv.Transaction.Output({ script, satoshis: 0 }));

    const fee = tx._estimateFee()
    tx.fee(fee).sign(process.env.PRIVATE)

    const amount = (fee / 100000000).toFixed(8);
    
    console.log(`Publishing Op at cost of ${ chalk.white('\u20bf ' + amount) }`)
    return inquirer
      .prompt([{ type: 'confirm', name: 'proceed', message: 'Continue?', default: false }])
      .then(res => res.proceed ? tx : process.exit(0))
  }
}