var a = require('state-atom')

// setup observable state atom
module.exports = function () {
  return a({
    isEditable: a.value(false),
    elementsInEdit: a.varhash({}),
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
}

function Element (attrs) {
  // TODO better observable
  return a.value(attrs)
}

