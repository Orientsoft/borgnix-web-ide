import Reflux from 'reflux';
import TerminalActions from '../actions/TerminalActions';
import {maxLineCount} from '../constants';

let state = {
  title: 'Ready.',
  content: [],
  foldFlag: true
};

let TerminalStore = Reflux.createStore({
  listenables: TerminalActions,

  onChangeFold: function(payload) {
    state.foldFlag = !state.foldFlag;
    this.trigger(state);
  },

  onSetTitle: function(payload) {
    state.title = payload.title;
    this.trigger(state);
  },

  onAppendContent: function(payload) {
    // consider maxLineCount
    if (state.content.length == maxLineCount)
      state.content.pop()

    state.content.push(payload.line);

    this.trigger(state);
  }
})

export default TerminalStore
