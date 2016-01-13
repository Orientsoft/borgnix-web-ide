import Reflux from 'reflux'
import EditorActions from '../actions/EditorActions'

let state = {
  content: ''
}

let EditorStore = Reflux.createStore({
  listenables: EditorActions,

  onLoadContent: function(payload) {
    state.content = payload.content
    this.trigger(state)
    return EditorActions.loadContent.completed()
  }
})

export default EditorStore
