#!/usr/bin/env node

const fs = require('fs')
const shells = require('shells')()
const binDir = './node_modules/.bin'
const comment = `
# allow locally installed npm binaries to be executed;
# added by \`npm i -g add-local-binaries-to-path\``

if (!shells.length) {
  console.error("Could not find any config files for bash, fish, or zsh!")
  process.exit(1)
}

shells.forEach(shell => {
  var config = fs.readFileSync(shell.file, 'utf8')

  if (config.match(binDir)) {
    console.log(`${shell.file} already contains ${binDir} mojo; skipping`)
    return
  }

  var cmd = (shell.type === 'fish')
    ? `set -gx PATH \$PATH ${binDir}`
    : `export PATH="$PATH:${binDir}"`

  config += `${comment}\n${cmd}`
  fs.writeFileSync(shell.file, config)

  console.log(`${shell.file} updated with \`${cmd}\``)
})

console.log(`
Done! Restart your shell(s) and give the comands below a try. You should see
that shrug is now executable within the foo directory, even though it's not
globally installed.

mkdir foo
cd foo
npm init --yes
npm i shrug --save
shrug
which shrug
`)
