process.argv.push('"dist/*.spec.js"', '--exit')
require('../node_modules/mocha/bin/mocha')
