# no cms

a content management system that doesn't suck

## principles

- represent each page as json objects
  - each json object is a virtual dom element
  - shared virtual dom partials
  - shared data objects
- unidirectional data flow to update tree
  - snapshot state as flat graph of elements
  - log of action objects (kappa architecture)
- edit mode
  - click on element to get codepen view (html, css, js, preview)
  - time travel through history
  - save snapshots as releases
  - release triggers server-side render

## design

### modules

- [virtual-dom](https://www.npmjs.com/package/virtual-dom): virtual dom
- [virtual-raf](https://www.npmjs.com/package/virtual-raf): render loop
- [state-atom](https://github.com/yoshuawuyts/state-atom): observable state atom
- [barracks](https://github.com/yoshuawuyts/barracks): action dispatcher
- [jiff](https://www.npmjs.com/package/jiff): json diff and patch

### data structures

elements are represented as a json object based on [virtual-hyperscript](https://github.com/Matt-Esch/virtual-dom/tree/master/virtual-hyperscript), with `id`, `tag`, `properties`, and `children` ([`id`]).

```json
{
  "id": 0,
  "tag": "a",
  "properties": {
    "href": "http://github.com/ahdinosaur"
  }
  children: [1, 2]
}
```

### actions

- element:create (state)
- element:update (state)
- element:patch (patch)
- element:remove (id)
