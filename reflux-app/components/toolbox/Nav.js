import React from 'react'
import ToolboxActions from '../../actions/ToolboxActions'
import ArduinoActions from '../../actions/ArduinoActions'
import ArduinoStore from '../../actions/ArduinoStore'

class Nav extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  onClick(e) {
    if (e.target.dataset.type == 'Toolbox')
      ToolboxActions.updateActiveTool({activeTool: e.target.dataset.name});
    else if (e.target.dataset.type == 'Action')
    {
      if (e.target.dataset.name == 'Flash')
      {
        // TO DO : how to get name?
        // compile
        console.log('Flash')
        ArduinoActions.test();
        ArduinoActions.compile({name: ''})
        // flash
        ArduinoActions.flash({name: '', board: 'uno'})
      }
      else if (e.target.dataset.name == 'Verify')
      {
        // compile
        console.log('Compile')
        ArduinoActions.compile({name: ''})
      }
      else if (e.target.dataset.name == 'Fourm')
      {

      }
    }
  }

  render() {
    return (
      <div>
        <ul className='nav nav-pills nav-stacked'>
          <li
            role='presentation'
            className='active'>
            <span
              className='glyphicon glyphicon-flash'
              onClick={this.onClick}
              data-name='Flash'
              data-type='Action'>
            </span>
          </li>
          <li
            role='presentation'>
            <span
              className='glyphicon glyphicon-check'
              onClick={this.onClick}
              data-name='Verify'
              data-type='Action'>
            </span>
          </li>
        </ul>
        <ul className='nav nav-pills nav-stacked'>
          <li
            role='presentation'
            className='active'>
            <span
              className='glyphicon glyphicon-pencil'
              onClick={this.onClick}
              data-name='Project'
              data-type='Toolbox'>
            </span>
          </li>
          <li
            role='presentation'>
            <span
              className='glyphicon glyphicon-book'
              onClick={this.onClick}
              data-name='Library'
              data-type='Toolbox'>
            </span>
          </li>
          <li
            role='presentation'>
            <span
              className='glyphicon glyphicon-blackboard'
              onClick={this.onClick}
              data-name='Fourm'
              data-type='Action'>
            </span>
          </li>
        </ul>
      </div>
    )
  }
}

Nav.propTypes = {

}

Nav.defaultProps = {

}

export default Nav
