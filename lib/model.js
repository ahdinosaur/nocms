var a = require('state-atom')

// setup observable state atom
module.exports = function () {
  return a({
    time: a.value(0),
    history: a.array([]),
    state: a.struct({
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
          children: [2, 4]
        }),
        2: Element({
          id: 2,
          tag: "h1",
          children: [3]
        }),
        3: Element({
          id: 3,
          tag: "a",
          properties: {
            href: "https://github.com/ahdinosaur",
            textContent: "yoooo!"
          }
        }),
        4: Element({
          id: 4,
          tag: "img",
          properties: {
            src: 'http://imgs.xkcd.com/comics/barrel_cropped_(1).jpg'
          }
        })
      })
    })
  })
}

function Element (attrs) {
  // TODO better observable
  return a.value(attrs)
}

