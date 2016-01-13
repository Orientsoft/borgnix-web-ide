import React from 'react'
import ReactDom from 'react-dom'
import Editor from './components/Editor'
import Terminal from './components/Terminal'
import Toolbox from './components/Toolbox'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-xs-2'>
            <Toolbox />
          </div>
          <div className='col-xs-10'>
            <div className='row'>
              <div className='col-xs-12'>
                <Editor />
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-12'>
                <Terminal />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

App.propTypes = {

}

App.defaultProps = {

}

export default App
