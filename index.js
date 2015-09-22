var state = require('./lib/state')
var loop = require('./lib/loop')
var render = require('./lib/render')

var atom = state()
var dom = loop(atom, render)

// set atom to module
module.exports = atom

// render dom to body
document.body.appendChild(dom.render())
