import React from 'react'
import TerminalActions from '../actions/TerminalActions'
import TerminalStore from '../stores/TerminalStore'
import _ from 'lodash'

class Terminal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: 'Ready.',
      content: [],
      foldFlag: true
    }
  }

  componentDidMount() {
    this.unsubscribe = TerminalStore.listen(function(state) {
      this.setState(state)
    }.bind(this))
  }

  componentWillUnmount() {
    if (_.isFunction(this.unsubscribe))
      this.unsubscribe()
  }

  onFoldClick(e) {
    TerminalActions.changeFold()
  }

  render() {
    let createLine = function(lineText, lineNo) {
      return <li key={lineNo}>{lineText}</li>
    }

    let buttom
    let content
    if (this.state.foldFlag)
    {
      if (this.state.content.length == 0)
      {
        buttom = <span
          className='pull-left glyphicon glyphicon-chevron-up'
          aria-hidden='true'>
          </span>
        content = <div />
      }
      else
      {
        buttom = <span
          onClick={this.onFoldClick}
          className='pull-left glyphicon glyphicon-chevron-up'
          aria-hidden='true'>
          </span>
        content = <div />
      }
    }
    else
    {
      buttom = <span
        onClick={this.onFoldClick}
        className='pull-left glyphicon glyphicon-chevron-down'
        aria-hidden='true'>
        </span>
      if (this.state.content)
      {
        content = <div><ul>{this.state.content.map(createLine)}</ul></div>
      }
    }

    return (
      <div>
        <div className='row'>
          <div className='col-xs-12'>{content}</div>
          <div className='row'>
            <div className='col-xs-12 clearfix'>
              {buttom}
              <div>{this.state.title}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Terminal.propTypes = {

}

Terminal.defaultProps = {

}

export default Terminal
