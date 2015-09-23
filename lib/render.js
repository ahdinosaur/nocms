var h = require('virtual-dom/h')
var a = require('state-atom')
var extend = require('xtend')

//var actions = require('./actions')
// TODO with `barracks`

// required for 'ev-*' event delegation to be handled correctly
require('dom-delegator')()

module.exports = function renderObserv (observ) {

  return function render (atom) {

    // get state from time
    // or its a new state
    var state = atom.history[atom.time] || atom.state

    var root = first(state.elements)

    var renderEl = state.isEditable ?
      renderEditableElement :
      renderElement

    return renderAdminContainer(atom, [
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
    if (state.elementsInEdit[element.id]) {
      return h('div', {}, [
        h('textarea', {
          cols: '80',
          rows: '10',
          textContent: JSON.stringify(element, null, 2),
          'ev-input': function (ev) {
            // TODO should be barracks action
            console.log("input", ev)

            try {
              // get editor content
              var contents = JSON.parse(ev.target.value)
            } catch (err) {
              return console.log(err)
            }

            // set editor content
            observ.state.elementsInEdit.get(element.id).set(contents)
          }
        }),
        h('button', {
          textContent: 'save',
          'ev-click': function (ev) {
            // TODO should be barracks action
            console.log("saving", observ.state.elementsInEdit.get(element.id))

            // set edited contents
            observ.state.elements.get(element.id).set(
              state.elementsInEdit[element.id]
            )

            // element is no longer in edit
            observ.state.elementsInEdit.delete(element.id)
          }
        })
      ].concat(renderChildren(state, element.children, renderEditableElement)))
    }

    return h(
      element.tag,
      extend(element.properties, {
        'ev-click': function (ev) {
          if (!ev.ctrlKey) { return }
          ev.preventDefault()
          // TODO should be barracks action
          console.log('editing', element.id, 'ev', ev)
          observ.state.elementsInEdit.put(element.id, a.value(element))
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

  function renderAdminContainer (atom, children) {
    console.log("time", atom.time)
    var state = atom.state
    return h('div.admin', {}, [
      // edit mode button
      h('button', {
        textContent: atom.state.isEditable ? 'publish' : 'edit',
        'ev-click': function (ev) {
          // TODO should be a barracks action
          observ.state.isEditable.set(!atom.state.isEditable)
        }
      }),
      state.isEditable ? h('span', {
        textContent: "hold Ctrl and click on an element to edit it"
      }) : null
    ].concat(children).concat([
      // time travel control
      h('input', {
        type: 'range',
        min: 0,
        max: atom.history.length,
        'ev-change': function (ev) {
          console.log("on number input", ev.target.value)
          // TODO should be a barracks action
          observ.time.set(Number(ev.target.value))
        },
        // follow time if in front
        value: atom.time === atom.history.length ?
          atom.history.length :
          atom.time,
        style: {
          width: '100%'
        }
      })
    ]))
  }
}

/*
 * utils
 *
*/
function first (obj) {
  return obj[Object.keys(obj)[0]]
}
