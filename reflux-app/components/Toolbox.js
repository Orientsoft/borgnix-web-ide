import React from 'react'
import ToolboxStore from '../stores/ToolboxStore'
import Nav from './toolbox/Nav'
import Project from './toolbox/Project'
import Library from './toolbox/Library'
import ProjectActions from '../actions/ProjectActions'

class Toolbox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTool: ''
    }
  }

  componentDidMount() {
    this.unsubscribe = ToolboxStore.listen(function(state) {
      this.setState(state)
    }.bind(this))
  }

  componentWillUnmount() {
    if (_.isFunction(this.unsubscribe))
      this.unsubscribe()
  }

  render() {
    let panel;
    if (this.state.activeTool == 'Library')
      panel = <Library />
    else if (this.state.activeTool == 'Project')
      panel = <Project />
    else
      panel = <div />

    return (
      <div className='row'>
        <div className='col-xs-2'>
          <Nav />
        </div>
        <div className='col-xs-10'>
          {panel}
        </div>
      </div>
    )
  }
}

Toolbox.propTypes = {

}

Toolbox.defaultProps = {

}

export default Toolbox
