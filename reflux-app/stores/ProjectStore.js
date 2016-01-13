import Reflux from 'reflux'
import ProjectActions from '../actions/ProjectActions'
import EditorActions from '../actions/EditorActions'
import ProjectManager from 'borgnix-project-manager/lib/new-client'
import _ from 'lodash'

let pm = new ProjectManager({
  host: '',
  prefix: '/p'
})

let state = {
  currentProject: '',
  projects: [],
  currentFile: '',
  activeNode: null,
  tree: { }
}

function layout2Tree(tree) {
  tree.module = tree.name
  if (tree.children !== undefined)
    tree.children.map(child => {
      layout2Tree(child)
    })
}

function getProjectByName(name) {
  return _.find(state.projects, {name: name})
}

function getCurrentProject() {
  return getProjectByName(state.currentProject)
}

function getFileByName(project, name) {
  return project ? _.find(project.files, {path: name}) : null
}

let ProjectStore = Reflux.createStore({
  listenables: ProjectActions,

  onChangeTree: function(payload) {
    state.tree = payload
    // TO DO : reconstruct filesystem
    this.trigger(state)
  },

  onListProjects: async function(payload) {
    let opts = { type: 'arduino' }

    let res = await pm.listProjects(opts)

    if (res.status !== 0)
      return ProjectActions.listProjects.failed(res.content)

    state.projects = res.content.map((project)=> {
      project.files = project.files.map((file) => {
        let oldProject = getProjectByName(project.name)
        let oldFile = getFileByName(project, file.name)
        file.open = oldFile ? oldFile.open : false
        return file
      })
      return project
    })

    state.currentProject = state.currentProject || _.get(state, 'projects[0].name')
    state.currentFile = state.currentFile || _.get(state, 'projects[0].files[0].path')

    let project = getCurrentProject()
    state.tree = project.layout
    layout2Tree(state.tree)

    this.trigger(state)

    return ProjectActions.listProjects.completed()
  },

  onCreateProject: async function(payload) {
    let opts = {
      type: 'arduino',
      name: payload.name,
      tpl: payload.tpl
    }

    let res = await pm.createProject(opts)
    if (res.status !== 0)
      return ProjectActions.createProject.failed(res.content)

    let project = res.content
    project.files = project.files.map((file, index) => {
      file.open = (index === 0)
      return file
    })

    state.projects = state.projects.concat([project])
    state.currentProject = project.name
    state.currentFile = _.get(project.files, {open: true})

    this.trigger(state)
    return ProjectActions.createProject.completed()
  },

  onRemoveProject: async function(payload) {
    if (!getProjectByName(payload.name))
      return ProjectActions.removeProject.failed('Project Not Found')

    let opts = {
      type: 'arduino',
      name: payload.name
    }

    let res = await pm.deleteProject(opts)
    if (res.status !== 0)
      return ProjectActions.removeProject.failed(res.content)

    _.remove(state.projects, {name: payload.name})
    if (state.currentProject === payload.name)
      state.currentProject = _.get(state, 'projects[0].name')

    this.trigger(state)
    return ProjectActions.removeProject.completed()
  },

  onChangeCurrentProject: async function(payload) {
    let project = getCurrentProject()

    if (project && state.currentProject !== payload.currentProject)
    {
      state.currentProject = payload.currentProject
      project = getCurrentProject()
      if (!_.find(project.files, {open: true})) {
        project.files[0].open = true
      }
      state.currentFile = _.find(project.files, {open: true}).path
    }

    state.tree = project.layout
    layout2Tree(state.tree)

    this.trigger(state)
    return ProjectActions.changeCurrentProject.completed()
  },

  onCreateFile: async function(payload)
  {
    let project = getCurrentProject()

    if (getFileByName(project, payload.path))
      return ProjectActions.createFile.failed('File Already Exists')

    let opts = {
      type: 'arduino',
      name: state.currentProject,
      files: [{
        path: payload.path,
        content: ''
      }]
    }

    let res = await pm.createFile(opts)
    if (res.status !== 0)
      return ProjectActions.createFile.failed(res.content)

    getCurrentProject.layout = res.content

    let file = opts.files[0]
    file.open = true
    project.files.push(opts.files[0])
    state.currentFile = file.path

    state.tree = res.content
    layout2Tree(state.tree)

    this.trigger(state)
    return ProjectActions.createFile.completed()
  },

  onRemoveFile: async function(payload) {
    let opts = {
      type: 'arduino',
      name: state.currentProject,
      files: [payload.path]
    }

    let res = pm.deleteFiles(opts)
    if (res.status !== 0)
      return ProjectActions.removeFile.failed(res.content)

    let project = getCurrentProject()
    project.layout = res.content

    _.remove(project.files, {path: payload.path})

    this.trigger(state)
    return ProjectActions.removeFile.completed()
  },

  onChangeCurrentFile: async function(payload) {
    let project = getCurrentProject()
    let file = getFileByName(project, payload.path)

    if (file)
    {
      file.open = true
      state.currentFile = payload.path
      EditorActions.loadContent({content: file.content})

      this.trigger(state)
    }

    return ProjectActions.changeCurrentFile.completed()
  },

  onUpdateCurrentFile: async function(payload) {
    let project = getCurrentProject()
    let file = getFileByName(project, state.currentFile)
    file.content = payload.content

    let opts = {
      type: 'arduino',
      name: state.currentProject,
      files: [file]
    }

    let res = await pm.updateFiles(opts)
    if (res.status !== 0)
      return ProjectActions.updateCurrentFile.failed(res.content)

    this.trigger(state)
    return ProjectActions.updateCurrentFile.completed()
  },

  onCreateDir: async function(payload) {
    let project = getCurrentProject()

    let opts = {
      type: 'arduino',
      name: state.currentProject,
      dirs: [payload.dir]
    }

    if (dirExists(project, payload.dir))
      ProjectActions.createDir.failed('Directory Already Exists')

    let res = await pm.createDirs(opts)
    if (res.status !== 0)
      ProjectActions.createDir.failed(res.content)

    project.layout = res.content

    this.trigger(state)
    return ProjectActions.createDir.completed()
  },

  onRemoveDir: async function(payload) {
    let project = getCurrentProject()

    let opts = {
      type: 'arduino',
      name: state.currentProject,
      files: [payload.dir]
    }

    let res = await pm.deleteFiles(opts)
    if (res.status !==0)
      return ProjectActions.removeDir.failed(res.content)

    project.layout = res.content

    _.remove(project.files, (file) => {
      return file.path.indexOf(dir) === 0
    })

    this.trigger(state)
    return ProjectActions.removeDir.completed()
  }
})

export default ProjectStore
