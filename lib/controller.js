var barracks = require('barracks')
var jiff = require('jiff')
var get = require('get-in')
var a = require('state-atom')

module.exports = function create (model) {
  var controller = barracks()

  controller.on('patch', function (path, value) {
    var patchee = get(model, path)
    if (patchee == null) {
      var patcheeParent = get(model, path.splice(path.length - 1))
      pacheeParent.put(a.value(value))
      return
    }
    var patch = jiff.diff(model(), value)
    patchee.set(jiff.patch(patch, model()))
  }

  controller.on('toggleEdit', function () {
    controller(
      'patch',
      ['isEditable'],
      !get(model, ['isEditable'])()
    )
  })

  controller.on('element:open', function (element) {
    controller(
      'patch',
      ['elementsInEdit', element.id],
      element
    )
  })

  controller.on('element:edit', fuction (contents) {
    try {
      // get editor content
      var element = JSON.parse(contents)
    } catch (err) {
      return console.log(err)
    }

    // set editor content
    controller(
      'patch', // action type
      ['elementsInEdit', element.id], // path
      element // update 
    )
  })


  controller.on('element:save', function (element) {
    // set edited content
    controller(
      'patch', // action type
      ['elements', element.id], // path
      get(model, ['elementsInEdit', element.id])() // update
    )
    // element is no longer in edit
    controller(
      'patch', // action type
      ['elementsInEdit', element.id], // path
      undefined // update 
    )
  })
}
