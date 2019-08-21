const fs      = require('fs')
const chalk   = require('chalk')
const datapay = require('datapay')

// Functional Bitcoin protocol prefix
const protocolPrefix = '1PcsNYNzonE39gdZkvXEdt7TKBT5bXQoz4';

module.exports = {
  run(argv) {
    console.log('Publishing function…')
    console.log('>', chalk.white(argv.filePath) + '\n')

    if ( this.isReady(argv) ) {
      this.sendTransaction(argv)
    }    
  },

  isReady(argv) {
    if ( !fs.existsSync(argv.filePath) ) {
      console.log('  ❗️', chalk.bold.red(`${argv.name}.lua function file not found`))
      return false;
    }
    if ( !process.env.ADDRESS || !process.env.PRIVATE ) {
      console.log('  ❗️', chalk.bold.red("Please run 'fb init' to generate a keypair"))
      return false;
    }
    return true;
  },

  buildPayload(argv) {
    const script  = fs.readFileSync(argv.filePath, { encoding: 'utf8' }),
          data    = [protocolPrefix, script, argv.name];
    return {
      data,
      pay:  { key: process.env.PRIVATE }
    }
  },

  sendTransaction(argv) {
    const payload = this.buildPayload(argv)
    datapay.send(payload, function(err, tx) {
      if (err) console.error('ERR', err);
      if (tx) console.log('TX', tx);
    })
  }
}