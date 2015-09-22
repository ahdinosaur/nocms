var Atom = require('state-atom')
var vdom = require('virtual-dom')
var vraf = require('virtual-raf')
var h = require('virtual-dom/h')

var atom = Atom({
  0: {
    id: 0,
    tag: "main",
    properties: {
      id: 'the-one-and-only-root'
    },
    children: [1]
  },
  1: {
    id: 1,
    tag: "header",
    properties: {
      className: 'top-of-the-page'
    },
    children: [2]
  },
  2: {
    id: 2,
    tag: "a",
    properties: {
      href: "https://github.com/ahdinosaur",
      textContent: "yoooo!"
    }
  }
})

function render (elements) {
  var root = first(elements)
  return renderElement(root, elements)
}

function renderElement (element, elements) {
  return h(
    element.tag,
    element.properties,
    element.children != null ?
      element.children.map(function (childId) {
        var child = elements[childId]
        return renderElement(child, elements)
      }) :
      null
  )
}

console.log("atom", atom())

// get dom tree given initial state
var tree = vraf(atom(), render, vdom)

// add dom tree to body
document.body.appendChild(tree.render())

// update dom tree on state change
atom(tree.update)

/*
 * utils
 *
 * TODO find / create modules
*/
function first (obj) {
  return obj[Object.keys(obj)[0]]
}
