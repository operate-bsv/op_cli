const chalk   = require('chalk')
const qrcode  = require('qrcode-terminal')
const datapay = require('datapay')

module.exports = {

  async run(argv) {
    await this.displayQRCode()
    this.displayBalance()
  },

  displayQRCode() {
    qrcode.generate(`bitcoin:${process.env.ADDRESS}?sv`, (code) => {
      console.log('\n' + code)
    })
  },

  displayBalance() {
    datapay.connect('https://bchsvexplorer.com').address(process.env.ADDRESS, (err, info) => {
      if (err) throw err;
      console.log('\n  Address:', chalk.blue.bold(process.env.ADDRESS))
      console.log('  Balance:', chalk.white('\u20bf ' + info.balance))
      if (info.balance === 0) {
        console.log('\n  🚀', chalk.red('Get started by sending a small amount of Bitcoin SV to your address.'))
      }
    })
  }

}