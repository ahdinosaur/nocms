var vdom = require('virtual-dom')
var vraf = require('virtual-raf')
var increment = require('observ-increment')

module.exports = loop

function loop (observ, render) {
  // get dom tree given initial state
  var tree = vraf(observ(), render(observ), vdom)

  // update dom tree on state change
  observ(function updateTree (state) {
    tree.update(state)
  })

  // save history
  var pushed
  observ.state(function saveHistory (state) {

    // if time if shorter than history, cut history
    var atom = observ()
    var timeDiff = atom.history.length - atom.time
    if (timeDiff > 0) {
      observ.history.splice(atom.time, timeDiff)
    }

    // push history
    observ.history.push(state)
    // increment time
    increment(observ.time)
  })

  return tree
}
