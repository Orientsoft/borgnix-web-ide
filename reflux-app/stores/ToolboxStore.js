import Reflux from 'reflux'
import ToolboxActions from '../actions/ToolboxActions'

let state = {
  activeTool: '',
  libraries: [{name:'test1', type:'user', useFlag:true}, {name:'test2', type:'offical', useFlag:false}]
}

let ToolboxStore = Reflux.createStore({
  listenables: ToolboxActions,

  onUpdateActiveTool: function(payload) {
    state.activeTool = payload.activeTool;
    this.trigger(state);
  }
});

export default ToolboxStore
