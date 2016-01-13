import Reflux from 'reflux'

let EditorActions = Reflux.createActions({
  'loadContent': {asyncResult: true}
})

export default EditorActions
