import React from 'react'
import ProjectStore from '../../stores/ProjectStore'
import ProjectActions from '../../actions/ProjectActions'
import ClassNames from 'classnames'
import _ from 'lodash'
import Tree from 'react-ui-tree'

class Project extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentProject: null,
      projects: [],
      currentFile: null,
      activeNode: null,
      tree: { }
    }
  }

  componentDidMount() {
    this.unsubscribe = ProjectStore.listen(function(state) {
      this.setState(state);
    }.bind(this));

    ProjectActions.listProjects()
  }

  componentWillUnmount() {
    if (_.isFunction(this.unsubscribe))
      this.unsubscribe();
  }

  renderNode(node) {
    // console.log(node)
    if (node.type == 'file')
    {
      return (
        <span className={ClassNames('node', {
          'is-active': node === this.state.activeNode
          })} onClick={this.onClickNode.bind(null, node)}>
          {node.module}
          <a href='#'
            data-name={node.path}
            data-type='removeFile'
            onClick={this.handleProjectClick}>
            <span className='glyphicon glyphicon-remove'></span>
          </a>
        </span>
      )
    }
    else {
      return (
        <span className={ClassNames('node', {
          'is-active': node === this.state.activeNode
          })} onClick={this.onClickNode.bind(null, node)}>
          {node.module}
        </span>
      )
    }
  }

  onClickNode(node) {
    ProjectActions.changeCurrentFile({path: node.path})
  }

  handleChange(tree) {
    ProjectActions.changeTree(tree)
  }

  handleProjectClick(e) {
    if (e.currentTarget.dataset.type == 'createProject')
    {
      ProjectActions.createProject({name: $('#project-name-input').val(),
        type: 'default'})
      $('#project-name-input').val('')
    }
    else if (e.currentTarget.dataset.type == 'removeProject')
      ProjectActions.removeProject({name: e.currentTarget.dataset.name})
    else if (e.currentTarget.dataset.type == 'changeProject')
      ProjectActions.changeCurrentProject({currentProject: e.target.dataset.name})
    else if (e.currentTarget.dataset.type == 'createFile')
    {
      ProjectActions.createFile({path: $('#file-name-input').val()})
      $('#file-name-input').val('')
    }
    else if (e.currentTarget.dataset.type == 'removeFile')
      ProjectActions.removeFile({path: e.currentTarget.dataset.name})

    e.preventDefault()
  }

  render() {
    this.state.projects.map(function(project) {
      _.mapKeys(project, function(value, key){
        if (key === 'name')
          return 'module'
      })
    })

    var createProjectItem = function(project, index) {
      return (
        <li key={'project-' + index}>
          <span href='#'
            data-name={project.name}
            data-type='changeProject'
            onClick={this.handleProjectClick}>
            {project.name}
          </span>
          <a href='#'
            data-name={project.name}
            data-type='removeProject'
            onClick={this.handleProjectClick}>
            <span className='glyphicon glyphicon-remove'></span>
          </a>
        </li>
      )
    }

    return (
      <div div className='project-component-container'>
        <div className='project-list-container'>
          <h1>Projects</h1>
          <hr />
          <ul className='project-list'>
            {this.state.projects.map(createProjectItem.bind(this))}
          </ul>
        </div>
        <div className='add-project-container'>
          <div className='input-group'>
            <input id='project-name-input'
              type='text'
              className='form-control'
              placeholder='Project Name' />
            <span className='input-group-btn'>
              <button className='btn btn-default'
                type='button'
                data-type='createProject'
                onClick={this.handleProjectClick.bind(this)}>
                <span className='glyphicon glyphicon-plus'></span>
              </button>
            </span>
          </div>
        </div>
        <hr />
        <div className='file-container'>
          <div className='tree'>
            <Tree
              paddingLeft={20}
              tree={this.state.tree}
              onChange={this.handleChange}
              isNodeCollapsed={this.isNodeCollapsed}
              renderNode={this.renderNode.bind(this)}
            />
          </div>
          <div className='create-file-container'>
            <div className='input-group'>
              <input id='file-name-input'
                type='text'
                className='form-control'
                placeholder='File Name' />
              <span className='input-group-btn'>
                <button className='btn btn-default'
                  type='button'
                  data-type='createFile'
                  onClick={this.handleProjectClick.bind(this)}>
                  <span className='glyphicon glyphicon-plus'></span>
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Project.propTypes = {

}

Project.defaultProps = {

}

export default Project
