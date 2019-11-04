const chalk   = require('chalk')
const qrcode  = require('qrcode-terminal')
const bitindex  = require('../bitindex')

module.exports = {

  async run(argv) {
    if (!process.env.ADDRESS) {
      console.log('❗️', chalk.bold.red(`Wallet not found. Have you generated it?`))
      return false;
    }
    this.displayQRCode()
      .then(_ => bitindex.getUtxo(process.env.ADDRESS))
      .then(this.displayBalance)
      .catch(err  => console.log('\n  ❗️', chalk.red(err.message)))
  },

  displayQRCode() {
    return new Promise(resolve => {
      qrcode.generate(`bitcoin:${process.env.ADDRESS}?sv`, (code) => {
        console.log(code, '\n')
        resolve()
      })
    })
  },

  displayBalance(utxos) {
    const balance = utxos
        .map(utxo => utxo.satoshis)
        .reduce((total, amt) => total + (amt/100000000), 0)
        .toFixed(8)
    console.log('Address:', chalk.blue.bold(process.env.ADDRESS))
    console.log('Balance:', chalk.white('\u20bf ' + balance))
    if (balance === 0) {
      console.log('\n  🚀', chalk.red('Get started by sending a small amount of Bitcoin SV to your address.'))
    }
  }

}