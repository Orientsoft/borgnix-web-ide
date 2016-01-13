import React from 'react'

class Library extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      libraries: []
    }
  }

  render() {
    var createOfficalLib = function(lib, index) {
      if (lib.type == 'offical')
      {
        var button;
        if (lib.useFlag == true)
          button = <span className='glyphicon glyphicon-minus'></span>
        else if (lib.useFlag == false)
          button = <span className='glyphicon glyphicon-plus'></span>

        var key = 'offical_' + index;
        return <li key={key}>{lib.name}{button}</li>;
      }
    }

    var createUserLib = function(lib, index) {
      if (lib.type == 'user')
      {
        var button;
        if (lib.useFlag == true)
          button = <span className='glyphicon glyphicon-minus'></span>
        else if (lib.useFlag == false)
          button = <span className='glyphicon glyphicon-plus'></span>

        var key = 'user_' + index
        return <li key={key}>{lib.name}{button}</li>
      }
    }

    return (
      <div>
        <h1>Libraries</h1>
        <hr />
        <h2>Offical Libraries</h2>
        <ul>
          {this.state.libraries.map(createOfficalLib)}
        </ul>
        <h2>User Libraries</h2>
        <ul>
          {this.state.libraries.map(createUserLib)}
        </ul>
      </div>
    )
  }
}

Library.propTypes = {

}

Library.defaultProps = {

}

export default Library
