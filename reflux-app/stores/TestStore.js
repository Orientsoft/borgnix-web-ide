import Reflux from 'reflux';
import TestActions from '../actions/TestActions';

let TestStore = Reflux.createStore({
  listenables: TestActions,

  onTest: function() {
    console.log('onTest')
    this.trigger()
  }
})

export default TestStore
