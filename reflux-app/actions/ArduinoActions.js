import Reflux from 'reflux'

let ArduinoActions = Reflux.createActions([
  'compile',
  'flash',
  'setBoard',
  'test'
])

export default ArduinoActions
