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
  observ(function saveHistory (state) {
    // push history once per process tick
    if (!pushed) {
      pushed = true

      // if time if shorter than history, cut history
      var timeDiff = state.history.length - state.time
      observ.history.splice(state.time, timeDiff)

      // push history
      observ.history.push(state)
      // increment time
      increment(observ.time)

      // push history once per process tick
      process.nextTick(function () { pushed = false })
    }
  })

  return tree
}
