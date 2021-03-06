const chalk     = require('chalk')
const inquirer  = require('inquirer')
const bsv       = require('bsv')
const bitindex  = require('../bitindex')

module.exports = {

  async run(argv) {
    if (!process.env.ADDRESS) {
      console.log('❗️', chalk.bold.red(`Wallet not found. Have you generated it?`))
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

    const tx = new bsv.Transaction()
      .from(utxos)
      .change(argv.address);

    const fee = tx._estimateFee()
    tx.fee(fee).sign(process.env.PRIVATE)

    const balance = (tx.outputs[0]._satoshis / 100000000).toFixed(8);
    
    console.log(`Sweeping balance of ${ chalk.white('\u20bf ' + balance) } into ${ chalk.white(argv.address) }`)
    return inquirer
      .prompt([{ type: 'confirm', name: 'proceed', message: 'Continue?', default: false }])
      .then(res => res.proceed ? tx : process.exit(0))
  }
}