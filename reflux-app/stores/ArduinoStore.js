import Reflux from 'reflux'
import ArduinoActions from '../actions/ArduinoActions'
import TerminalActions from '../actions/TerminalActions'

import mqtt from 'mqtt'
import {SerialPort} from 'mqtt-serial'
import intelHex from 'intel-hex'
import stk500 from 'stk500'
import BAC from 'arduino-compiler/client'
import {MQTT_BROKER, AT_CMD} from '../constants'
import util from '../util'

import _ from 'lodash'
import promisify from 'es6-promisify'

let _mqttClient, _mqttSerialPort

let bac = new BAC({
  host: '',
  prefix: 'c'
})

let state = {
  uuid: '',
  token: '',
  board: 'uno'
}

let getMqttSerial = async function() {
  if (_mqttSerialPort) {
    console.log('_mqttSerialPort exists')
    return _mqttSerialPort
  }

  if (!_mqttClient)
    _mqttClient = mqtt.connect(MQTT_BROKER, {qos: 1})

  await new Promise(function(resolve, reject) {
    _mqttClient.once('connect', resolve)
    _mqttClient.once('error', reject)
  })

  _mqttSerialPort = new SerialPort({
    client: _mqttClient,
    transmitTopic: '',
    receiveTopic: ''
  })

  return _mqttSerialPort
}

let resetEsp = async function(serialPort) {
  let t = 1000
  serialPort.write(AT_CMD.SET_GPIO)
  await util.sleep(t)
  serialPort.write(AT_CMD.CLEAR_GPIO)
  await util.sleep(t)
  serialPort.write(AT_CMD.SET_GPIO)
}

let pingESP = async function(serialPort) {
  serialPort.write(AT_CMD.PING)
  await new Promise(function(resolve, reject) {
    serialPort.once('data', (data) => {
      if (data.toSring() === 'ESP PING_RSP\r\n')
      {
        console.log('pingESP OK')
        resolve()
      }
      else
      {
        console.log('pingESP error', data.toString())
        reject()
      }
    })
  })
}

let bootload = promisify(stk500.bootload.bind(stk500))

let flashHex = async function(hexFile, board) {
  let mqttSerialPort = await getMqttSerial()
  let hex = intelHex.parse(hexFile).data
  let uno = require('arduino-compiler/data/boards').uno
  let param = {
    name: 'uno',
    baud: parseInt(uno.upload.speed),
    signature: new Buffer(uno.signature, 'hex'),
    pageSize: 128,
    timeout: 2000
  }

  await pingESP(mqttSerialPort)
  console.log('Detected')
  await reset(mqttSerialPort)
  console.log('Reset')
  await bootload(mqttSerialPort, hex, param)
  console.log('Flashed')
}

let ArduinoStore = Reflux.createStore({
  listenables: ArduinoActions,

  onCompile: function(payload) {
    // TO DO : set icon
    console.log('onCompile1')

    TerminalActions.setTitle({title: 'Compiling...'})
    TerminalActions.appendContent({line: 'Start Compiling...'})

    console.log('onCompile')

    let opts = {
      type: 'arduono',
      name: payload.name,
      board: state.board
    }

    bac.compile(opts, (data) => {
      // TO DO : set icon
      TerminalActions.setTitle({title: data.status})
      TerminalActions.appendContent({line: data.content[data.status === 0 ? 'stdout' : 'stderr']})
    })
  },

  onFlash: function(payload) {
    TerminalActions.setTitle({title: 'Flashing...'})
    TerminalActions.appendContent({line: 'Start Flashing...'})

    console.log('onFlash')

    let hexOpts = {
      name: payload.name,
      board: payload.board,
      type: 'arduino'
    }

    bac.getHex(hexOpts, async (err, data) => {
      if (!err)
        await flashHex(data, 'uno')
      else
      {
        console.log('onFlash error', err)
        TerminalActions.setTitle({title: 'Error'})
        TerminalActions.appendContent({line: err})
      }

      if (_.isFunction(payload.callback))
        payload.callback(err)
    })
  },

  onSetBoard: function(payload) {
    state.board = board
  },

  onTest: function(payload) {
    console.log('onTest')
  }
})

export default ArduinoStore
