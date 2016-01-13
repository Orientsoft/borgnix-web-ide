import Reflux from 'reflux'
import NavActions from '../actions/NavActions'
import ToolboxActions from '../actions/ToolboxActions'

let state = {

}

let NavStore = Reflux.createStore({
  listenables: NavActions,

  onFlash: function(payload) {

  },

  onVerify: function(payload) {

  },

  onSave: function(payload) {

  },

  onLoadProject: function(payload) {
    ToolboxActions.updateActiveTool({activeTool: 'Project'})
  },

  onLoadLib: function(payload) {
    ToolboxActions.updateActiveTool({activeTool: 'Library'})
  }
})

export default NavStore
