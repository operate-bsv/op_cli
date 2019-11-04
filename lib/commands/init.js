const fs      = require('fs')
const path    = require('path')
const dotenv  = require('dotenv')
const chalk   = require('chalk')
const shell   = require('shelljs')
const bsv     = require('bsv')

const wallet    = require('./wallet')

module.exports = {

  run(argv) {
    console.log('Initiating new project…')
    console.log('>', chalk.white(argv.path) + '\n')
    // Create directory
    this.createDirectory(argv)
    // Create .bit config file
    this.createKeys(argv)
    // Display QR code and banner
    wallet.run()
  },

  createDirectory(argv) {
    if ( fs.existsSync(argv.path) ) {
      console.log('✅', 'Directory already exists')
    } else {
      shell.mkdir(argv.path)
      console.log('✅', 'Directory created')
    }
  },

  createKeys(argv) {
    const bitFile = path.join(argv.path, '.bit')
    if ( fs.existsSync(bitFile) ) {
      console.log('✅', '.bit config file already exists')
    } else {
      const key = new bsv.PrivateKey();
      const bitVars = {
        ADDRESS:  key.toAddress().toString(),
        PUBLIC:   key.toPublicKey().toString(),
        PRIVATE:  key.toWIF().toString()
      }
      const content = Object.keys(bitVars).map(k => `${k}=${bitVars[k]}`).join('\n');
      fs.writeFileSync(bitFile, content)
      dotenv.config({ path: bitFile })
      console.log('✅', '.bit config file created')
      console.log('🚨', chalk.bold.red('Remember to add .bit to your .gitignore file'))
    }
  }

}