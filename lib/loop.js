var vdom = require('virtual-dom')
var vraf = require('virtual-raf')

module.exports = loop

function loop (observ, render) {
  // get dom tree given initial state
  var tree = vraf(observ(), render(observ), vdom)

  // update dom tree on state change
  observ(function onChange (state) {
    tree.update(state)
  })

  return tree
}
