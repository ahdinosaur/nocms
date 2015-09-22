var vdom = require('virtual-dom')
var h = require('virtual-dom/h')
var a = require('state-atom')
var vraf = require('virtual-raf')
var extend = require('xtend')

// required for 'ev-*' event delegation to be handled correctly
require('dom-delegator')()

// setup observable state atom
var atom = a({
  isEditable: a.value(false),
  elementsInEdit: a.array([]),
  elements: a.varhash({
    0: Element({
      id: 0,
      tag: "main",
      properties: {
        id: 'the-one-and-only-root'
      },
      children: [1]
    }),
    1: Element({
      id: 1,
      tag: "header",
      properties: {
        className: 'top-of-the-page'
      },
      children: [2]
    }),
    2: Element({
      id: 2,
      tag: "a",
      properties: {
        href: "https://github.com/ahdinosaur",
        textContent: "yoooo!"
      }
    })
  })
})

console.log("initial state", atom())

// get dom tree given initial state
var tree = vraf(atom(), render, vdom)

// add dom tree to body
document.body.appendChild(tree.render())

// update dom tree on state change
atom(function onChange (state) {
  tree.update(state)
})

atom(function onChange (state) {
  console.log("new state", state)
})

/*
 * library
 *
*/

function Element (attrs) {
  // TODO better observable
  return a.value(attrs)
}

function render (state) {
  var root = first(state.elements)

  var renderEl = state.isEditable ?
    renderEditableElement :
    renderElement

  return renderAdminContainer(state, [
    renderEl(state, root)
  ])
}

function renderElement (state, element) {
  return h(
    element.tag,
    element.properties,
    renderChildren(state, element.children, renderElement)
  )
}

function renderEditableElement (state, element) {
  var editIndex = state.elementsInEdit.indexOf(element.id)
  if (editIndex !== -1) {
    return h('div', {}, [
      h('textarea', {
        id: element.id + '-edit', // HACK
        textContent: JSON.stringify(element, null, 2)
      }),
      h('button', {
        textContent: 'save',
        'ev-click': function (ev) {
          // TODO should be barracks action
          // get new content of element
          var contents = document.getElementById(element.id + '-edit').textContent // HACK
          // set new element content
          atom.elements.get(element.id).set(contents)
          // element is no longer in edit
          atom.elementsInEdit.splice(editIndex, 1)
        }
      })
    ].concat(renderChildren(state, element.children, renderEditableElement)))
  }

  return h(
    element.tag,
    extend(element.properties, {
      'ev-click': function (ev) {
        ev.preventDefault()
        // TODO should be barracks action
        console.log('clicked', element.id, 'ev', ev)
        atom.elementsInEdit.push(element.id)
      }
    }),
    renderChildren(state, element.children, renderEditableElement)
  )
}

function renderChildren (state, children, renderFn) {
  if (children == null) {
    return null
  }

  return children.map(function (childId) {
    var child = state.elements[childId]
    return renderFn(state, child)
  })
}

function renderAdminContainer (state, children) {
  return h('div.admin', {}, [
    h('button', {
      textContent: state.isEditable ? 'publish' : 'edit',
      'ev-click': function (ev) {
        // TODO should be a barracks action
        atom.isEditable.set(!atom.isEditable())
      }
    })
  ].concat(children))
}

/*
 * utils
 *
*/
function first (obj) {
  return obj[Object.keys(obj)[0]]
}
