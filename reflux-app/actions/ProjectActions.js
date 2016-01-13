import Reflux from 'reflux'

let ProjectActions = Reflux.createActions({
  'changeTree': {asyncResult: true},
  'createProject': {asyncResult: true},
  'removeProject': {asyncResult: true},
  'listProjects': {asyncResult: true},
  'changeCurrentProject': {asyncResult: true},
  'createFile': {asyncResult: true},
  'removeFile': {asyncResult: true},
  'changeCurrentFile': {asyncResult: true},
  'updateCurrentFile': {asyncResult: true},
  'createDir': {asyncResult: true},
  'removeDir': {asyncResult: true}
})

export default ProjectActions
