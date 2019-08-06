const fs      = require('fs')
const path    = require('path')
const chalk   = require('chalk')
const shell   = require('shelljs')
const ejs     = require('ejs')

module.exports = {
  run(argv) {
    console.log('Creating new function…')
    console.log('>', chalk.white(argv.filePath) + '\n')
    // Create directory
    this.createDirectory(argv)
    // Create function template
    this.generateTemplate(argv)
  },

  createDirectory(argv) {
    const dir = path.dirname(argv.filePath);
    if ( !fs.existsSync(dir) ) {
      shell.mkdir('-p', dir)
    }
  },

  generateTemplate(argv) {
    if ( fs.existsSync(argv.filePath) ) {
      console.log('  ✅', `${argv.name}.lua function file already exists`)
    } else {
      const tmplFile  = path.join(__dirname, '../templates/function.lua.ejs'),
            template  = fs.readFileSync(tmplFile, { encoding: 'utf8' }),
            content   = ejs.render(template, argv);

      fs.writeFileSync(argv.filePath, content)
      console.log('  ✅', `${argv.name}.lua function file created`)
    }
  }
}
