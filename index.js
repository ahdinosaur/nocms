var model = require('./lib/model')
var view = require('./lib/view')
var loop = require('./lib/loop')

var atom = model()
var dom = loop(atom, view)

// view dom to body
document.body.appendChild(dom.view())
