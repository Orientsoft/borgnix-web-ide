import Ace from 'react-ace'
import React from 'react'
import 'brace/mode/c_cpp'
import 'brace/theme/tomorrow'
import EditorStore from '../stores/EditorStore'
import EditorActions from '../actions/EditorActions'
import ProjectActions from '../actions/ProjectActions'

class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      content: ''
    }
  }

  componentDidMount() {
    this.unsubscribe = EditorStore.listen(function(state) {
      this.setState(state);
    }.bind(this));
  }

  componentWillUnmount() {
    if (_.isFunction(this.unsubscribe))
      this.unsubscribe();
  }

  onChange(content) {
    ProjectActions.updateCurrentFile({content: content})
  }

  render() {
    return (
      <div>
        <Ace mode='c_cpp'
          onChange={this.onChange}
          theme='tomorrow'
          value={this.state.content} />
      </div>
    )
  }
}

Editor.propTypes = {

}

Editor.defaultProps = {

}

export default Editor
